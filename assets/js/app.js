$(document).ready(function(){
	var meetup_val = new meetup();
	var app_process = {

		//Stream Meetup
		stream_meetup:function(){
			app_process.make_responsive();
			streamingClient = meetup_val.GET_STREAMING_CLIENT();
			meetup_val.FIRE_FILTER(streamingClient);
			app_process.pagination();
		},

		//Responsive
		make_responsive:function(){			
			function size_set(){
				var window_height = $(window).height() - 15;
				$('.meetup-record-holder').css('height',window_height);
			};
			size_set();
			$(window).resize(function(){
				size_set();
			});
		},
		//Pagination
		pagination:function(){
			$('.meetup-record-holder').on('scroll', function() {
				if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
					meetup_val.PAGINATION();
				}
			});	
		},
		//Get City
		city_list:function(){
			var request_data = JSON.stringify(meetup_val.CITY_PAYLOAD);
			jQuery.ajax({
		      type: "POST",
		      beforeSend: function(request) {
		        request.setRequestHeader("Authorization", "Basic " + btoa(meetup_val.USERNAME+":"+meetup_val.PASSWORD));
		      },
		      'url':'http://scalr.api.appbase.io/meetup2/meetup/_search',
		      dataType: 'json',
		      contentType: "application/json",
		      data: request_data,
		      success: function(full_data) {
		      	app_process.topic_list();
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
			$('.city_search').typeahead({
			    hint: true,
			    highlight: true,
			    minLength: 0
			}, {
			    name: 'cities',
			    limit: 1000,
			    source: substringMatcher(cities),
			    templates: {
			        pending: true,
			        suggestion: function(data) {
			            if (data) {
			                var single_record = meetup_val.CREATE_TAG('city',data);
			                return single_record;
			            } else
			                return;
			        }
			    }
			});
		},

		//Get Topics
		topic_list:function(){
			var request_data = JSON.stringify(meetup_val.TOPIC_PAYLOAD);
			jQuery.ajax({
		      type: "POST",
		      beforeSend: function(request) {
		        request.setRequestHeader("Authorization", "Basic " + btoa(meetup_val.USERNAME+":"+meetup_val.PASSWORD));
		      },
		      'url':'http://scalr.api.appbase.io/meetup2/meetup/_search',
		      dataType: 'json',
		      contentType: "application/json",
		      data: request_data,
		      success: function(full_data) {
		      	topic_list = [];
		      	var cities = full_data.aggregations.city.buckets;
		    	$.each(cities, function (i, city) {
			        topic_list.push(city.key);
			    });
			    var topic_icon = '<img src="images/search.png" class="search_thumb">';
		        app_process.set_topic(topic_list);
				$('.topic_search').typeahead('val', '').focus();
				$('.city_search').typeahead('val', '').focus();
		      }
		    });
		},

		//Set Topics
		set_topic:function(topics){
			$('.topic_search').typeahead({
			    hint: true,
			    highlight: true,
			    minLength: 0
			}, {
			    name: 'topics',
			    limit: 1000,
			    source: substringMatcher(topics),
			    templates: {
			        pending: true,
			        suggestion: function(data) {
			            if (data) {
			                var single_record = meetup_val.CREATE_TAG('topic',data);
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
