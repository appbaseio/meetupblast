var HelloWorld = React.createClass({
    render:function(){
		return (
                <div className="full_row single-record">
                    <div className="img-container">
                        <img src={this.props.img} />
                    </div>
                    <div className="text-container full_row">
                        <div className="text-head text-overflow full_row">
                           {this.props.texthead}
                        </div>
                        <div className="text-description text-overflow full_row">
                            {this.props.textdescription}
                        </div>
                    </div>
                </div>

			)
	}	
});

var HelloWorldContainer = React.createClass({

    getInitialState: function() {
        return {
            notes: []
        };
    },
   componentWillMount :function(){
        var $this = this;
        var initialFlag = true;
        var streamingClient = appbase.newClient({
        url: 'https://qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3@scalr.api.appbase.io',
        appname: 'meetup2',
        });

        streamingClient.streamSearch({
          type: 'meetup',
          body: {
            "query": {
              "filtered": {
                "query": {
                  "match_all": {}
                },
                "filter": {
                  "term": {
                    "group.group_city": "nottingham"   // configure this to the city you wish
                  }
                }
              }
            }
          },
        }).on('data', function(res) {
            if(initialFlag) { 
                initialFlag = false;                
                $this.setState({notes:res.hits.hits});
            }
            else{
                console.log(res);
                var arr = $this.state.notes;
                arr.unshift(res);
                $this.setState({notes: arr});
            }
            console.log(JSON.stringify(res));
        }).on('error', function(err) {
          console.log(err)
        })
    },
    eachNote: function(note, i) {
        return (
                <HelloWorld img={note._source.member.photo} texthead ={note._source.member.member_name} textdescription = {note._source.event.event_name} ></HelloWorld>
            );
    },
    render: function() {
        return (<div className="container full_row">
                    {this.state.notes.map(this.eachNote)}
            </div>

        );
    }
});

 React.render(   
        <div>
            <HelloWorldContainer />
        </div>
        , document.getElementById('record-container'));

