// Toggle the side navigation
$(document).on('click', '#sidebarToggle', function (e) {
    e.preventDefault();
    $("body").toggleClass("sidebar-toggled");
    $(".sidebar").toggleClass("toggled");
});

// Prevent the content wrapper from scrolling when the fixed side navigation hovered over
$('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (e) {
    if ($window.width() > 768) {
        var e0 = e.originalEvent,
            delta = e0.wheelDelta || -e0.detail;
        this.scrollTop += (delta < 0 ? 1 : -1) * 30;
        e.preventDefault();
    }
});

// Category Owl Carousel
const objowlcarousel = $('.owl-carousel-category');
if (objowlcarousel.length > 0) {
    objowlcarousel.owlCarousel({
        responsive: {
            0: {
                items: 1,
            },
            600: {
                items: 3,
                nav: false
            },
            1000: {
                items: 4,
            },
            1200: {
                items: 8,
            },
        },
        loop: true,
        lazyLoad: true,
        autoplay: true,
        autoplaySpeed: 1000,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
        nav: true,
        navText: ["<i class='fa fa-chevron-left'></i>", "<i class='fa fa-chevron-right'></i>"],
    });
}

// Login Owl Carousel
const mainslider = $('.owl-carousel-login');
if (mainslider.length > 0) {
    mainslider.owlCarousel({
        items: 1,
        lazyLoad: true,
        loop: true,
        autoplay: true,
        autoplaySpeed: 1000,
        autoplayTimeout: 2000,
        autoplayHoverPause: true,
    });
}


// Tooltip
$('[data-toggle="tooltip"]').tooltip()

// Scroll to top button appear
$(document).on('scroll', function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
        $('.scroll-to-top').fadeIn();
    } else {
        $('.scroll-to-top').fadeOut();
    }
});

// Smooth scrolling using jQuery easing
$(document).on('click', 'a.scroll-to-top', function (event) {
    var $anchor = $(this);
    $('html, body').stop().animate({
        scrollTop: ($($anchor.attr('href')).offset().top)
    }, 1000, 'easeInOutExpo');
    event.preventDefault();
});

function nFormatter(num, digits) {
    var si = [
        {value: 1, symbol: ""},
        {value: 1E3, symbol: "k"},
        {value: 1E6, symbol: "M"},
        {value: 1E9, symbol: "G"},
        {value: 1E12, symbol: "T"},
        {value: 1E15, symbol: "P"},
        {value: 1E18, symbol: "E"}
    ];
    var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var i;
    for (i = si.length - 1; i > 0; i--) {
        if (num >= si[i].value) {
            break;
        }
    }
    return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}

function downVote (id) {
    const cast = id + ' .steem-downvote-cast';
    $(cast).removeClass("fa-chevron-circle-up").addClass("fa-spin").addClass('fa-spinner');

    let author = $(cast).data("post").split("/")[0];
    let permlink = $(cast).data("post").split("/")[1];
    let weight = $(id + ' .steem-upvote-slider').attr('value') * -100;

    $.ajax({
        url: '/user/api/vote',
        type: "post",
        data: {
            author: author,
            permlink: permlink,
            weight: weight,
        },
        success: (res => {
            let update_id = 'payout-'+author.replace('.','\\.')+'-'+permlink;
            updatePayout(update_id, author, permlink)
            if (res.error && typeof res.error === "string") {
                return alert(res.error)
            } else {
                $(cast).removeClass("fa-spin").removeClass('fa-spinner').addClass("fa-chevron-circle-down");
                $(id + ' .steem-upvote-cancel').click();
                refreshDataDislikes();

                let up = $("#up-icon-" + author + "-" + permlink);
                let down = $("#down-icon-" + author + "-" + permlink);
                if (weight === 0) {
                    down.removeClass("text-danger").addClass("text-secondary")
                } else {
                    up.removeClass("text-success").addClass("text-secondary");
                    down.removeClass("text-secondary").addClass("text-danger")
                }
            }
        })
    })
}

