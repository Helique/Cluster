/**
 * Created by david.bernadett on 8/7/16.
 */
angular.
    module('categoryList').
    component('categoryList',{
        templateUrl: 'category-list/category-list.template.html',
        controller: function CategoryListController($http, accountService){
            var self = this;
            self.accountService = accountService;
        }
    });