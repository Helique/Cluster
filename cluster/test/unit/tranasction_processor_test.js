var expect = require("chai").expect;
var transactionProcessor = require("../../helpers/transaction_processor");
var fs = require("fs");

describe("Transaction Processor", function() {
  describe("#parseQFX", function() {
    it("parses a qfx file from Mechanics Bank", function(done) {
      var xml_data = fs.readFileSync("./test/fixtures/Mechanics.qfx");
      transactionProcessor.parseQFX(xml_data, function(err, result) {
        try {
          expect(err).to.not.exist;
          expect(result).to.have.property("bank_id", 121102036);
          expect(result).to.have.property("account_id", 1527);
          expect(result).to.have.property("account_type", "CHECKING");
          expect(result).to.have.property("transactions");
          var transactions = result.transactions;
          expect(transactions[0]).to.eql(
            {
              TRNTYPE: [ 'CASH' ],
              DTPOSTED: [ '20161026000000[-8:PST]' ],
              TRNAMT: [ '-1000.00' ],
              FITID: [ 'aDFS[-8:PST]*-1000.00*0**JPMorgan Chase Ext Trnsfr 5750572727' ],
              NAME: [ 'JPMorgan Chase Ext Trnsfr 575057' ]
            }
          );
          done();
        }
        catch(e) { done(e); }
      });
    });

    it("parses a qfx file from Chase Bank", function(done) {
      var xml_data = fs.readFileSync("./test/fixtures/Chase.qfx");
      transactionProcessor.parseQFX(xml_data, function(err, result) {
        try {
          expect(err).to.not.exist;
          expect(result).to.have.property("bank_id", 322271627);
          expect(result).to.have.property("account_id", 891936770);
          expect(result).to.have.property("account_type", "CHECKING");
          expect(result).to.have.property("transactions");
          var transactions = result.transactions;
          expect(transactions[0]).to.eql(
            {
              TRNTYPE: [ 'DEBIT' ],
              DTPOSTED: [ '20161117120000[0:GMT]'],
              TRNAMT: [ '-107.95' ],
              FITID: [ '201611170' ],
              NAME: [ 'MOVEMENT BOARDSHOP GOLETA CA' ],
              MEMO: ["11/15"]
            }
          );
          done();
        }
        catch(e) { done(e); }
      });
    });
  });
});
