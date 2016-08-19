/**
 * Created by david.bernadett on 8/7/16.
 */
angular.
    module('categoryList').
    component('categoryList',{
        templateUrl: 'category-list/category-list.template.html',
        controller: function CategoryListController($http){
            var self = this;
            self.createCategory = function(name){
                var newCategory = {category_name: name}
                $http.post('/api/1.0/category', newCategory).then(function(response){
                    self.categories.push(response.data);
                });
            };
            self.updateCategory = function(category){
                $http.post('/api/1.0/category', category).then(function(response){
                });
            };
            self.deleteCategory = function(name){
                $http.delete('/api/1.0/category/'+ name).then(function(response){
                    console.log(response);
                    for (category in self.categories) {
                        if(self.categories[category].category_name === name){
                            toDelete = category;
                            break;
                        }
                    }
                    self.categories.splice(toDelete,1);
                });
            };
            self.updateRegex = function(category, regex){
                $http.post('/api/1.0/category/'+ category.category_name + "/regex", regex).then(function(response){
                });
            };
            
            self.deleteRegex = function(category, regex){
                $http.delete('/api/1.0/category/'+ category.category_name + "/regex/" +regex.id).then(function(response){
                    var toDelete;
                    for (cat_index in category.regex) {
                        if(category.regex[cat_index].id === regex.id){
                            toDelete = cat_index;
                            break;
                        }
                    }
                    category.regex.splice(toDelete,1);
                });
                
            };

            self.createRegex = function(category, regex){
                $http.post('/api/1.0/category/'+ category.category_name + "/regex",{regex:regex}).then(function(response){
                    category.regex.push(response.data);
                });
            };

            $http.get('/api/1.0/category').then(function(response) {
                self.categories = response.data;
                for (category in self.categories) {
                    $http.get('/api/1.0/category/'+self.categories[category].category_name+"/regex").then(function(response) {
                        self.categories[category].regex = response.data;
                    });
                }
            });
        }
    });