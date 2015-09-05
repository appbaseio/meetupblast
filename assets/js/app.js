var substringMatcher = function(strs) {
	return function findMatches(q, cb) {
		var matches, substringRegex;

		// an array that will be populated with substring matches
		matches = [];

		// regex used to determine if a string contains the substring `q`
		substrRegex = new RegExp(q, 'i');

		// iterate through the pool of strings and for any string that
		// contains the substring `q`, add it to the `matches` array
		$.each(strs, function(i, str) {
			if (substrRegex.test(str)) {
				matches.push(str);
			}
		});

		cb(matches);
	};
};
var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
	'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
	'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
	'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
	'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
	'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
	'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
	'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
	'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

$('.topic_search').typeahead({
	hint: true,
	highlight: true,
	minLength: 0
}, {
	name: 'states',
	limit: 100,
	source: substringMatcher(states),
	templates: {
		pending: true,
		suggestion: function(data) {
			if (data) {
				var single_record = createTag(data);
				return single_record;
			} else
				return;
		}
	}
});

var topic_list = [];
function createTag(data) {
	var checkbox = $('<input>').attr({
		type: 'checkbox',
		name: 'brand',
		class:'tag_checkbox',
		value: data
	});
	if ($.inArray(data, topic_list) != -1)
		checkbox.prop('checked', true);
	var checkbox_text = $('<span>').text(data);
	var single_tag = $('<label>').append(checkbox).append(checkbox_text);

	checkbox.change(function() {
		if ($(this).is(':checked')){
			topic_list.push($(this).val());
			var tag_text = $('<span>').addClass('tag_text').text($(this).val());
			var tag_close = $('<span>').addClass('tag_close').text('X').attr('val',$(this).val());
			var single_tag = $("<span>").addClass('single_tag').append(tag_text).append(tag_close);
			$(tag_close).click(function(){
				var val = $(this).attr('val');
				$(single_tag).remove();
				topic_list.remove(val);
				$('.tag_checkbox[value="'+val+'"]').prop('checked',false);
			});
			$('.tag_name').append(single_tag);
		}
		else {
			topic_list.remove($(this).val());
		}
		console.log(topic_list);
	});
	return single_tag;
}

$('.topic_search').typeahead('val', '').focus();

Array.prototype.remove = function() {
	var what, a = arguments,
		L = a.length,
		ax;
	while (L && this.length) {
		what = a[--L];
		while ((ax = this.indexOf(what)) !== -1) {
			this.splice(ax, 1);
		}
	}
	return this;
};