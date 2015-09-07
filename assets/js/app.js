$(document).ready(function(){
	var meetup_val = new meetup();
	
	var app_process = {
		
		//Stream Meetup
		stream_meetup:function(){
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
		        }
		    }).on('error', function(err) {
		      console.log(err)
		    });		
		},

		//Get City
		city_list:function(){
			var request_data = JSON.stringify(meetup_val.CITY_PAYLOAD);
			jQuery.ajax({
		      type: "POST",
		      beforeSend: function(request) {
		        request.setRequestHeader("Authorization", "Basic " + btoa(meetup_val.credentials));
		      },
		      'url':'http://scalr.api.appbase.io/meetup2/meetup/_search',
		      dataType: 'json',
		      contentType: "application/json",
		      data: request_data,
		      success: function(full_data) {
		      	city_list = [];
		      	var cities = full_data.aggregations.city.buckets;
		    	$.each(cities, function (i, city) {
			        city_list.push(city.key);
			    });
		        app_process.set_city(city_list);
		      }
		    });
		},

		//Set City
		set_city:function(cities){
			$('.topic_search').typeahead({
			    hint: true,
			    highlight: true,
			    minLength: 0
			}, {
			    name: 'cities',
			    limit: 100,
			    source: substringMatcher(cities),
			    templates: {
			        pending: true,
			        suggestion: function(data) {
			            if (data) {
			                var single_record = meetup_val.CREATE_TAG(data);
			                return single_record;
			            } else
			                return;
			        }
			    }
			});
		}
	}
	
	app_process.stream_meetup();
	app_process.city_list();
});

