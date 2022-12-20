require('./../page_conf')
const mongo = require('./../helper/mongo');
const { Client: HiveClient } = require('@hiveio/dhive')

const hiveClient = new HiveClient(`${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`)

let allHiveCommunities = [];
const blacklist = [ /*dtube*/ 'hive-196037'];

let speakCommunities;

async function load(last = '') {

  let communities = await hiveClient.call('bridge', 'list_communities', {last})

  communities.map(x => {
    x.used = speakCommunities.includes(x.name)
  })

  // eslint-disable-next-line no-console
  console.log(communities)

  allHiveCommunities = allHiveCommunities.concat(communities);

  if (communities.length === 100) {
    setTimeout(() => {
      load(communities[communities.length - 1].name)
    }, 1000)
  } else {
    await mongoUpdate();
  }
}

async function mongoUpdate() {
  allHiveCommunities = allHiveCommunities.map(x => ({
    name: x.name,
    title: x.title.replace(' || ', ' | '),
    sum_pending: x.sum_pending,
    num_authors: x.num_authors,
    subscribers: x.subscribers,
    used: x.used
  }));

  //remove blacklisted communities
  allHiveCommunities = allHiveCommunities.filter((e) => {
    return !blacklist.includes(e.name)
  })

  await mongo.HiveCommunity.deleteMany({});
  await mongo.HiveCommunity.insertMany(allHiveCommunities);
  process.exit(0)
}

(async() => {

  speakCommunities = await mongo.Video.distinct('hive', {status: 'published', hive: {$nin: [null, '']}});
  speakCommunities = speakCommunities.filter(x => x.startsWith('hive-') && x.indexOf(' ') === -1)
  // eslint-disable-next-line no-console
  console.log(speakCommunities)

  await load();

})();
