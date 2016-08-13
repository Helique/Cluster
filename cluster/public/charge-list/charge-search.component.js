/**
 * Created by david.bernadett on 7/31/16.
 */
angular.
module('chargeList').
component('chargeSearch',{
    templateUrl: 'charge-list/charge-search.template.html',
    controller: function ChargeSearchController(chargeService, $http){
        var self = this;
        self.chargeService = chargeService;
    }
});