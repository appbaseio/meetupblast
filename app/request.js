function meetup_request(meetup_variable) {
  this.meetup_variable = meetup_variable;
  this.URL = 'https://scalr.api.appbase.io';
  this.FILTER_URL = 'http://scalr.api.appbase.io/meetup2/meetup/_search';
  this.USERNAME = 'qz4ZD8xq1';
  this.PASSWORD = 'a0edfc7f-5611-46f6-8fe1-d4db234631f3';
  this.APPNAME = 'meetup2';

  this.SINGLE_RECORD_ClONE = $(".single_record_for_clone").clone();
  this.CITY_LIST = [];
  this.TOPIC_LIST = [];
  this.FROM = 0;
  this.PAGE_SIZE = 25;
}

meetup_request.prototype = {
  constructor: meetup_request,
  //Use to get list of city, topics - used in app.js only
  FILTER_PAYLOAD: function(method) {
    var field = method == 'city' ? 'group_city_simple' : 'topic_name_simple';
    var payload = {
      "size": "0",
      "query": {
        "range": {
          "mtime": {
            "gte": new Date().setMonth(new Date().getMonth()-1)
          }
        }
      },
      "aggs": {
        "city": {
          "terms": {
            "field": field,
            "order": {
              "_count": "desc"
            },
            "size": 0
          }
        }
      }
    };
    return payload;
  },
  //Return the payload for query on the basis of method
  SEARCH_PAYLOAD: function(method) {
    var $this = this;
    if (method == 'default') {
      var obj = {
        type: 'meetup',
        size: $this.PAGE_SIZE,
        body: {
          "query": {
            "match_all": {}
          },
          "sort": [{
            "rsvp_id": {
              "order": "desc"
            }
          }]
        }
      };
    } else if (method == 'filter') {
      var obj = {
        type: 'meetup',
        stream: true,
        size: $this.PAGE_SIZE,
        body: {
          "query": {
            "filtered": {
              "query": {
                "match_all": {}
              },
              "filter": {
                "and": []
              }
            }
          },
          "sort": [{
            "rsvp_id": {
              "order": "desc"
            }
          }]
        }
      };
    }
    return obj;
  },
  //Create streaming client only if already not created.
  GET_STREAMING_CLIENT: function() {
    if (typeof streamingClient == 'undefined') {
      streamingClient = new Appbase({
        url: this.URL,
        appname: this.APPNAME,
        username: this.USERNAME,
        password: this.PASSWORD
      });
    }
    return streamingClient;
  },
  //Create the payload on the basis of selected city, topics
  GET_PAYLOAD: function() {
    var $this = this;
    if ($this.CITY_LIST.length || $this.TOPIC_LIST.length) {
      var search_payload = $this.SEARCH_PAYLOAD('filter');
      if ($this.CITY_LIST.length) {
        search_payload['body']['query']['filtered']['filter']['and'][0] = {
          'terms': {
            "group_city_simple": $this.CITY_LIST
          }
        };
      }

      if ($this.TOPIC_LIST.length) {
        if ($this.CITY_LIST.length)
          var ar_index = 1
        else
          var ar_index = 0;
        search_payload['body']['query']['filtered']['filter']['and'][ar_index] = {
          'terms': {
            "topic_name_simple": $this.TOPIC_LIST
          }
        };
      }
    } else {
      var search_payload = $this.SEARCH_PAYLOAD('default');
    }
    return search_payload;
  },
  //Start and stop stream whenever selecting/canceling city/topic and also start initially in app.js
  FIRE_FILTER: function() {
    var $this = this;
    $this.FROM = 0;
    var streaming = this.GET_STREAMING_CLIENT();
    var search_payload = this.GET_PAYLOAD();

    delete search_payload.stream;
    streaming.search(search_payload).on('data', function(res) {
      $this.meetup_variable.SET_RECORDS(res, 'initialize');
      $this.STREAM_START();
    }).on('error', function(err) {
      console.log(err)
    });


    console.log(JSON.stringify(search_payload));
    $('#record-container').html('');

    console.log("reinstantiating...");
    console.log(search_payload);
  },
  //Stream after getting search result
  STREAM_START: function() {
    var $this = this;
    $this.FROM = 0;
    var streaming = this.GET_STREAMING_CLIENT();
    if (typeof responseStream !== 'undefined') {
      responseStream.stop();
    }
    var search_payload = $this.GET_PAYLOAD();
    delete search_payload.size;
    responseStream = streaming.searchStream(search_payload).on('data', function(stream_response) {
      $this.meetup_variable.SET_RECORDS(stream_response, 'initialize');
    }).on('error', function(err) {
      console.log(err)
    });
  },
  //whenever user reaches at the bottom fire this function - used in app.js
  PAGINATION: function() {
    var $this = this;
    $this.FROM += $this.PAGE_SIZE;
    var search_payload = this.GET_PAYLOAD();
    delete search_payload.stream;
    var search_payload_pagination = search_payload['body'];
    search_payload_pagination['size'] = $this.PAGE_SIZE;
    search_payload_pagination['from'] = $this.FROM;
    request_data = JSON.stringify(search_payload_pagination);
    var credentials = $this.USERNAME + ":" + this.PASSWORD;
    jQuery.ajax({
      type: "POST",
      beforeSend: function(request) {
        request.setRequestHeader("Authorization", "Basic " + btoa(credentials));
      },
      'url': $this.FILTER_URL,
      dataType: 'json',
      contentType: "application/json",
      data: request_data,
      success: function(res) {
        $this.meetup_variable.SET_RECORDS(res, 'pagination');
      }
    });
  }
}
