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
