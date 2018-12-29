const request = require('./request');
const _ = require('underscore');

const website = 'https://www.instagram.com';
const serach = ''; // what are you want to srarch
const sessionId = '' // your session id

let hasNextPage = false;
let endCursor = '';
const Agent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_1) AppleWebKit/604.3.5 (KHTML, like Gecko) Version/11.0.1 Safari/604.3.5';

async function main() {
  let headers = {
    'User-Agent' : Agent
  }
  let body = await(request.send(`${website}/explore/tags/${encodeURIComponent(serach)}/?__a=1`, headers));
  body = JSON.parse(body);
  const top = body.graphql.hashtag.edge_hashtag_to_top_posts;
  _.map(top.edges, (obj) => {
    const variables = {
      'shortcode' : obj.node.shortcode,
      'child_comment_count' : 3,
      'fetch_comment_count' : 40,
      'parent_comment_count' : 24,
      'has_threaded_comments' : false
    };
    headers = {
      'User-Agent' : Agent,
      'Cookie' : `sessionid=${sessionId}`,
    }
    request.page(obj.node.shortcode, `${website}/graphql/query/?query_hash=49699cdb479dd5664863d4b647ada1f7&variables=${encodeURIComponent(JSON.stringify(variables))}`, headers);
  });

  let newPost = body.graphql.hashtag.edge_hashtag_to_media;
  _.map(newPost.edges, (obj) => {
    const variables = {
      'shortcode' : obj.node.shortcode,
      'child_comment_count' : 3,
      'fetch_comment_count' : 40,
      'parent_comment_count' : 24,
      'has_threaded_comments' : false
    };
    headers = {
      'User-Agent' : Agent,
      'Cookie' : `sessionid=${sessionId}`,
    }
    request.page(obj.node.shortcode, `${website}/graphql/query/?query_hash=49699cdb479dd5664863d4b647ada1f7&variables=${encodeURIComponent(JSON.stringify(variables))}`, headers)
  });

  hasNextPage = body.graphql.hashtag.edge_hashtag_to_media.page_info.has_next_page;
  endCursor = body.graphql.hashtag.edge_hashtag_to_media.page_info.end_cursor;

  while(hasNextPage) {
    const variables = {
      'tag_name' : serach,
      'show_ranked' : false,
      'first' : 4,
      'after' : endCursor
    }
    headers = {
      'User-Agent' : Agent,
      'Cookie' : `sessionid=${sessionId}`,
    }
    body = await(request.send(`${website}/graphql/query/?query_hash=f92f56d47dc7a55b606908374b43a314&variables=${encodeURIComponent(JSON.stringify(variables))}`, headers));
    body = JSON.parse(body);
    newPost = body.data.hashtag.edge_hashtag_to_media;
    _.map(newPost.edges, (obj) => {
      const variables = {
        'shortcode' : obj.node.shortcode,
        'child_comment_count' : 3,
        'fetch_comment_count' : 40,
        'parent_comment_count' : 24,
        'has_threaded_comments' : false
      };
      headers = {
        'User-Agent' : Agent,
        'Cookie' : `sessionid=${sessionId}`,
      }
      request.page(obj.node.shortcode, `${website}/graphql/query/?query_hash=49699cdb479dd5664863d4b647ada1f7&variables=${encodeURIComponent(JSON.stringify(variables))}`, headers);
    });

    hasNextPage = body.data.hashtag.edge_hashtag_to_media.page_info.has_next_page;
    endCursor = body.data.hashtag.edge_hashtag_to_media.page_info.end_cursor;
  };
};

main();