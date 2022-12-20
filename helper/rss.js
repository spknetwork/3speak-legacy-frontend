const generateXML = require('xml');
const { binary_to_base58 } = require('base58-js')
const renderer = require('./render');
const {PodcastSettings} = require('./mongo')
require('../page_conf')

const hive = require('@hiveio/hive-js')
hive.api.setOptions({useAppbaseApi: true, url: `${HIVE_DEFAULT_NODE_PREFIX}://${HIVE_DEFAULT_NODE}/`});
hive.config.set('rebranded_api', 'true');
hive.broadcast.updateOperations();

function processFeed(videoFeed) {
  const bugFix = JSON.parse(JSON.stringify(videoFeed));
  let out = [];
  for (let video of bugFix) {
    let baseUrl;
    if(video.upload_type === 'ipfs') {
      baseUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.thumbnail.replace('ipfs://', '')}/`;
    } else {
      if(video?.thumbnail?.includes('ipfs://')) {
        baseUrl = `${APP_BUNNY_IPFS_CDN}/ipfs/${video.thumbnail.replace('ipfs://', '')}/`;
      } else {
        /*if(video.ipfs) {
          baseUrl = binary_to_base58(Buffer.from(`${APP_BUNNY_IPFS_CDN}/ipfs/${video.ipfs}/thumbnail.png`));
        } else {
        }*/
        baseUrl = `${APP_IMAGE_CDN_DOMAIN}/${video.permlink}/thumbnails/default.png`;
      }
    }
    video.thumbUrl = `https://images.hive.blog/p/${binary_to_base58(Buffer.from(baseUrl))}?format=jpeg&mode=cover&width=340&height=191`;
    video.created = new Date(video.created)
    video.baseThumbUrl = baseUrl;
    out.push(video)
  }
  return out;
}

function getItem(video, itunesAuthor) {
  let videoPlayUrl;

  if(video.filename.includes('ipfs://')) {
    videoPlayUrl = APP_BUNNY_IPFS_CDN + '/ipfs/' + video.filename.replace('ipfs://', '')
  } else {
    videoPlayUrl = video.podcast_transfered ? `https://s3.us-west-1.wasabisys.com/podcast-data/${video.permlink}/main.mp4` : APP_VIDEO_CDN_DOMAIN + '/' + video.filename
  }
  return {
    item: [
      {
        'title': {
          _cdata: video.title
        }
      },
      {
        'itunes:author': {
          _cdata: itunesAuthor
        }
      },
      {
        'itunes:episodeType': 'full'
      },
      {
        'link': APP_PAGE_PROTOCOL + '://' + APP_PAGE_DOMAIN + '/watch?v=' + video.owner + '/' + video.permlink
      },
      {
        'pubDate': (new Date(video.created)).toUTCString()
      },
      {'dc:creator': video.owner},
      {
        'guid': [
          {
            _attr: {
              isPermaLink: 'false'
            }
          },
          video.hive + '/@' + video.owner + '/' + video.permlink
        ]
      },
      {
        'description': {
          _cdata: renderer.render( `${APP_PAGE_PROTOCOL + '://' + APP_PAGE_DOMAIN + '/watch?v=' + video.owner + '/' + video.permlink} <br>` + video.description)
        }
      },
      {
        'image': {
          _attr: {
            url: video.baseThumbUrl,
            title: video.title + ' image'
          }
        }
      },
      {
        'itunes:explicit': video.isNsfwContent
      },
      {
        'itunes:image': {
          _attr: {
            href : video.baseThumbUrl
          }
        }
      },
      {
        'enclosure ': {
          _attr: {
            url: videoPlayUrl,
            length: parseInt(video.size),
            type: 'video/mp4'
          }
        }
      }
    ]
  }
}



