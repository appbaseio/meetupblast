$(document).ready(function() {
	var meetup_val = new meetup();
	var app_process = {

		//Stream Meetup
		stream_meetup: function() {
			app_process.make_responsive();
			streamingClient = meetup_val.REQUEST.GET_STREAMING_CLIENT();
			meetup_val.REQUEST.FIRE_FILTER();
			app_process.pagination();
		},

		//Responsive
		make_responsive: function() {
			function size_set() {
				var window_height = $(window).height() - 15;
				$('.meetup-record-holder').css('height', window_height);
			};
			size_set();
			$(window).resize(function() {
				size_set();
			});
		},
		//Pagination
		pagination: function() {
			$('.meetup-record-holder').on('scroll', function() {
				if ($(this).scrollTop() + $(this).innerHeight() >= this.scrollHeight) {
					meetup_val.REQUEST.PAGINATION();
				}
			});
		},

		//Get Filter List
		get_filter_list: function(method) {
			var request_data = JSON.stringify(meetup_val.REQUEST.FILTER_PAYLOAD(method));
			jQuery.ajax({
				type: "POST",
				beforeSend: function(request) {
					request.setRequestHeader("Authorization", "Basic " + btoa(meetup_val.REQUEST.USERNAME + ":" + meetup_val.REQUEST.PASSWORD));
				},
				'url': meetup_val.REQUEST.FILTER_URL,
				dataType: 'json',
				contentType: "application/json",
				data: request_data,
				success: function(full_data) {
					var city_list = [];
					var cities = full_data.aggregations.city.buckets;
					$.each(cities, function(i, city) {
						city_list.push(city.key);
					});
					app_process.set_filter_list(method, city_list);

					if (method == 'city') {
						app_process.get_filter_list('topic');
					}
					 else {
						$('.topic_search').typeahead('val', '').focus();
						$('.city_search').typeahead('val', '').focus();
					}
				}
			});
		},

		//Set Filter
		set_filter_list: function(method, cities) {
			$('.' + method + '_search').typeahead({
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
							var single_record = meetup_val.CREATE_TAG(method, data);
							return single_record;
						} else
							return;
					}
				}
			});
		}
	}

	app_process.stream_meetup();
	app_process.get_filter_list('city');
});