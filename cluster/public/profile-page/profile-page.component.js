/**
 * Created by david.bernadett on 7/31/16.
 */
angular.
    module('profilePage').
    component('profilePage',{
        templateUrl: 'profile-page/profile-page.template.html',
        controller: function ProfilePageController(accountService, chargeService, $http){
            var self = this;
            self.capitalize = function(txt){
                if(txt == null)
                    return "";
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
            self.accountService = accountService;
        }
    });
