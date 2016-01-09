var React = require('react');
var Tag = React.createClass({
    getInitialState: function() {
        return {
            list: []
        };
    },
    CHECK_CHANGE: function(eve, list, container) {
        var $this = this;
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
                $this.props.fire_response();
                container.find('.tag_checkbox[value="' + val + '"]').prop('checked', false);
            });
            container.find('.tag_name').append(single_tag);
            $this.props.fire_response();
        } else {
            container.find('.single_tag[val="' + checkbox_val + '"]').remove();
            list.remove(check2);
            $this.props.fire_response();
        }
    },
    //create city or topic list items
    CREATE_TAG: function(type, data) {
        $this = this;
        var list = type == 'city' ? REQUEST.CITY_LIST : REQUEST.TOPIC_LIST;
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
    set_filter_list: function(method, list) {
        var $this = this;
        $('.' + method + '_search').typeahead({
            hint: true,
            highlight: true,
            minLength: 0
        }, {
            name: method,
            source: substringMatcher(list),
            templates: {
                pending: true,
                suggestion: function(data) {
                    if (data) {
                        var single_record = $this.CREATE_TAG(method, data);
                        return single_record;
                    } else
                        return;
                }
            }
        });
        setTimeout(function() {
            $('.' + method + '_search').typeahead('val', '').focus();
        }, 1000);
    },
    componentWillMount: function() {
        var $this = this;
        var method = this.props.type;
        var request_data = JSON.stringify(REQUEST.FILTER_PAYLOAD(method));
        jQuery.ajax({
            type: "POST",
            beforeSend: function(request) {
                request.setRequestHeader("Authorization", "Basic " + btoa(REQUEST.USERNAME + ":" + REQUEST.PASSWORD));
            },
            'url': REQUEST.FILTER_URL,
            dataType: 'json',
            contentType: "application/json",
            data: request_data,
            success: function(full_data) {
                var city_list = [];
                var cities = full_data.aggregations.city.buckets;
                $.each(cities, function(i, city) {
                    city_list.push(city.key);
                });
                $this.set_filter_list(method, city_list);
            }
        });
    },
    render: function() {
        var method = this.props.type + '_search col-xs-12';
        var inside_container = this.props.type + "_container block col-xs-12";
        return (
                <div key={this.props.key} className={inside_container}>
                    <label className="block_label">Search by {this.props.type}</label>
                    <div className="tag_name">
                    </div>
                    <div className="full_row">
                        <input type="text" placeholder="search" className={method} />
                        <img src="assets/images/search.png" className="search_thumb" />
                    </div>
                </div>       
        );
    }
});


module.exports = Tag;