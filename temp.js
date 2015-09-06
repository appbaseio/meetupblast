 streamingClient.streamSearch({
          type: 'meetup',
          body: {
            size: 50,
            // query: {
            //   term: { group:{'group_city':'Ventura'} }
            // },
            query: {
            match_all: {}
            }
            // ,
            // filter:{
            //     terms:{
            //          group:{'group_city':'Ventura'}
            //     }
            // }
          },