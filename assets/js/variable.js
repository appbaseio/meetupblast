function meetup() {
  this.URL = 'https://qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3@scalr.api.appbase.io';
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
  this.SINGLE_RECORD_ClONE = $(".single_record_for_clone").clone()
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
  }
}