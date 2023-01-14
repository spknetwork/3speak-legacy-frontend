const PAYOUT_HELPER = {
  totalPostPayout: (post) => {
    return post.payout
  },
  totalRshares: (post) => {
    return post.active_votes.reduce((a, b) => a + parseFloat(b.rshares), 0)
  },
  ratio: (post) => {
    return PAYOUT_HELPER.totalPostPayout(post) / PAYOUT_HELPER.totalRshares(post) || 0
  },
  voteValue: (vote, post) => {
    const ratio = PAYOUT_HELPER.ratio(post)
    return parseFloat(vote.rshares * ratio)
  }
}

function* idMaker() {
  var index = 0;
  while (true)
    yield index++;
}


window.popoverIdGen = idMaker()

function createVotePopover(post, id) {

  let votes = post.active_votes.sort((a, b) => {
    return b.rshares - a.rshares
  });

  let upvotes = ['<div id="vote-popup-content-up-' + id + '">']
  let downvotes = ['<div id="vote-popup-content-down-' + id + '">']


  for (const vote of votes) {

    const value = PAYOUT_HELPER.voteValue(vote, post).toFixed(4)
    if (vote.rshares > 0) {
      upvotes.push(
        `<a href='https://peakd.com/@${vote.voter}' target='_blank'>@${vote.voter}</a>: ${value}<br>`
      )
    } else if (vote.rshares < 0) {
      downvotes.push(
        `<a href='https://peakd.com/@${vote.voter}' target='_blank'>@${vote.voter}</a>: ${value}<br>`
      )
    }
  }

  upvotes = upvotes.slice(0, 10)
  upvotes.push('</div>')
  downvotes = downvotes.slice(0, 10)
  downvotes.push('</div>')

  $('#votePopovers').append(upvotes.join(''))
  $('#votePopovers').append(downvotes.join(''))
}

function initPopover() {
  $('[rel="popover"]').popover({
    container: 'body',
    html: true,
    placement: 'bottom',
    trigger: 'hover click',
    content: function () {
      const popoverId = $(this).data('popover-id');
      console.log(popoverId)
      return $('#vote-popup-content-' + popoverId).clone(true);
    }
  });
}