function normalVote (id) {
    const cast = id + ' .steem-upvote-cast';
    console.log(cast)
    $(cast).removeClass("fa-chevron-circle-up").addClass("fa-spin").addClass('fa-spinner');

    let author = $(cast).data("post").split("/")[0];
    let permlink = $(cast).data("post").split("/")[1];
    let weight = $(id + ' .steem-upvote-slider').attr('value') * 100;

    $.ajax({
        url: '/user/api/vote',
        type: "post",
        data: {
            author: author,
            permlink: permlink,
            weight: weight,
        },
        success: (res => {
            let update_id = 'payout-'+author.replace('.','\\.')+'-'+permlink;
            updatePayout(update_id, author, permlink)
            if (res.error && typeof res.error === "string") {
                return alert(res.error)
            } else {
                //if (res.error && typeof res.error === "object") {
                //    return alert(res)
                //}
                $(cast).removeClass("fa-spin").removeClass('fa-spinner').addClass("fa-chevron-circle-up");

                $(id + ' .steem-upvote-cancel').click();
                refreshDataLikes();
                let up = $("#up-icon-" + author + "-" + permlink);
                let down = $("#down-icon-" + author + "-" + permlink);
                if (weight === 0) {
                    up.removeClass("text-success").addClass("text-secondary")
                } else {
                    down.removeClass("text-danger").addClass("text-secondary");
                    up.removeClass("text-secondary").addClass("text-success")
                }
            }
        }),
        error: (e) => {
            alert(e)
            $(id + ' .steem-upvote-cast').removeClass("fa-spin").removeClass('fa-spinner').addClass("fa-chevron-circle-up")
            //window.location.href= '/auth/login'
        }
    });
}

function timeSince(date) {
    let dt = new Date()
    let offset = dt.getTimezoneOffset();
    let utc_timestamp = dt.setMinutes( dt.getMinutes() + offset );

    var seconds = Math.floor((utc_timestamp - date) / 1000);

    var interval = Math.floor(seconds / 31536000);

    if (interval >= 1) {
        if (interval === 1) {
            return interval + " year ago";
        } else {
            return interval + " years ago";
        }
    }
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
        if (interval === 1) {
            return interval + " month ago";
        } else {
            return interval + " months ago";
        }
    }
    interval = Math.floor(seconds / 604800);
    if (interval >= 1) {
        if (interval === 1) {
            return interval + " week ago";
        } else {
            return interval + " weeks ago"
        }
    }
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
        if (interval === 1) {
            return interval + " day ago";
        } else {
            return interval + " days ago";
        }
    }
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
        if (interval === 1) {
            return interval + " hour ago";
        } else {
            return interval + " hours ago";
        }
    }
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
        if (interval === 1) {
            return interval + " minute ago";
        } else {
            return interval + " minutes ago";
        }
    }
    if (seconds > 0) {
        return Math.floor(seconds) + " seconds ago";
    } else {
        return "";
    }
}

$('#divide').on('mouseover', () => {
    $('#unicorn').removeClass("d-none")
});
$('#divide').on('mouseleave', () => {
    $('#unicorn').addClass("d-none")
});

async function getPayout(author, permlink) {
  let content = await hiveClient.database.call('get_content', [author, permlink])
  let payout = content.last_payout <= "1970-01-01T00:00:00" ? content.pending_payout_value : parseFloat(content.total_payout_value) + parseFloat(content.curator_payout_value)
  payout = parseFloat(payout)
  payout = payout.toFixed(2)
  return payout
}

async function isFollowing(account) {
  let following = await hiveClient.call('follow_api', 'get_followers', [account, nickname, 'blog', 1])
  console.log({following: following})
  let isFollowing = (following.length === 1 && following[0].follower === nickname);
  
  console.log({isFollowing: isFollowing})
  return isFollowing
}

async function updatePayout(container, author, permlink, comment = true) {
    let payout = await getPayout(author, permlink);
    $('#' + container).html(payout);
    $('#' + container).removeClass('fa').removeClass('fa-spin').removeClass('fa-spinner');
    $.notify("Success! The vote has been cast.", "success");
}

function refreshDataPayout() {
    $('[data-payout]').each(async (i, e) => {
        e = $(e);
        let id = e.data("payout");
        let owner = id.split('/')[0];
        let permlink = id.split('/')[1];
        let payout = await getPayout(owner, permlink);
        e.replaceWith(payout)
    });
}

function refreshDataSubcount() {
    $($('[data-subcount]').get().reverse()).each(async (i, e) => {
      e = $(e);
      let id = e.data("subcount");
      hiveClient.call('follow_api', 'get_follow_count', [id]).then(res => {
        e.replaceWith(nFormatter(res.follower_count, res.follower_count >= 1000 ? 1 : 0));
      });
      let subscribed = await isFollowing(id)
      if (subscribed) {
        let subBut = '[data-subscribe="'+id+'"]';
        $(subBut).removeClass('btn-light').addClass('btn-dark');
        $(subBut + ' #substatus').html('Unfollow')
        $('.view-followers').addClass('text-light')
      }
    });
}

