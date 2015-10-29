//User Image component
var UserImg = React.createClass({
    getDefaultProps:function(){
        return {
            DEFAULT_IMAGE:'http://www.avidog.com/wp-content/uploads/2015/01/BellaHead082712_11-50x65.jpg'
        };
    },
    getInitialState: function () {    
      return { src: this.props.src };
    }, 
    componentDidMount: function () {
        var self = this;
        var img = new Image();
        img.onerror = function () {
            self.setState({ src: self.props.DEFAULT_IMAGE });
        };
        img.src = this.state.src;

    },
    render:function(){
        return (
            <img className="record_img" src={this.state.src} alt="img" />
        )
    }
});

//User component
var User = React.createClass({
    HIGHLIGHT_TAGS:function(group_topics){
        var highlight_tags = [];
        var group_topics = group_topics;
        var highlight = REQUEST.TOPIC_LIST;

        if(highlight.length){
          for(i=0; i < group_topics.length; i++){
            for(var j = 0; j < highlight.length; j++){
              if(highlight[j] == group_topics[i])
                group_topics.splice(i,1);
            }
          }
          for(i=0; i < highlight.length; i++){
            highlight_tags.push(highlight[i]);
          }
        }

        var lower = group_topics.length < 3 ? group_topics.length : 3;
        for(i=0; i < lower; i++){
          highlight_tags.push(group_topics[i]['topic_name']);
        }
        return highlight_tags;
    },
    render:function(){
        var highlight_tags = this.HIGHLIGHT_TAGS(this.props.group_topics);
        return (
                <a className="full_row single-record single_record_for_clone"
                    href={this.props.event_url}
                    target="_blank">
                    <div className="img-container">
                        <UserImg src={this.props.img}></UserImg>
                    </div>
                    <div className="text-container full_row">
                        <div className="text-head text-overflow full_row">
                            <span className="text-head-info text-overflow">
                                {this.props.name} is going to {this.props.event_name}
                            </span>
                            <span className="text-head-city">{this.props.group_city}</span>
                        </div>
                        <div className="text-description text-overflow full_row">
                            <ul className="highlight_tags">
                                {
                                    highlight_tags.map(function(tag,i){
                                        return (<li>{tag}</li>)
                                    })
                                }
                            </ul>
                        </div>
                    </div>
                </a>
            )
    }   
});