module.exports = async(channel, videos) => {
  // Generate the PodcastIndex GUID
  // https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md#Guid
  // https://www.uuidgenerator.net/
  const uuidv5  = require('uuid/v5');
  const PODCASTINDEX_NAMESPACE = 'ead4c236-bf58-58c6-a2c6-a6b28d128cb6';
  const feedUrl = `${APP_PAGE_DOMAIN}/rss/${videos[0].owner}.xml`;
  const podcastGUID = uuidv5(feedUrl, PODCASTINDEX_NAMESPACE);
  const podcastSettings = await PodcastSettings.findOne({
    podcast_owner: videos[0].owner
  })


  videos = processFeed(videos)

  const categories_text = '{  "podcast_categories": [ {"cat": "Leisure", "sub_cat": "Animation & Manga"        },       {            "cat": "News"        }]}'
  const cat_dict = JSON.parse(categories_text)

{/*
  The cat_dict needs to turn into:

<itunes:category text="Leisure">
    <itunes:category text="Animation &amp; Manga"></itunes:category>
</itunes:category>
<itunes:category text="News">
</itunes:category>
 */}



  // const itunesAuthor = call the hive api IMPORTANT!!!!
  const [account] = await hive.api.getAccountsAsync([videos[0].owner])


  let itunesAuthor
  try {
    itunesAuthor = JSON.parse(account.posting_json_metadata)?.profile?.name || videos[0].owner
  } catch {
    itunesAuthor = videos[0].owner
  }
  console.log(itunesAuthor)
  let podcast_image;
  if(podcastSettings?.podcast_image) {
    podcast_image = podcastSettings.podcast_image
  } else {
    podcast_image = 'https://images.hive.blog/u/'+videos[0].owner+'/avatar/large'
  }
  let podcast_title;
  if(podcastSettings?.podcast_title) {
    podcast_title = podcastSettings.podcast_title
  } else {
    podcast_title = videos[0].owner + ' 3Speak Podcast'
  }
  let podcast_description;
  if(podcastSettings?.podcast_description) {
    podcast_description = podcastSettings?.podcast_description
  } else {
    podcast_description = 'Listen and watch the latest videos from ' + videos[0].owner +  '. Hosted by 3Speak.tv. The free speech video platform on the HIVE blockchain.'
  }
  let podcast_author;
  if(podcastSettings?.podcast_author) {
    podcast_author = podcastSettings?.podcast_author
  } else {
    podcast_author = videos[0].owner
  }
  let podcast_language;
  if(podcastSettings?.podcast_language) {
    podcast_language = podcastSettings?.podcast_language
  } else {
    podcast_language = 'en'
  }
  console.log(podcastSettings)
  const xml = {
    rss: [
      {
        '_attr': {
          'xmlns:dc': 'http://purl.org/dc/elements/1.1/',
          'xmlns:content': 'http://purl.org/rss/1.0/modules/content/',
          'xmlns:atom': 'http://www.w3.org/2005/Atom',
          'version': '2.0',
          'xmlns:podcast': 'https://podcastindex.org/namespace/1.0',
          'xmlns:wfw': 'http://wellformedweb.org/CommentAPI/',
          'xmlns:sy': 'http://purl.org/rss/1.0/modules/syndication/',
          'xmlns:slash': 'http://purl.org/rss/1.0/modules/slash/',
          'xmlns:itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd',
          'xmlns:googleplay': 'http://www.google.com/schemas/play-podcasts/1.0',
          'xmlns:georss': 'http://www.georss.org/georss',
          'xmlns:geo': 'http://www.w3.org/2003/01/geo/wgs84_pos#'
        }
      },
      {
        channel: [
          {
            'title': {
              _cdata: podcast_title
            }
          },
          {
            'podcast:guid': podcastGUID
          },
          {
            'itunes:author': {
              _cdata: itunesAuthor
            }
          },
          {
            'itunes:owner': [
              { 'itunes:name': itunesAuthor },
              { 'itunes:email': videos[0].owner + '@3speak.v4v.app' }
            ]
          },
          {
            'itunes:explicit': 'clean'
          },
          {
            'description': {
              _cdata: podcast_description
            }
          },
          {
            'link': 'https://3speak.tv/user/' + videos[0].owner
          },
          // https://livewire.io/instant-websub-for-podpingers/
          // this tag adds all 3speak feeds to websub via livewire.io
          {
            'atom:link': {
              '_attr': {
                'rel': 'hub',
                'href': 'https://hub.livewire.io/'
              }
            }
          },
          {
            'atom:link': {
              '_attr': {
                'href': `${APP_PAGE_PROTOCOL}://${feedUrl}`,
                'rel': 'self',
                'type': 'application/rss+xml'
              }
            }
          },
          {
            'podcast:hiveAccname': videos[0].owner
          },
          {
            'podcast:medium': 'video'
          },
          {
            'image': [
              {
                'url': podcast_image
              },
              {
                'title': podcast_title
              },
              {
                'link': `${APP_PAGE_PROTOCOL}://${APP_PAGE_DOMAIN}/user/${videos[0].owner}`
              }
            ]
          },
          {
            'itunes:image': {
              _attr: {
                href: podcast_image
              }
            }
          },
          {
            'podcast:podping': {
              _attr: {
                hiveAccount: 'podping.spk'
              }
            }
          },
          {
            'podcast:podping': {
              _attr: {
                hiveAccount: 'podping.bol'
              }
            }
          },
          {
            'generator': `${APP_PAGE_PROTOCOL}://${APP_PAGE_DOMAIN}`
          },
          {
            'lastBuildDate': (new Date()).toUTCString()
          },
          {
            'copyright': {
              '_cdata': '2021 ' + itunesAuthor
            }
          },
          {
            'language': podcastSettings?.podcast_languages[0] || 'en'
          },
          {
            'ttl': '60'
          },
          ...(podcastSettings?.podcast_categories ? podcastSettings?.podcast_categories.map(category => (
            {
              'itunes:category': {
                '_attr': {
                'text': category
              }}
            }
          )) : []),
          {
            'podcast:value': [
              {
                '_attr':  {
                  'type': 'lightning',
                  'method': 'keysend',
                  'suggested':'0.00000050000'
                }
              },
              {
                'podcast:valueRecipient': [
                  {
                    '_attr': {
                      'name': itunesAuthor,
                      'address': '0266ad2656c7a19a219d37e82b280046660f4d7f3ae0c00b64a1629de4ea567668',
                      'customKey': '818818',
                      'customValue': videos[0].owner,
                      'type': 'node',
                      'split':'99'
                    }
                  }
                ]
              },
              {
                'podcast:valueRecipient': [
                  {
                    '_attr': {
                      'name': 'PodcastIndex',
                      'address': '03ae9f91a0cb8ff43840e3c322c4c61f019d8c1c3cea15a25cfc425ac605e61a4a',
                      'type': 'node',
                      'fee':'True',
                      'split': '1'
                    }
                  }
                ]
              }
            ]
          },
          {
            'podcast:value': [
              {
                '_attr': {
                  'type': 'HBD',
                  'method': 'transfer',
                  'suggested': '0.05'
                }
              },
              {
                'podcast:valueRecipient': [
                  {
                    '_attr': {
                      name: 'podcaster',
                      type: 'account',
                      address: videos[0].owner,
                      split: '98'
                    }
                  }
                ]
              },
              {
                'podcast:valueRecipient': [
                  {
                    '_attr': {
                      name: 'host',
                      type: 'account',
                      address: 'threespeak',
                      split: '1'
                    }
                  }
                ]
              },
              {
                'podcast:valueRecipient': [
                  {
                    '_attr': {
                      name: 'podcastindex',
                      type: 'account',
                      address: 'podcastindex',
                      split: '1'
                    }
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }


  for (const video of videos) {
    xml.rss[1].channel.push(getItem(video, itunesAuthor))
  }

  return '<?xml version="1.0" encoding="UTF-8"?><?xml-stylesheet type="text/xsl" href="/rss/feed-stylesheet.xsl"?>' + generateXML(xml);
}
