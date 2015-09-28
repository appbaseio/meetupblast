function meetup() {
  this.URL = 'https://scalr.api.appbase.io';
  this.USERNAME = 'qz4ZD8xq1';
  this.PASSWORD = 'a0edfc7f-5611-46f6-8fe1-d4db234631f3';
  this.APPNAME = 'meetup2';
  this.DEFAULT_IMAGE = 'http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg';
  this.CITY_PAYLOAD = {
    "size": "0",
    "query": {
      "match_all": {}
    },
    "aggs": {
      "city": {
        "terms": {
          "field": "group_city_simple",
          "order": {
            "_count": "desc"
          },
          "size": 1000
        }
      }
    }
  };

  this.TOPIC_PAYLOAD = {
    "size": "0",
    "query": {
      "match_all": {}
    },
    "aggs": {
      "city": {
        "terms": {
          "field": "topic_name_simple",
          "order": {
            "_count": "desc"
          },
          "size": 1000
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
  SEARCH_PAYLOAD: function(method) {
    if (method == 'pure') {
      var obj = {
        type: 'meetup',
        size: 100,
        body: {
          "query": {
            "match_all": {}
          },
          "sort": [
            {"rsvp_id": {"order": "desc"}}
          ]
        }
      };
    } else {
      var obj = {
        type: 'meetup',
        stream: true,
        size: 100,
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
          "sort": [
            {"rsvp_id": {"order": "desc"}}
          ]
        }
      };
    }

    return obj;
  },
  GET_STREAMING_CLIENT:function(){
      if(typeof streamingClient == 'undefined'){
        streamingClient = new Appbase({
          url: this.URL,
          appname: this.APPNAME,
          username: this.USERNAME,
          password: this.PASSWORD
        });
      }
      return streamingClient;
  },
  SINGLE_RECORD: function(obj) {
    var single_record = this.SINGLE_RECORD_ClONE.clone();
    single_record.removeClass('single_record_for_clone');
    single_record.find('.record_img').attr({
      "src":obj.member.photo,
      'onerror': 'this.onerror = null; this.src="' + this.DEFAULT_IMAGE + '"'

    });
    var text_head = '<span class="text-head-info text-overflow">'+obj.member.member_name+' is going to '+obj.event.event_name+'</span><span class="text-head-city">'+obj.group.group_city+'</span>';
    single_record.attr({
      href:obj.event.event_url,
      target:"_blank"
    });
    single_record.find('.text-head').html(text_head);
    var highlight_tags = this.HIGHLIGHT_TAGS(obj.group.group_topics);
    single_record.find('.text-description').html(highlight_tags);
    return single_record;
  },
  HIGHLIGHT_TAGS:function(group_topics){
    var highlight_tags = '';
    var group_topics = group_topics;
    var highlight = this.TOPIC_LIST;

    if(highlight.length){
      for(i=0; i < group_topics.length; i++){
        for(var j = 0; j < highlight.length; j++){
          if(highlight[j] == group_topics[i])
            group_topics.splice(i,1);
        }
      }
      for(i=0; i < highlight.length; i++){
        highlight_tags += '<li>'+highlight[i]+'</li>';
      }
    }

    var lower = group_topics.length < 3 ? group_topics.length : 3;
    for(i=0; i < lower; i++){
      highlight_tags += '<li>'+group_topics[i]['topic_name']+'</li>';
    }
    return '<ul class="highlight_tags">'+highlight_tags+'</ul>';
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
        var tag_close = $('<span>').addClass('tag_close').text('x').attr('val', checkbox_val);
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
    var streaming = this.GET_STREAMING_CLIENT();
    if($this.CITY_LIST.length || $this.TOPIC_LIST.length){
      var search_payload = this.SEARCH_PAYLOAD('filter');

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
    }
    else{
      var search_payload = this.SEARCH_PAYLOAD('pure');
    }
    if (typeof responseStream !== 'undefined')
      responseStream.stop();
    responseStream = streaming.streamSearch(search_payload).on('data', function(res) {
        console.log(res);
        if(res.hasOwnProperty('hits')){
          var record_array = res.hits.hits;
          var record_length = record_array.length;
          for (var i = 0; i < record_length; i++) {
            var single_record = record_array[i];
            var single_record_html = $this.SINGLE_RECORD(single_record._source);
            $('#record-container').prepend(single_record_html);
          }
        }
        else{
              var single_record = res;
              var single_record_html = $this.SINGLE_RECORD(single_record._source);
              $('#record-container').prepend(single_record_html);
        }

    }).on('error', function(err) {
      console.log(err)
    });

    console.log(JSON.stringify(search_payload));
    $('#record-container').html('');

    console.log("reinstantiating...");
    console.log(search_payload);


  }

}
