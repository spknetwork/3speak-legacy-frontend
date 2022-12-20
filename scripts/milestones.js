var dhive = require("@hiveio/dhive");
const client = new dhive.Client(`${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`);

const helper = require('../helper')
mongo = helper.mongo

const milestones = [
    {
      milestoneText: 'first',
      milestoneNo: 1
    },
    {
      milestoneText: 'first ten',
      milestoneNo: 10
    },
    {
      milestoneText: 'first fifty',
      milestoneNo: 50
    },
    {
      milestoneText: 'first one hundred',
      milestoneNo: 100
    },
    {
      milestoneText: 'first five hundred',
      milestoneNo: 500
    },
    {
      milestoneText: 'first one thousand',
      milestoneNo: 1000
    },
    {
      milestoneText: 'first five thousand',
      milestoneNo: 5000
    },
    {
      milestoneText: 'first ten thousand',
      milestoneNo: 10000
    }
]

const milestoneCategories = [
  'Posts',
  'Subscriptions',
  'Views'
]


const postCounter = async (username) => {
  
  let achievements = []
      
  const calc = await mongo.Video.countDocuments({
    owner: username,
    status: 'published',
  })

  const postLength = calc

  const theMilestones = milestones

  theMilestones.forEach(one => {
    let progress;

    if (postLength >= one.milestoneNo) {
      progress = one.milestoneNo
    }

    if (postLength < one.milestoneNo) {
      progress = postLength
    }

    const thePostCounter = {
      description: `Congratulations, you have published your ${one.milestoneText} video`,
      progress,
      maxValue: `${one.milestoneNo}`,
      icon: '/trophys/video_1.png',
      title: `Publish ${one.milestoneText} video(s)`,
      completionPercentage: parseInt((progress/one.milestoneNo) * 100),
      category: 'Posts'
    }

    achievements.push(thePostCounter)
  })

  return achievements
}

const subscriberCounter = async (username) => {

  let achievements = []

  const newCalc = await client.call('follow_api', 'get_follow_count', [username]);

  console.log(`follow count is`, newCalc)


  const subLength = newCalc.follower_count

  const theMilestones = milestones

  theMilestones.forEach(one => {
    let progress;

    if (subLength >= one.milestoneNo) {
      progress = one.milestoneNo
    }

    if (subLength < one.milestoneNo) {
      progress = subLength
    }

    const theSubCounter = {
      description: `Congratulations, you have acquired your ${one.milestoneText} follower`,
      progress,
      maxValue: `${one.milestoneNo}`,
      icon: '/trophys/video_1.png',
      title: `Reach ${one.milestoneText} follower(s)`,
      completionPercentage: parseInt((progress/one.milestoneNo) * 100),
      category: 'Subscriptions'
    }

    achievements.push(theSubCounter)
  })

  return achievements
}

const viewsCounter = async (username) => {

  let achievements = []

  const calc = await mongo.View.countDocuments({author: username});
  
  const viewLength = calc

  const theMilestones = milestones

  theMilestones.forEach(one => {
    let progress;

    if (viewLength >= one.milestoneNo) {
      progress = one.milestoneNo
    }

    if (viewLength < one.milestoneNo) {
      progress = viewLength
    }

    const theViewCounter = {
      description: `Congratulations, you have acquired your ${one.milestoneText} view`,
      progress,
      maxValue: `${one.milestoneNo}`,
      icon: '/trophys/video_1.png',
      title: `Get ${one.milestoneText} view(s)`,
      completionPercentage: parseInt((progress/one.milestoneNo) * 100),
      category: 'Views'
    }

    achievements.push(theViewCounter)
  })

  return achievements
}

module.exports = {
    milestones,
    milestoneCategories,
    postCounter,
    subscriberCounter,
    viewsCounter
}