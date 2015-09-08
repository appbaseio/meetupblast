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

var uniqueId = 1;
var HelloWorldContainer = React.createClass({

    getInitialState: function() {
        return {
            notes: [],
            uniqueId : 1
        };
    },
   componentWillMount :function(){
        var $this = this;
        var initialFlag = true;
        var streamingClient = new appbase({
        url: 'https://qz4ZD8xq1:a0edfc7f-5611-46f6-8fe1-d4db234631f3@scalr.api.appbase.io',
        appname: 'meetup2',
        });

        // apply currentstream.stop() before starting a new request,
        // this stops the current feed from returning new results.
        var currentStream = streamingClient.streamSearch({
          type: 'meetup',
          body: {
            "query": {
              "filtered": {
                "query": {
                  "match_all": {}
                },
                "filter": {
                  "term": {
                    "group.group_city": "ahmedabad"   // configure this to the city you wish
                  }
                }
              }
            }
          },
        }).on('data', function(res) {
            //setTimeout(function(){
               //$this.replaceState($this.getInitialState());
            //},3000);
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
            // console.log(JSON.stringify(res));
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
        return (<div key={uniqueId} className="container full_row">
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

$(document).ready(function(){
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
        uniqueId = 2;
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
});
