/**
 * Created by david.bernadett on 8/7/16.
 */
angular.
    module('navbar').
    component('navbar',{
        templateUrl: 'navbar/navbar.template.html',
        controller: function NavBarController(){
            var self = this;
            self.tabs = {};
            self.tabs.summary = {active:true};
            self.tabs.trans = {active:false};
            self.switchTab = function(tab){
                angular.forEach(self.tabs, function(value, key) {
                    if(key == tab) {
                        value.active = true;
                    } else {
                        value.active =  false;
                    }

                });
            };
        }
    });