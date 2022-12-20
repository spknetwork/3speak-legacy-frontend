require('../page_conf')
const {mongo} = require('../helper');

const pd = new mongo.Podcast({
  filename: 'Iy9KNvgpDqKw88byifQXImTeYQ64iiusTxjXXr38634UjG9Wb1076a6jYBbTkqUT.mp3',
  title: 'Final Dateline Episode 1',
  tags: ['test'],
  description: 'This is a test of the podcast functionality of 3Speak. Early Alpha. No ETA for release.',
  status: 'published',
  size: '22000000',
  permlink: 'test-podcast',
  duration: 1422,
  owner: 'dgtest123'
})

pd.save(error => {
  console.log(error)
})
