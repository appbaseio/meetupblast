function meetup() {
  this.URL = 'https://qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3@scalr.api.appbase.io';
  this.credentials = 'qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3';
  this.APPNAME = 'meetup2';
  this.SEARCH_PAYLOAD = {
    type: 'meetup',
    body: {
      "query": {
        "filtered": {
          "query": {
            "match_all": {}
          },
          "filter": {
            "term": {
              "group.group_city": "ahmedabad"
            }
          }
        }
      }
    }
  };
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
  SINGLE_RECORD: function(obj) {
    var single_record = this.SINGLE_RECORD_ClONE;
    single_record.removeClass('single_record_for_clone');
    single_record.find('.record_img').attr("src", obj.member.photo);
    single_record.find('.text-head').text(obj.member.member_name);
    single_record.find('.text-description').text(obj.event.event_name);
    return single_record;
  },
  CREATE_TAG: function(type, data) {
    $this = this;
    var list = type == 'city' ? $this.CITY_LIST : $this.TOPIC_LIST;
    var checkbox = $('<input>').attr({
      type: 'checkbox',
      name: 'brand',
      class: 'tag_checkbox',
      value: data
    });
    if ($.inArray(data, list) != -1)
      checkbox.prop('checked', true);
    var checkbox_text = $('<span>').text(data);
    var single_tag = $('<label>').append(checkbox).append(checkbox_text);

    checkbox.change(function() {
      if ($(this).is(':checked')) {
        list.push($(this).val());
        var tag_text = $('<span>').addClass('tag_text').text($(this).val());
        var tag_close = $('<span>').addClass('tag_close').text('X').attr('val', $(this).val());
        var single_tag = $("<span>").addClass('single_tag').append(tag_text).append(tag_close);
        $(tag_close).click(function() {
          var val = $(this).attr('val');
          $(single_tag).remove();
          list.remove(val);
          $('.tag_checkbox[value="' + val + '"]').prop('checked', false);
        });
        $('.tag_name').append(single_tag);
      } else {
        list.remove($(this).val());
      }
      console.log(list);
    });
    return single_tag;
  }
}