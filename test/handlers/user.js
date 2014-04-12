'use strict';

require('should');
var request = require('supertest');
var app = require('../../app.js');

describe("GET /users", function() {
  it("should return good values", function(done) {
    request(app)
      .get("/users")
      .expect(200)
      .expect(function(res) {
        res.body.should.eql("Hugo,");
      })
      .end(done);
  });
});