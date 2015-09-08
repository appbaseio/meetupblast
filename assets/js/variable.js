function meetup() {
  this.URL = 'https://qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3@scalr.api.appbase.io';
  this.credentials = 'qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3';
  this.APPNAME = 'meetup2';
  this.CITY_PAYLOAD = {
    "size": "0",
    "query": {
      "multi_match": {
        "query": "new",
        "fields": [
          "group_city_simple",
          "group_city_ngrams"
        ],
        "operator": "and"
      }
    },
    "aggs": {
      "city": {
        "terms": {
          "field": "group_city_simple",
          "order": {
            "_count": "desc"
          },
          "size": 0
        }
      }
    }
  };
  this.TOPIC_PAYLOAD = {
    "size": "0",
    "query": {
      "multi_match": {
        "query": "so",
        "fields": [
          "topic_name_simple",
          "topic_name_ngrams"
        ],
        "operator": "and"
      }
    },
    "aggs": {
      "topic_name": {
        "terms": {
          "field": "topic_name_simple",
          "order": {
            "_count": "desc"
          },
          "size": 0
        }
      }
    }
  };
  this.SINGLE_RECORD_ClONE = $(".single_record_for_clone").clone();
  this.CITY_LIST = [];
  this.TOPIC_LIST = [];
}

meetup.prototype = {
  constructor: meetup,
  SEARCH_PAYLOAD: function() {
    var obj = {
      type: 'meetup',
      body: {
        "query": {
          "filtered": {
            "query": {
              "match_all": {}
            },
            "filter": {
              // "and": [
              //   // {
              //   //   "terms": {
              //   //   //  "group.group_city": ["newport"]
              //   //   }
              //   // }
              //   // ,
              //   // {
              //   //   "terms": {
              //   //   //   "group.group_topics.topic_name": "0"
              //   //   }
              //   // }
              // ]
            }
          }
        }
      }
    };
    return obj;
  },
  SINGLE_RECORD: function(obj) {
    var single_record = this.SINGLE_RECORD_ClONE.clone();
    single_record.removeClass('single_record_for_clone');
    single_record.find('.record_img').attr("src", obj.member.photo);
    single_record.find('.text-head').text(obj.member.member_name);
    single_record.find('.text-description').text(obj.event.event_name);
    return single_record;
  },
  CREATE_TAG: function(type, data) {
    $this = this;
    var list = type == 'city' ? $this.CITY_LIST : $this.TOPIC_LIST;
    var container = $('.' + type + '_container');
    var checkbox = $('<input>').attr({
      type: 'checkbox',
      name: 'brand',
      class: 'tag_checkbox',
      container: type,
      value: data
    });
    if ($.inArray(data, list) != -1)
      checkbox.prop('checked', true);
    var checkbox_text = $('<span>').text(data);
    var single_tag = $('<label>').append(checkbox).append(checkbox_text);

    checkbox.change(function() {
      var checkbox_val = $(this).val();
      var type = $(this).attr('container');
      var check2 = checkbox_val;

      if ($(this).is(':checked')) {
        list.push(check2);
        var tag_text = $('<span>').addClass('tag_text').text(checkbox_val);
        var tag_close = $('<span>').addClass('tag_close').text('X').attr('val', checkbox_val);
        var single_tag = $("<span>").addClass('single_tag').attr('val', checkbox_val).append(tag_text).append(tag_close);
        $(tag_close).click(function() {
          var val = $(this).attr('val');
          $(single_tag).remove();
          list.remove(val);
          $this.FIRE_FILTER();
          container.find('.tag_checkbox[value="' + val + '"]').prop('checked', false);
        });
        container.find('.tag_name').append(single_tag);
        $this.FIRE_FILTER();
      } else {
        container.find('.single_tag[val="' + checkbox_val + '"]').remove();
        list.remove(check2);
        $this.FIRE_FILTER();
      }
      //console.log(list);
    });
    return single_tag;
  },
  FIRE_FILTER: function() {
    var $this = this
    var search_payload = this.SEARCH_PAYLOAD();

    search_payload['body']['query']['filtered']['filter'] = {};
    if($this.CITY_LIST.length || $this.TOPIC_LIST.length){      
      search_payload['body']['query']['filtered']['filter'] = {'and':[]};
    }

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

    console.log(JSON.stringify(search_payload));
    $('#record-container').html('');

    if (typeof streamingClient != 'undefined')
      streamingClient.streamSearch.stop();

    var streamingClient = new appbase({
      url: $this.URL,
      appname: $this.APPNAME
    });
    streamingClient.streamSearch(search_payload).on('data', function(res) {
      console.log(res);
      var record_array = res.hits.hits;
      var record_length = record_array.length;
      for (var i = 0; i < record_length; i++) {
        var single_record = record_array[i];
        var single_record_html = $this.SINGLE_RECORD(single_record._source);
        $('#record-container').append(single_record_html);
      }
    }).on('error', function(err) {
      console.log(err)
    });
  }

}