function refreshDataAcknowledge() {
    $('[data-acknowledge]').each((i, e) => {
        e = $(e);
        e.click(() => {
            let id = e.data("acknowledge");
            $.ajax({
                url: '/user/api/acknowledge',
                data: {
                    id: id
                },
                success: (res) => {
                    e.css("background", "white");
                    window.location.href = res.url;
                }
            })
        })
    });
}

let allCommentVotes = {};

async function getVotes(author, perm, type='upvotes') {
  let votes;
  if (allCommentVotes[`${author}/${perm}`]) {
    votes = allCommentVotes[`${author}/${perm}`]
  } else {
    votes = await hiveClient.database.call('get_active_votes', [author, perm])
    allCommentVotes[`${author}/${perm}`] = votes
  }

  if (type === 'upvotes') {
    votes = votes.filter(x => {return x.percent > 0})
  } else if (type = 'downvotes') {
    votes = votes.filter(x => {return x.percent < 0})
  }

  votes = votes.map(x => {
    x.percent /= 100
    return x
  })

  return votes;
}

function refreshDataLikes() {
    $('[data-likes]').each((i, e) => {
        e = $(e);
        let id = e.data("likes");
        let author = id.split('/')[0];
        let permlink = id.split('/')[1];

        getVotes(author, permlink, 'upvotes').then(votes => {
          e.html(nFormatter(votes.length, 1))
        })
    });
}

function refreshDataDislikes() {
    $('[data-dislikes]').each((i, e) => {
        e = $(e);
        let id = e.data("dislikes");
        let author = id.split('/')[0];
        let permlink = id.split('/')[1];

        getVotes(author, permlink, 'downvotes').then(votes => {
          e.html(nFormatter(votes.length, 1))
        })
    });
}

async function isKeychainInstalled(retries = 0, max_retries = 120) {
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  if (typeof window.hive_keychain !== "object") {
    if (retries < max_retries) {
      await sleep(10);
      console.log("KC not found", retries + 1, "/", max_retries)
      retries = retries + 1;
      return isKeychainInstalled(retries, max_retries)
    } else {
      return false
    }
  } else {
    console.log("KC found after", retries + 1, "retries");
    return true
  }
}

function refreshDataIsLiked() {
    $('[data-isliked]').each((i, e) => {
        e = $(e);
        console.log(e.data('isliked'));
        let owner = e.data('isliked').split('/')[0];
        let permlink = e.data('isliked').split('/')[1];

        $.ajax({
            url: 'user/api/comment/like-count',
            data: {
                permlink: permlink,
                author: owner
            },
            type: "post",
            success: (j) => {
                if (j.liked === true) {
                    e.addClass('text-success');
                }
            }
        });
    })
}

function toggleNotifications (channel, target, unsub=0) {
    console.log(channel)
    console.log(unsub)
    $.ajax({
        url: "/user/notifications/toggle",
        data: {
            creator: channel,
            unsub: unsub
        },
        success: (res => {
            console.log(res);
            console.log($(target));
            if (res.code === 1) {
                $(target).addClass("fa").removeClass("far");
                $(target).parent().addClass('btn-danger').removeClass('btn-secondary');
                $.notify(
                    "Notifications turned on for " + channel, 'success'
                );
            } else if (res.code === 0) {
                $(target).removeClass("fa").addClass("far");
                $.notify(
                    "Notifications turned off for " + channel, 'danger'
                )
            } else if (res.code === -1) {
                $(target).addClass("fa").removeClass("far");
                $(target).parent().addClass("btn-danger").removeClass("btn-secondary");
                $.notify("Subscribed to " + channel + " and turned on notifications.", 'success')
                $('#subcount').html(parseInt($('#subcount').text()) + 1);
                refreshDataSubcount()
            } else if (res.code === 2) {
                $.notify('You must verify your email before turning on notifications.', 'danger')
            } else if (res.code === 3) {
                $.notify('Unsubscribed and turned off notifications.', 'danger')
                $(target).addClass("far").removeClass("fa");
            }
        }),
        error: (e) => {
            console.log(e)
        }
    });
}

function revealCatRequest() {
    $('#requestCategory').removeClass('d-none');
    $('#requestCatBut').addClass('d-none');
}

