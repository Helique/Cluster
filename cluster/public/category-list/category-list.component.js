/**
 * Created by david.bernadett on 8/7/16.
 */
angular.
    module('categoryList').
    component('categoryList',{
        templateUrl: 'category-list/category-list.template.html',
        controller: function CategoryListController($http){
            var self = this;

            self.createCategory = function(){
                console.log("go fuck yourself");
                self.categories.push({name: "New Category"});
            };

            self.updateCategory = function(category){
                console.log("go fuck yourself with this");
                console.log(category);
            };

            $http.get('/api/1.0/category').then(function(response) {
                self.categories = response.data;
                for (category in self.cateogries) {
                    self.categories[category].name = new Date(self.categories[category].name);
                }
            });
        }
    });