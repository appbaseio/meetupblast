var React = require('react');

var UserImg = React.createClass({
    componentDidMount: function() {
        var self = this;
        this.img = new Image();
        var defaultSrc = 'http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg';
        this.img.onerror = function() {
            if (self.isMounted()) {
                self.setState({
                    src: defaultSrc
                });
            }
        };
        this.img.src = this.state.src;
    },
    getInitialState: function() {
        return {
            src: this.props.src
        };
    },
    render: function() {
        return <img src={this.state.src} />;
    }
});
module.exports = UserImg;