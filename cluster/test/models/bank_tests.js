var bank_model = require("../../models/banks");
var expect = require("chai").expect

testBank1 = {id: 95959, name: "FakeBank#1"}
testBank2 = {id: 65656, name: "FakeBank#2"}

describe("Bank Model", function(){
  describe("Create new Bank", function(){
    it("Creates a new Bank", function(done){
      bank_model.newBank(testBank1.id, testBank1.name, (res)=>{
        expect(res.id).is.equal(95959);
        done();
      });
    });
    it("Returns Error on Duplicate BankID", function(done){
      bank_model.newBank(testBank1.id, testBank2.name, function(res){
        expect(res).is.equal(bank_model.errors.idInUse);
        done();
      });
    });
    it("Returns Error on Duplicate Name", function(done){
      bank_model.newBank(testBank2.id, testBank1.name, function(res){
        expect(res).is.equal(bank_model.errors.nameInUse);
        done();
      });
    });
  });
  describe("Gets a Bank from ID", function(){
    it("Gets a Bank from ID", function(done){
      bank_model.getByID(testBank1.id, function(res){
        expect(res).is.deep.equal(testBank1);
        done();
      });

    });
    it("Returns Error on Invalid BankID", function(done){
      bank_model.getByID(testBank2.id, function(res){
        expect(res).is.equal(bank_model.errors.bankNotFound);
        done();
      });

    });
  });
  describe("Gets a Bank from Name", function(){
    it("Gets a Bank from Name", function(done){
      bank_model.getByName(testBank1.name, function(res){
        expect(res).is.deep.equal(testBank1);
        done();
      });

    });
    it("Returns Error on Invalid BankName", function(done){
      bank_model.getByName(testBank2.name, function(res){
        expect(res).is.equal(bank_model.errors.bankNotFound);
        done();
      });

    });
  });
});
