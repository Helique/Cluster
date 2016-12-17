/**
 * Created by david.bernadett on 8/7/16.
 */
angular.
    module('navbar').
    component('navbar',{
        templateUrl: 'navbar/navbar.template.html',
        controller: function NavBarController(accountService){
            var self = this;
            self.accountService = accountService;

            if(accountService.loggedIn) {
                self.authOptions = accountService.authOptions.loggedIn;
            } else {
                self.authOptions = accountService.authOptions.loggedOut;
            }
        }
    });