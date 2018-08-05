var account_model = require("../../models/bank_accounts");
var user_model = require("../../models/users");
var bank_model = require("../../models/banks");
var transaction_model = require("../../models/charges");
var expect = require("chai").expect;

var user = {name: "transactionTest", password:"what the heck?", email:"transaction@test.com"}
var user2 = {name: "transactionTest2", password:"what the heck2?", email:"transaction@test2.com"}
var fakeUser = {id: 49, name: "transactionTestFake", password:"fake", email:"transaction@fake.com"}
var testBankAccount = {id: 12505}
var bankInfo = {id: 22222, name: "Sierra Central"}

// testTransaction = {
//   user_id: -1,
//   bank_id: bankInfo.id,
//   account_id: testBankAccount.id,
//   account_type: "CHECKING",
//   description: "A Test Charge Description",
//   charge: 13.99,
//   memo: "CA @ Nevada City A Test Charge Memo",
//   fitid:298617081,
//   category_id:-1,
//   date:"1995-19-12",
//   acc_balance: 600.70
// };
testTransaction = [
  -1,
  bankInfo.id,
  testBankAccount.id,
  "CHECKING",
  "A Test Charge Description",
  13.99,
  "CA @ Nevada City A Test Charge Memo",
  298617081,
  -1,
  "1995-12-30",
  600.70
];

testTransaction2 = [
  -1,
  bankInfo.id,
  testBankAccount.id,
  "CHECKING",
  "A Test Charge Description",
  13.99,
  "CA @ Nevada City A Test Charge Memo",
  298617082,
  -1,
  "1995-12-19",
  600.70
];
// var trans = transactions[trans];
// //var fitid = parseInt(trans.FITID[0].replace("_", ""));
// var fitid = trans.FITID[0];
// var trnamt = parseFloat(trans.TRNAMT[0]);
// var date = trans.DTPOSTED[0].substr(0, 8);
//     date = date.slice(0, 4) + "-" + date.slice(4, 6) + "-" + date.slice(6, 8);
// var memo = _.get(trans, "NAME[0]") || _.get(trans, "MEMO[0]");
// var acc_bal = parseFloat(_.get(trans, "USERS.STMT[0].TRNBAL[0]", "0"));
//
// var data = [user_id, bank_id, account_id, account_type, memo, trnamt, memo, fitid, 0, date, acc_bal];

describe("Transaction Model", function(){
  before(function(done) {
    user_model.newUser(user.name, user.password, user.email, (res)=>{
      testTransaction.user_id = res.id;
      user.id = res.id;
      done();
    });
  });
  before(function(done) {
    user_model.newUser(user2.name, user2.password, user2.email, (res)=>{
      user2.id = res.id;
      done();
    });
  });
  before(function(done) {
    bank_model.newBank(bankInfo.id, bankInfo.name, (res)=>{
      done();
    });
  });
  before(function(done) {
    account_model.add(user, bankInfo, testBankAccount.id, (res)=>{
      done();
    });
  });
  describe("createTransaction", function(){
    it("Creates a transaction for a User", function(done){
      testTransaction[0] = user.id;
      transaction_model.createTransaction(testTransaction, function(res1, res2){
        expect(res2.insertId).is.equal(1);
        done();
      });
    });
  });
  // describe("createTransaction", function(){
  //   it("Creates a transaction for a User", function(done){
  //
  //   });
  // });
  describe("getRange", function(){
    it("Gets all transations during a certain time period", function(done){
      testTransaction2[0] = user.id;
      transaction_model.createTransaction(testTransaction2, function(res1, res2){
          transaction_model.getRange(user, new Date('December 17, 1995 00:00:00'), new Date('December 20, 1995 23:59:59'), function (res){
          expect(res[0].id).is.equal(2);
          done();
        });
      });
    })
  });
});
