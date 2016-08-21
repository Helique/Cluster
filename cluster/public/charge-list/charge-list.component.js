/**
 * Created by david.bernadett on 7/31/16.
 */
angular.
    module('chargeList').
    component('chargeList',{
        templateUrl: 'charge-list/charge-list.template.html',
        controller: function ChargeListController(accountService, chargeService, $http){
            var self = this;
            self.filterByCategory = filterByCategory;
            function filterByCategory(charge) {
                if(self.onlyUncategorized && charge.category_id == 0 ){
                    return true;
                }else if(self.onlyUncategorized){
                    return false;
                } else {
                    return true;
                }
            }
            self.chargeService = chargeService;
            self.accountService = accountService;
            self.ordering = '-date';
        }
    })
    .filter('dateBetween', function() {
        // In the return function, we must pass in a single parameter which will be the data we will work on.
        // We have the ability to support multiple other parameters that can be passed into the filter optionally
        return function(input, dateStart, dateEnd) {
            var output = [];
            if (dateEnd != undefined && dateStart != undefined){
                angular.forEach(input, function(value, key) {
                    if(dateStart <= value.date && dateEnd >= value.date) {
                        output.push(value);
                    }
                });
            }else if(dateEnd != undefined){
                angular.forEach(input, function(value, key) {
                    if(dateEnd >= value.date) {
                        output.push(value);
                    }
                });
            }else if(dateStart != undefined){
                angular.forEach(input, function(value, key) {
                    if(dateStart <= value.date) {
                        output.push(value);
                    }
                });
            } else {
                output = input;
            }
            console.log(dateStart);
            console.log(dateEnd);
            return output;

        }
    });