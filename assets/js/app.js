$(document).ready(function(){
	var meetup_val = new meetup();
	console.log(meetup_val);

	var streamingClient = appbase.newClient({
	    url: meetup_val.URL,
	    appname: meetup_val.APPNAME,
    });

    streamingClient.streamSearch(meetup_val.SEARCH_PAYLOAD).on('data', function(res) {
        var record_array = res.hits.hits;
        var record_length = record_array.length;
        for(var i=0; i < record_length; i++){
        	var single_record = record_array[i];
			var single_record_html = meetup_val.SINGLE_RECORD(single_record._source);
			$('#record-container').prepend(single_record_html);
        	console.log(single_record_html);
        }
    }).on('error', function(err) {
      console.log(err)
    });
});

