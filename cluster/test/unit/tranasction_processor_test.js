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
          console.log(result);
          done();
        }
        catch(e) { done(e); }
      });
    });
  });
});
