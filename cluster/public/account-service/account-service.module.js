/**
 * Created by david.bernadett on 7/31/16.
 */
var chargeList = angular.module('accountService', []);
chargeList.factory('accountService', function($http) {

    var service = {};
    service.categories = [];
    service.charges = [];
    service.getCategory = function(callback){
        $http.get('/api/1.0/category').then(function(response) {
            if(callback)
                callback(response.data);
        });
    };

    service.createCategory = function(name, callback){
        var newCategory = {category_name: name}
        $http.post('/api/1.0/category', newCategory).then(function(response){
            response.data.regex = [];
            service.categories.push(response.data);
            if(callback)
                callback(response.data);
        });
    };

    service.updateCategory = function(category, callback){
        $http.post('/api/1.0/category', category).then(function(response){
            if(callback)
                callback(response.data);
        });
    };

    service.deleteCategory = function(name, callback){
        $http.delete('/api/1.0/category/'+ encodeURIComponent(name)).then(function(response){
            var toDelete;
            for (category in service.categories) {
                if(service.categories[category].category_name === name){
                    toDelete = category;
                    break;
                }
            }
            service.categories.splice(toDelete,1);
            if(callback)
                callback(response.data);
        });
    };

    service.getRegex = function(category, callback){
        $http.get('/api/1.0/category/' + encodeURIComponent(category.category_name) + "/regex").then(function (response) {
            if(callback)
                callback(response.data);
        });
    };

    service.updateRegex = function(category, regex, callback){
        $http.post('/api/1.0/category/'+ encodeURIComponent(category.category_name) + "/regex", regex).then(function(response){
            if(callback)
                callback(response.data);
        });
    };

    service.deleteRegex = function(category, regex, callback){
        $http.delete('/api/1.0/category/'+ encodeURIComponent(category.category_name) + "/regex/" +regex.id).then(function(response){
            var toDelete;
            for (cat_index in category.regex) {
                if(category.regex[cat_index].id === regex.id){
                    toDelete = cat_index;
                    break;
                }
            }
            category.regex.splice(toDelete,1);
            if(callback)
                callback(response.data);
        });
    };

    service.createRegex = function(category, regex, callback){
        $http.post('/api/1.0/category/'+ encodeURIComponent(category.category_name) + "/regex",{regex:regex}).then(function(response){
            category.regex.push(response.data);
            if(callback)
                callback(response.data);
        });
    };

    service.getCharges = function(callback){
        $http.get('/api/1.0/charge').then(function(response) {
            if(callback)
                callback(response.data);
        });
        
    };

    service.updateCharge = function(charge, callback){
        $http.post('/api/1.0/charge', charge).then(function(response) {
            if(callback)
                callback(response.data);
        });

    };

    service.categorize = function(callback){
        for (charge in service.charges) {
            for (category in service.categories) {
                for (regex in service.categories[category].regex) {
                    service.charges[charge].category_name = "";
                    service.charges[charge].category_id = 0;
                }
            }
        }
        for (charge in service.charges) {
            for (category in service.categories) {
                for (regex in service.categories[category].regex) {
                    var result = service.charges[charge].memo.search(service.categories[category].regex[regex].regex);
                    if (result != -1 && service.charges[charge].category_name == ""){
                        service.charges[charge].category_name = service.categories[category].category_name;
                        service.charges[charge].category_id = service.categories[category].id;
                    } else if(result != -1) {
                        service.charges[charge].category_name = "conflict";
                        service.charges[charge].category_id = 0;
                    }
                }
            }
            service.updateCharge(service.charges[charge], null);
        }
        if(callback)
            callback(true);
    };

    service.getCharges(function(data){
        service.charges = data;
        for (charge in service.charges) {
            service.charges[charge].date = new Date(service.charges[charge].date);
        } 
    });

    service.getCategory(function(data){
        service.categories = data;
        angular.forEach(service.categories, function (value, key) {
            service.getRegex(value, function (regex_data) {
                value.regex = regex_data;
            });
        });
    });

    return service;
});