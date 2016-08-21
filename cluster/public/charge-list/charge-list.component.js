/**
 * Created by david.bernadett on 7/31/16.
 */
angular.
    module('chargeList').
    component('chargeList',{
        templateUrl: 'charge-list/charge-list.template.html',
        controller: function ChargeListController(accountService, chargeService, $http){
            var self = this;
            self.chargeService = chargeService;
            self.accountService = accountService;
            self.ordering = '-date';
        }
    });