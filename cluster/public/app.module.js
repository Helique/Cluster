/**
 * Created by david.bernadett on 7/31/16.
 */
var clusterApp =  angular.module('clusterApp', [
    'chargeList',
    'categoryList',
    'accountService',
    'navbar',
    'ngRoute',
    'reviewTab'
]);
clusterApp.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/plan', {
            template: "Go plan yourself"
        })
        .when('/organize', {
            template: "<charge-list></charge-list>"
        })
        .when('/review', {
            template: "<review-tab></review-tab>"
        })
});