function initVoting() {

  if (VIDEO.currentUser === "") {
    return;
  }

  $('[data-vote]').click(function () {
    const self = $(this);
    localStorage.setItem("vote", self.data("vote"))
    localStorage.setItem("downvote", null)
    $('#voteModal .modal-title').text('Upvotes')
    $('#castUpvote').text('Upvote')
    $('#voteModal').modal()
  });

  $('[data-downvote]').click(function () {
    const self = $(this);
    localStorage.setItem("downvote", self.data("downvote"));
    localStorage.setItem("vote", null)
    $('#voteModal .modal-title').text('Downvotes')
    $('#castUpvote').text('Downvote')
    $('#voteModal').modal()
  })

  $('#castUpvote').off("click").click(async function () {

    let vote = localStorage.getItem("vote");
    let weight = parseInt($('#voteStrength').val()) * 100

    if (vote === 'null') {
      weight = weight * -1;
      vote = localStorage.getItem("downvote");
    }

    console.log(weight, vote)

    if (typeof vote !== "string" || vote.indexOf("/") === -1) {
      return;
    }

    if (['', 'guest-account'].includes(nickname)) {
      window.location.href = '/auth/login'
    }

    const result = await (await fetch('/user/api/vote', {
      method: 'post',
      body: JSON.stringify({
        author: vote.split("/")[0],
        permlink: vote.split("/")[1],
        weight
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })).json();

    if (result.success === true) {
      $(`[data-vote="${vote}"]`).toggleClass("fas").toggleClass("fal");
      toastr.success('Your like was broadcast to the blockchain!')
      console.log("[VOTE]", result.txId)
    } else {
      console.log(result)
      toastr.error("Your like could not be broadcast to the blockchain: " + result.error)
    }

    $('#closeVoteModal').click()
  })
}

async function initComments() {

  const COMMENT_CONFIG = {
    MAX_DEPTH: 3,
    ACCOUNTS: {
      TEAM: ['starkerz', 'honeybee11', 'theycallmedan', 'sisygoboom', 'vaultech', 'sagarkothari88'],
      SECURITY_RESEARCH: ['louis88'],
      SPAM: ['steem-bootcamp'],
      SCAM: [],
      HIDE: ['hivewatcher', 'cheetah',]
    },

  }

  async function getDiscussion(author, permlink) {
    return (await fetch(hive.config.get("url"), {
      method: 'post',
      body: JSON.stringify({
        "id": 0,
        "jsonrpc": "2.0",
        "method": "bridge.get_discussion",
        "params": { "author": author, "permlink": permlink }
      })
    })).json()
  }

  async function getPost(author, permlink) {
    return (await fetch(hive.config.get("url"), {
      method: 'post',
      body: JSON.stringify({
        "id": 0,
        "jsonrpc": "2.0",
        "method": "bridge.get_post",
        "params": {
          "author": author,
          "permlink": permlink,
          "observer": ""
        }
      })
    })).json()
  }

  function sortReplies(comment, discussion) {
    if (comment.replies.length === 0) return comment;
    const replies = [];
    for (const reply of comment.replies) {
      if (
        COMMENT_CONFIG.ACCOUNTS.SPAM.includes(discussion[reply].author) === false &&
        COMMENT_CONFIG.ACCOUNTS.SCAM.includes(discussion[reply].author) === false &&
        COMMENT_CONFIG.ACCOUNTS.HIDE.includes(discussion[reply].author) === false
      ) {
        discussion[reply].teamMember = COMMENT_CONFIG.ACCOUNTS.TEAM.includes(discussion[reply].author)

        discussion[reply].active_votes = discussion[reply].active_votes.sort((a, b) => {
          return b.rshares - a.rshares
        })

        for (const voteID in discussion[reply].active_votes.slice(0, 10)) {
          let vote = discussion[reply].active_votes[voteID];
          vote.value = PAYOUT_HELPER.voteValue(vote, discussion[reply]);
          discussion[reply].active_votes[voteID] = vote;
        }

        discussion[reply].active_votes = discussion[reply].active_votes.sort((a, b) => {
          return b.value - a.value
        })

        replies.push(discussion[reply])
      }
    }
    comment.replies = replies.sort((a, b) => {
      return b.payout - a.payout
    });
    return comment;
  }

  if (VIDEO.hiveUser !== '') {
    let discussion = (await getDiscussion(VIDEO.hiveUser, VIDEO.permlink)).result;
    let post = (await getPost(VIDEO.hiveUser, VIDEO.permlink)).result

    const discussionKeys = Object.keys(discussion);

    if (discussionKeys.length === 1) {
      const container = document.createElement('div');
      container.classList.add("alert")
      container.classList.add("alert-info")
      const containerContent = document.createTextNode('This video has no comments yet. To write a comment login and click the "Reply" button below the video player.')
      container.appendChild(containerContent);
      document.getElementById('comments').appendChild(container);
      return;
    }

    const rootComments = [];
    const blockList = [
      'gangstalking'
    ]
    for (const discussionKey of discussionKeys) {
      if (blockList.includes(discussionKey.split('/')[0])) {
        continue
      }
      discussion[discussionKey] = sortReplies(discussion[discussionKey], discussion);

      let id = window.popoverIdGen.next().value;
      discussion[discussionKey].popoverId = id;
      createVotePopover(discussion[discussionKey], id)
      if (
        discussion[discussionKey].depth === 1 &&
        COMMENT_CONFIG.ACCOUNTS.SPAM.includes(discussion[discussionKey].author) === false &&
        COMMENT_CONFIG.ACCOUNTS.SCAM.includes(discussion[discussionKey].author) === false &&
        COMMENT_CONFIG.ACCOUNTS.HIDE.includes(discussion[discussionKey].author) === false
      ) {
        discussion[discussionKey].teamMember = COMMENT_CONFIG.ACCOUNTS.TEAM.includes(discussion[discussionKey].author)
        for (const voteID in discussion[discussionKey].active_votes) {
          let vote = discussion[discussionKey].active_votes[voteID];
          vote.value = PAYOUT_HELPER.voteValue(vote, discussion[discussionKey]);
          discussion[discussionKey].active_votes[voteID] = vote;
        }
        rootComments.push(discussion[discussionKey])
      }
    }

    post.replies = rootComments.sort((a, b) => {
      return b.payout - a.payout
    });
    post.isRoot = true;
    let comment = await (await fetch('/apiv2/render_comment.html', {
      method: "post",
      body: JSON.stringify({ post }),
      headers: {
        'Content-Type': 'application/json'
      }
    })).text();


    $('#comments').html(comment);
    initPopover();
    initVoting()
    // attachCommentHandler();

  } else {
    const container = document.createElement('div');
    container.classList.add("alert")
    container.classList.add("alert-info")
    const containerContent = document.createTextNode('This video is still being processed. A comment section will be added shortly.')
    container.appendChild(containerContent);
    document.getElementById('comments').replace(container);
  }
  $('[data-comment]').each(function () {
    $(this).on('click', () => {
      $('#cmd').data('new-comment', $(this).data('comment'))
      $('#commentModal').modal()
    })
  })
}

$(() => {
  /*$('.comment_replies').on('scroll', function () {
    var $container = $(this);
    console.log($container)
    $(this).find('.popover').each(function () {
      $(this).css({
        top: -$container.scrollTop()
      });
    });
  });*/

  $('body').on('click', function (e) {
    $('[data-toggle="popover"]').each(function () {
      //the 'is' for buttons that trigger popups
      //the 'has' for icons within a button that triggers a popup
      if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
        $(this).popover('hide');
      }
    });
  });

  $('#cmd').click(function () {
    let comment = $('#comment').val()
    const cmd = $(this);
    cmd.html("<i class='fa fa-spin fa-spinner'></i>");
    let parent = $(this).data("new-comment");
    let author;
    let permlink;
    try {
      [author, permlink] = parent.split("/");
    } catch {
      parent = cmd.data("new-comment");
      [author, permlink] = parent.split("/");
    }
    $.ajax({
      url: "/user/api/comment",
      type: "post",
      data: {
        author,
        permlink,
        comment
      },
      success: (res) => {
        if (res.error) {
          cmd.text("Comment");
          return alert(res.error)
        }
        $('#commentModal').modal('hide')
        $('#new-comment-body').val();
        $('#comments').html('<div class="box mb-2" id=""><h6>Comments:</h6></div>');
        initComments()
      }
    })
  })
})
