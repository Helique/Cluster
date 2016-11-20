var request = require('supertest');
var expect = require("chai").expect;

describe('categories', function(){
  var url = 'http://127.0.0.1:8000';
  it('should return something', function(done){

    var new_category  = {
      category_name: "Groceries"
    };

    request(url)
    .post('/api/1.0/category')
    .send(new_category)
    .end(function(err,res){
        if(err) {
            throw err;
        }
        expect(res.status).to.eql(200);
        done();
    });
  });
});
