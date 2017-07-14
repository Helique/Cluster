var account_model = require("../../models/bank_accounts");
var user_model = require("../../models/users");
var bank_model = require("../../models/banks");
var expect = require("chai").expect;

user = {name: "accountTest", password:"what the heck?", email:"account@test.com"}
user2 = {name: "accountTest2", password:"what the heck?2", email:"account@test.com2"}
fakeUser = {id: 49, name: "accountTestFake", password:"fake", email:"account@fake.com"}
bankInfo = {id: 97878, name: "Sierra Central"}
unsuportedBankInfo = {id: 95333, name: "FakeBank"}
testBankAccount = {id: 19504}
testBankAccount2 = {id: 19503}

describe("Account Model", function(){
  before(function(done) {
    user_model.newUser("accountTest","what the heck?","account@test.com", (res)=>{
      user.id = res.id;
      done();
    });
  });
  before(function(done) {
    user_model.newUser("accountTest2","what the heck?2","account@test.com2", (res)=>{
      user2.id = res.id;
      done();
    });
  });
  before(function(done) {
    bank_model.newBank(bankInfo.id, bankInfo.name, (res)=>{
      done();
    });
  });
  describe("add", function(){
    it("Creates a new Account for a User", function(done){
      account_model.add(user, bankInfo, testBankAccount.id, (res)=>{
        expect(res.id).is.equal(19504);
        done();
      });
    });
    it("Returns Error on Unsuported Bank", function(done){
      account_model.add(user, unsuportedBankInfo, testBankAccount.id, (res)=>{
        expect(res).is.equal(account_model.errors.bankUnsupported);
        done();
      });
    });
    it("Returns Error on non-existant User", function(done){
      account_model.add(fakeUser, bankInfo, testBankAccount2.id, (res)=>{
        expect(res).is.equal(account_model.errors.userNotFound);
        done();
      });
    });
    it("Returns Error on Duplicate AccountID", function(done){
      account_model.add(user2, bankInfo, testBankAccount.id, function(res){
        expect(res).is.equal(account_model.errors.accountInUse);
        done();
      });
    });
  });
  describe("getAll", function(){
    before(function(done){
      bank_model.newBank(bankInfo.id, bankInfo.name, (res)=>{
        account_model.add(user, bankInfo, testBankAccount2.id, (res)=>{
          expect(res.id).is.equal(19503);
          done();
        });
      });
    });
    it("Gets all accounts for a User", function(done){
      account_model.getAll(user, (res)=>{
        expect(res.length).is.equal(2);
        done();
      });
    });
    it("Returns nothing on non-existant User", function(done){
      account_model.getAll(fakeUser, (res)=>{
        expect(res.length).is.equal(0);
        done();
      });
    });
  });
});
