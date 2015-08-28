var HelloWorld = React.createClass({
    render:function(){
		return (
				// <div>
				// 	<strong>{this.props.texthead}</strong> is a new cool
				// </div>
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
                // {event:{event_name:'Call Bill'}},
                // {event:{event_name:'Call Bill1'}},
                // {event:{event_name:'Call Bill2'}},
                // {event:{event_name:'Call Bill3'}}
            
        };
    },
   componentWillMount :function(){
        var $this = this;
        var initialFlag = true;
        var streamingClient = appbase.newClient({
        url: 'https://61ONSqYR2:8820fb93-72e7-4dbf-a2a9-4b378f0197c9@scalr.api.appbase.io',
        appname: 'meetuprsvp',
        });

        streamingClient.streamSearch({
          type: 'meetup',
          body: {
            size: 50,
            query: {
                match_all: {}
            }
          },
        }).on('data', function(res) {
            //console.log(res)
            if(initialFlag) { 
                console.log(res)          
                initialFlag = false;                
                //this.state.notes = res.hits.hits;
                $this.setState({notes:res.hits.hits});
            }
            else{
                var arr = $this.state.notes;
                arr.unshift(res);
                $this.setState({notes: arr});
            }
            //console.log(res);
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
        , document.body);

// var initialFlag = true;
// var streamingClient = appbase.newClient({
//     url: 'https://61ONSqYR2:8820fb93-72e7-4dbf-a2a9-4b378f0197c9@scalr.api.appbase.io',
//     appname: 'meetuprsvp',
// });

// streamingClient.streamSearch({
//       type: 'meetup',
//       body: {
//         size: 50,
//         query: {
//             match_all: {}
//         }
//       },
// }).on('data', function(res) {
//     console.log(res)
//     if(initialFlag){
       
//         initialFlag = false;
//     }
// }).on('error', function(err) {
//       console.log(err)
// })

