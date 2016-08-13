/**
 * Created by david.bernadett on 7/31/16.
 */
angular.
    module('chargeList').
    component('chargeList',{
        templateUrl: 'charge-list/charge-list.template.html',
        controller: function ChargeListController(chargeService, $http){
            var self = this;
            $http.get('/api/1.0/charge').then(function(response) {
                self.charges = response.data;
                for (charge in self.charges) {
                    self.charges[charge].date = new Date(self.charges[charge].date);
                }
            });
            self.chargeService = chargeService;
            self.ordering = '-date';
        }
    });