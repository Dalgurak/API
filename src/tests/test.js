var supertest = require("supertest");
var should = require("should");

var server = supertest.agent("http://localhost:3006");

describe("Restful API unit test starts",function(){

    it("should return 200",function(done){
        server
        .get("/v1/foodtruck/")
        .expect(200)
        .end(function(err,res){
            res.status.should.equal(200);
            done();
        });
    });

    it("should return 404",function(done){
        server
        .get("/random")
        .expect(404)
        .end(function(err,res){
            res.status.should.equal(404);
            done();
        });
    });
});