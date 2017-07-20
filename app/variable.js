function meetup() {
  this.REQUEST = new meetup_request(this);
  this.DEFAULT_IMAGE = 'http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg';
  this.SINGLE_RECORD_ClONE = $(".single_record_for_clone").clone();
}

meetup.prototype = {
  constructor: meetup,
  //creating meetup single records
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
  //Showing topics in each record on the basis of selected topics.
  HIGHLIGHT_TAGS:function(group_topics){
    var highlight_tags = '';
    var group_topics = group_topics;
    var highlight = this.REQUEST.TOPIC_LIST;

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
  //create city or topic list items
  CREATE_TAG: function(type, data) {
    $this = this;
    var list = type == 'city' ? $this.REQUEST.CITY_LIST : $this.REQUEST.TOPIC_LIST;
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
      $this.CHECK_CHANGE(this, list, container);   
    });
    return single_tag;
  },
  //fire this function whenever user selecting/canceling city/topic
  CHECK_CHANGE:function(eve, list, container){
     var checkbox_val = $(eve).val();
      var type = $(eve).attr('container');
      var check2 = checkbox_val;

      if ($(eve).is(':checked')) {
        list.push(check2);
        var tag_text = $('<span>').addClass('tag_text').text(checkbox_val);
        var tag_close = $('<span>').addClass('tag_close').text('x').attr('val', checkbox_val);
        var single_tag = $("<span>").addClass('single_tag').attr('val', checkbox_val).append(tag_text).append(tag_close);
        $(tag_close).click(function() {
          var val = $(this).attr('val');
          $(single_tag).remove();
          list.remove(val);
          $this.REQUEST.FIRE_FILTER();
          container.find('.tag_checkbox[value="' + val + '"]').prop('checked', false);
        });
        container.find('.tag_name').append(single_tag);
        $this.REQUEST.FIRE_FILTER();
      } else {
        container.find('.single_tag[val="' + checkbox_val + '"]').remove();
        list.remove(check2);
        $this.REQUEST.FIRE_FILTER();
      }
  },
  //this function is the callback of fire_filter which takes the data and pass each data to single record
  SET_RECORDS:function(res, method){
    var $this = this;
     if(res.hasOwnProperty('hits')){
          var record_array = res.hits.hits;
          var record_length = record_array.length;
          for (var i = 0; i < record_length; i++) {
            var single_record = record_array[i];
            var single_record_html = $this.SINGLE_RECORD(single_record._source);
            if(method == 'initialize'){
              $('#record-container').prepend(single_record_html);
            }
            else{
             $('#record-container').append(single_record_html);
            }
          }
        }
        else{
              var single_record = res;
              var single_record_html = $this.SINGLE_RECORD(single_record._source);
              if(method == 'initialize'){
              $('#record-container').prepend(single_record_html);
            }
            else{
             $('#record-container').append(single_record_html);
            }
        }
      }
}
