/**
 * Created by david.bernadett on 7/31/16.
 */
angular.
    module('reviewTab').
    component('reviewTab',{
        templateUrl: 'review-tab/review-tab.template.html',
        controller: function ReviewTabController(accountService, chargeService, $http){
            var self = this;
            self.filterByCategory = filterByCategory;
            function filterByCategory(charge) {
                if (self.onlyUncategorized && charge.category_id == 0) {
                    return true;
                } else if (self.onlyUncategorized) {
                    return false;
                } else {
                    return true;
                }
            }
            self.accountService = accountService;
        }
    });
