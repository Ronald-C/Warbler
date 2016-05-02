(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
window.initWarbler = function() {
    var gmap_directive = require("./gmap/gmap.directive");
    var warblerSearch_directive = require("./search/warblerSearch.directive");
    
    var main_controller = require("./main.controller");
    var gmap_controller = require("./gmap/gmap.controller");

    var model_service = require("./model.service");

    var app = angular.module('warbler', ['ngResource']);

    app
        .service('warbler_model_service', ['$rootScope', model_service])
    ;

    app
        .directive('gmap', [gmap_directive])
        .directive('warblerSearch', [warblerSearch_directive])
    ;

    app
        .controller('warbler_main_controller', ['$scope', main_controller])
        .controller('gmapController', ['$scope', 'warbler_model_service', gmap_controller])
    ;

    angular.bootstrap(document, ['warbler']);
    
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("toggled");
        $(this).find('i').toggleClass('fa-bars fa-ellipsis-v')
    });

    $(window).resize(function() {
        var h = $(window).height()

        $('#gmap').css('height', h);
    }).resize();
}

},{"./gmap/gmap.controller":2,"./gmap/gmap.directive":3,"./main.controller":4,"./model.service":5,"./search/warblerSearch.directive":6}],2:[function(require,module,exports){
module.exports = function($scope, model) {

}

},{}],3:[function(require,module,exports){
module.exports = function() {
    /***** Private properties ******/
    var mapOptions = {
        center: new google.maps.LatLng(0, 0),
        zoom: Math.ceil(Math.log2($(window).width())) - 8,
    };

    var map;
    var twitterMarkers = [];

    function clearMarkers(markerList) {
        angular.forEach(markerList, function(marker, index) {
            marker.setMap(null);
        });
    }

    function markerFactory(title, lat, lng, icon, info) {
        var newMarker = new google.maps.Marker({
            map: map,
            draggable: false,
            title: 'source: Twitter',

            animation: google.maps.Animation.DROP,
            position: {
                lat: lat,
            lng: lng
            },
            icon: icon
        });

        var infowindow = new google.maps.InfoWindow({
            content: info
        });

        newMarker.addListener('click', function() {
            infowindow.open(map, newMarker);
        });

        return newMarker;
    }


    /****** directive properties ********/
    return {
        scope: {
            tweets: '=tweets'
        },
        link: function($scope, $element, $attrs) {
            map = new google.maps.Map($element[0], mapOptions);

            $scope.$watch('tweets', function(newData, oldData) {
                if (!oldData) oldData = [];
                if (!newData) newData = [];
                if (newData.length < oldData.length) {
                    clearMarkers(twitterMarkers);
                }

                var heatmapData = [];
                for (var i = oldData.length, l = newData.length; i < l; i++) {
                    var tweet = newData[i];

                    if (!tweet.coordinates) return false;
                    var lat = tweet.coordinates[0];
                    var lng = tweet.coordinates[1];

                    var contentString = tweet.text;
                    var icon = 'img/markers/earthquake-3.png';

                    var marker = markerFactory('source: Twitter', lat, lng, icon, contentString);

                    twitterMarkers.push(marker);

                    var latLng = new google.maps.LatLng(lat, lng);
                    heatmapData.push(latLng);
                }

                var heatmap = new google.maps.visualization.HeatmapLayer({
                    data: heatmapData,
                    dissipating: false,
                    map: map
                });

                setTimeout(function() {
                    $scope.$apply(), 300
                });
            }, true);
        }
    }
}

},{}],4:[function(require,module,exports){
module.exports = function($scope) {
   console.log('init main_controller'); 
} 

},{}],5:[function(require,module,exports){
module.exports = function($resource) {
    var db = new Firebase("https://blistering-inferno-5589.firebaseio.com");
    var model = {
    
    }
    
    return model;
}

},{}],6:[function(require,module,exports){
module.exports = function() {
    var controller = function($scope, $resource) {
        $scope.categories = $resource("search/categories.json").query();
        $scope.toggleTopic = function(topic) {
            topic.selected = !topic.selected;
            console.log(topic);
        }

        console.log("init warblerSearch");
    }

    return {
        templateUrl: 'search/warblerSearch.template.html',
        link: function($scope, $element, $attrs) {

        },

        controller: ['$scope', '$resource', controller]
    }
}

},{}]},{},[1]);
