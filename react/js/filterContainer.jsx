var React = require('react');
var Tag = require('./tag.jsx');

var FilterContainer = React.createClass({
    fire_response:function(){
        this.props.fire_response();
    },
    render: function() {
        return (
                <div className="meetup-filter-container">
                    <Tag key="0" type="city" fire_response={this.fire_response}></Tag>
                    <Tag key="1" type="topic" fire_response={this.fire_response}></Tag>
                </div>
        )
    }   
});


module.exports = FilterContainer;