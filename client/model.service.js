module.exports = function($resource, $rootScope, $filter) {
    var db = new Firebase("https://blistering-inferno-5589.firebaseio.com");

    var model = {
        categories: $resource("search/categories.json").query()
    }

    var references = {
        'TweetEarthquake': db.child('TweetEarthquake'),
        'TweetTraffic': db.child('TweetTraffic'),
        'TweetHillaryClinton': db.child('TweetHillaryClinton'),
        'TweetBernieSanders': db.child('TweetBernieSanders'),
        'TweetDonaldTrump': db.child('TweetDonaldTrump')
    }

    angular.forEach(references, function(ref, topic) {
        //ref.orderByChild("Timestamp").limitToLast(1000);
    });

    var initialize = function() {
        angular.forEach(model.categories, function(cat, index) {
            angular.forEach(cat.topics, function(topic, index) {
                // get initial data from firebase for each topic
                if (!model.hasOwnProperty(topic.topic)) model[topic.topic] = {};

                references[topic.topic].once('value', function(snapshot) {
                    angular.extend(model[topic.topic], snapshot.val());
                    angular.forEach(model[topic.topic], function(tweet, tweetId) {
                        tweet.Timestamp = $filter('date')(new Date(tweet.Timestamp), 'MM/dd/yyyy hh:mm');
                    });
                    $rootScope.$broadcast('model.' + topic.topic + '.updated');
                });

                // listen to event when a new data comes in for each topic
                references[topic.topic].on('child_added', function(snapshot, prev) {
                    angular.extend(model[topic.topic], snapshot.val());
                    $rootScope.$broadcast('model.' + topic.topic + '.added', new Array(snapshot.val()));
                });
            });
        });
    }
    
    // initialization and setup event broadcasting on data updates
    model.categories.$promise
        .then(
            function(response) {
                initialize();
            },

            function(failure) {
            
            }
        );

    return model;
}
