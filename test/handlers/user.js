'use strict';

require('should');
var request = require('supertest');

describe("POST /user", function() {
  it("should refuse connexion without all parameters", function(done) {
    request("http://localhost:8000")
      .post("/user")
      .send({})
      .expect(409)
      .end(done);
  });

  it("should return 202", function(done) {
    request("http://localhost:8000")
      .post("/user")
      .send({name: "lol"})
      .expect(202)
      .expect(function(res) {
        res.shoud.have.property("token");
      })
      .end(done);
  });

});