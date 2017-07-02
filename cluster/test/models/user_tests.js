var user_model = require("../../models/users");
var expect = require("chai").expect

describe("User Model", function(){
  describe("Create new User", function(){
    it("Creates new users with unique ID's", function(done){
      user_model.newUser("testUsername1","testPassword1","test@test.com", (res)=>{
        expect(res.id).is.equal(1);
        done();
      });
    });

    it("Returns Error on Duplicate Username", function(done){
      user_model.newUser("testUsername1","testPassword2","test_secondary@test.com", (res)=>{
        expect(res).is.equal(user_model.errors.usernameInUse);
        done();
      });
    });

    it("Returns Error on Duplicate Email", function(done){
      user_model.newUser("testUserame1_secondary","testPassword2","test@test.com", (res)=>{
        expect(res).is.equal(user_model.errors.emailInUse);
        done();
      });
    });
  });

  describe("Find a User by Username",function(){
    it("Finds a User from Username", function(done){
      user_model.findByUsername("testUsername1", function(res){
        expect(res.id).is.equal(1);
        expect(res.name).is.equal("testUsername1");
        expect(res.email).is.equal("test@test.com");
        expect(res).to.property("passhash");
        expect(res).to.property("createdOn");
        done();
      });
    });
    it("Returns Error on Unregistered User", function(done){
      user_model.findByUsername("testUsername2", function(res){
        expect(res).is.equal(user_model.errors.userNotFound);
        done();
      });
    });
  });
  
  describe("Find a User by Id",function(){
    it("Finds a User from Id", function(done){
      user_model.findById(1, function(res){
        expect(res.id).is.equal(1);
        expect(res.name).is.equal("testUsername1");
        expect(res.email).is.equal("test@test.com");
        expect(res).to.property("passhash");
        expect(res).to.property("createdOn");
        done();
      });
    });
    it("Returns Error on Unregistered User", function(done){
      user_model.findById(2, function(res){
        expect(res).is.equal(user_model.errors.userNotFound);
        done();
      });
    });
  });
});
