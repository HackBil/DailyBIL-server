'use strict';

require('should');
var request = require('supertest');

describe("GET /users", function() {
  it("should return good values", function(done) {
    request("http://localhost:8000")
      .get("/users")
      .expect(200)
      .expect(function(res) {
        res.body.shoud.eql("Hugo,");
      })
      .end(done);
  });
});