$(() => {

    refreshDataPayout();

    refreshDataSubcount();

    refreshDataAcknowledge();

    refreshDataLikes();

    refreshDataDislikes();

    refreshDataIsLiked();

    $('#requestCatBut').click((e) => {
        e.stopPropagation();
        revealCatRequest()
    });

    $(document).on("click", ".reveal-nsfw", function (e) {
        console.log('click')
        let card_id = '#' + $(this).closest('.video-card-image').attr('id');
        console.log(card_id);
        $(card_id + ' .thumbnail').removeClass('d-none');
        $(this).addClass('d-none');
    });

    $(document).on("click", "[data-add-comment]", function (e) {
        const parent = $(this).data("add-comment");
        const author = $(this).data("author");
        if (parent.indexOf("/") > -1) {
            const [realAuthor, permlink] = parent.split("/");
            $('#author').val(realAuthor);
            $('#permlink').val(permlink);
            $('#replyTo').text("Reply to: " + author);
            $('#commentModal').modal()
        }
    });

    $(document).on("click", ".steem-like", function (e) {
        const like_parent = $(this).data("upvote")
        const id = '#' + this.id.replace('.', '\\.');
        console.log(id);

        if ($(e.target).attr("class").includes("steem-like") || $(e.target).attr('class').includes('steem-like-icon-icon') || $(e.target).attr("class").includes("likes") || $(e.target).attr("class").includes("steem-like-icon")) {
            $(id + ' .steem-like-icon').addClass('d-none');
            $(id + ' .steem-upvote-val').removeClass("d-none");
            $(id + ' .slider').removeClass('d-none');
            $(id + ' .steem-upvote-cast').removeClass('d-none');
            $(id + ' .steem-upvote-cancel').removeClass("d-none");
            $(id + ' .steem-downvote-cast').removeClass("d-none");
        }
    });

    $(document).on("click", ".steem-upvote-cancel", function (e) {
        e.preventDefault();
        const id = '#' + $(this).closest('.steem-like').attr('id').replace('.', '\\.');
        console.log(id);

        $(id + ' .steem-like-icon').removeClass("d-none");
        $(id + ' .steem-upvote-val').addClass("d-none");
        $(id + ' .slider').addClass('d-none');
        $(id + ' .steem-upvote-cast').addClass('d-none');
        $(id + ' .steem-upvote-cancel').addClass("d-none");
        $(id + ' .steem-downvote-cast').addClass("d-none");
    });

    $(document).on("slide", ".steem-upvote-slider", function (slideEvt) {
        let id = '#' + $(this).closest('.steem-like').attr('id').replace('.', '\\.');
        $(id + " .steem-upvote-val").text(slideEvt.value + "%");
    });

    $(document).on("click", ".cast-videocard", function (e) {
        let id = '#' + $(this).closest('.steem-like').attr('id').replace('.', '\\.');
        normalVote(id);
    });

    $('.href-disabled').click(function (e) {
        if ($(this).hasClass('href-disabled')) {
            e.preventDefault();
            $(this).removeClass('href-disabled');
        }
    });

    $(document).on('click', '.donate-button', function (e) {
      if (nickname !== '') {
        let author = $(this).data('donate').split('/')[0];
        let permlink = $(this).data('donate').split('/')[1];
        $('.donation-recipient').html(author);
        $('.donation-post').html(permlink);
        $('#donationComplete').data('donate', $(this).data('donate'));
        $('#donationModal').modal();
      } else {
        $('#loginModal').modal();
      }
    })

    $('#donationComplete').click(function () {
      isKeychainInstalled().then((keychain) => {
        if (keychain) {
          let author = $(this).data('donate').split('/')[0];
          let permlink = $(this).data('donate').split('/')[1];
          let amount = $('#donationAmount').val();
          if (amount < 0.1) {
            return Swal.fire({
              title: 'Something went wrong',
              text: 'Amount too small. Minimum is 0.1.',
              icon: 'error',
              confirmButtonText: 'Okay'
            })
          }
          let message = $('#donationMemo').val();
          let currency = ' ' + $('#donationCurrency').val();
          let us = amount*0.01
          let recipient = amount*0.99
          us = us.toFixed(3)
          recipient = recipient.toFixed(3)
          us = us + currency;
          recipient = recipient + currency;
          message = "!tip @" + author + "/" + permlink + " @" + nickname + " app:threespeak message:" + message

          const op = [
            ["transfer", {
                "from":nickname,
                "to":author,
                "amount":recipient,
                "memo":message
              }],
            ["transfer", {
                "from":nickname,
                "to":"threespeakwallet",
                "amount":us,
                "memo":message
              }
            ]
          ]

          hive_keychain.requestBroadcast(nickname, op, 'active', (res) => {
            if (res.success === true) {
              Swal.fire({
                title: 'Success',
                text: "Transaction sent.",
                icon: 'success',
                confirmButtonText: 'Okay'
              });

            } else {

              Swal.fire({
                title: 'Something went wrong',
                text: res.message,
                icon: 'error',
                confirmButtonText: 'Okay'
              })
            }
          })
        } else {
          Swal.fire({
            title: 'Something went wrong',
            text: 'Hive Keychain is not installed on this browser.',
            icon: 'error',
            confirmButtonText: 'Okay'
          })
        }
      })
    })

    $('.img-thumbnail').click(function (e) {
        this.src = 'https://threespeakvideo.b-cdn.net/' + $(this).data('permlink') + '/thumbnails/default.png'
    });

    $('.view-followers').click(function (e) {
      e.stopPropagation()
    });

    $("[data-toggle-notifications]").click(function (e) {
        e.stopPropagation();
        let channel = $(e.target).data("toggle-notifications");
        console.log(channel)
        console.log(this)
        toggleNotifications(channel, this);
    });

    $(document).on('click', '.seemore', function () {
      let more = $(this).attr('id');
      let type = more.split('|')[0];
      let author = more.split('|')[1];
      let perm = more.split('|')[2];
      let votes = allVotes[author][perm][type];

      let body = '';
      votes.forEach(vote => {
        body += '<h4><a href="https://peakd.com/@' + vote.voter + '">@' + vote.voter + '</a>: ' + vote.percent + '%</h4><br>';
      });

      $('#votelistModalBody').html(body);
      $('#votelistModalTitle').html(type + ' for @' + author + '/' + perm);
      $('#votelistModal').modal();
    });

    $('[data-slider-id]').each((i, e) => {
        e = $(e);
        let permlink;
        let author;
        let vtype;
        let data = e.data('slider-id').split('-');
        if (data.length > 3) {
            data.splice(0, 1);
            permlink = data[data.length-1];
            data.splice(data.length - 1, 1);
            author = data.join('-');
        } else {
            author = e.data('slider-id').split('-')[1];
            permlink = e.data('slider-id').split('-')[2];
            vtype = e.data('slider-id').split('-')[3];
        }


        console.log(author);
        console.log(permlink);
        if (vtype === 'up') {
            e.slider({
                min: 0,
                max: 100,
                value: 100,
                focus: true
            });
        } else if (vtype === 'down') {
            e.slider({
                min: -100,
                max: 0,
                value: -100,
                focus: true
            });
        }

        console.log(e);
        let slider_id = '#slider-' + author + '-' + permlink + '-' + vtype;
        $(slider_id).addClass("d-none").css("max-width", "100%");
        $(slider_id + ' .slider-selection').css("background", "#508238");
        //$()
    });

    $('[data-like]').each((i, e) => {
        e = $(e);
        e.click(() => {
            let id = e.data("like");
            $.ajax({
                url: '/video/api/like',
                data: {
                    v: id
                },
                success: (res) => {
                    if (res.success === true) {
                        if (res.status === "liked") {
                            e.removeClass("btn-secondary").addClass("btn-danger")
                        } else {
                            e.removeClass("btn-danger").addClass("btn-secondary")
                        }
                        $('.likes').html(nFormatter(res.count))
                    }
                }
            })
        })
    });
    $('[data-subscribe]').each(async(i, e) => {

        e = $(e);
        e.click(async () => {
          let channel = e.data("subscribe");

          if (nickname == '') {

            $('#loginModal').modal()

          } else {
              let alreadySubbed = await isFollowing(channel);


              $.ajax({
                url: '/user/api/subscribe',
                data: {
                  alreadySubbed,
                  channel
                },
                success: (res) => {

                  if (res.success === true) {

                    if (!alreadySubbed) {

                      e.removeClass("btn-light").addClass("btn-dark");
                      $('.view-followers').addClass('text-light');

                    } else if (alreadySubbed) {

                      e.removeClass("btn-dark").addClass("btn-light");
                      toggleNotifications(channel, null, 1);
                      $("[data-toggle-notifications]").removeClass('fa').addClass('far');
                      $('.view-followers').removeClass('text-light');

                    }
                    $('#substatus').text(alreadySubbed ? "Follow" : "Unfollow");
                  } else {
                    console.log(res)
                  }
                }
              })
            }
        })
    });
});
