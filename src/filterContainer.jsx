var React = require('react');
var Tag = require('./tag.jsx');

var FilterContainer = React.createClass({
    componentWillMount: function() {
        this.fire_response();
    },
    fire_response: function() {
        var $this = this;
        streamingClient = REQUEST.GET_STREAMING_CLIENT();
        var stream_on = REQUEST.FIRE_FILTER(this.props.CITY_LIST, this.props.TOPIC_LIST);
        stream_on.on('data', function(res) {
            $this.props.on_get_data(res);
            $this.stream_start();
        }).on('error', function(err) {});
    },
    stream_start: function() {
        var $this = this;
        streamingClient = REQUEST.GET_STREAMING_CLIENT();
        var stream_on = REQUEST.STREAM_START(this.props.CITY_LIST, this.props.TOPIC_LIST);
        stream_on.on('data', function(res) {
            $this.props.on_get_data(res, true);
        }).on('error', function(err) {});
    },
    set_list: function(method, list) {
        this.props.set_list(method, list);
        this.fire_response();
    },
    render: function() {
        return (
                <div className="meetup-filter-container">
                    <Tag key="1" type="topic"
                        set_list={this.set_list}
                        list={this.props.TOPIC_LIST}
                        fire_response={this.fire_response}></Tag>
                </div>
        )
    }
});


module.exports = FilterContainer;
