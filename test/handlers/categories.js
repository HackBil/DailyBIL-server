'use strict';

require('should');
var request = require('supertest');
var async = require('async');
var app = require('../../app.js');

describe("get /categories", function() {

  before(function createCategory(done){
    request(app)
      .post("/news")
      .send({token: process.env.MASTER_TOKEN, url: "trouve.fr", title:"à", categories: "#manger,#tousseul", user: "Africain"})
      .expect(202)
      .end(done);
  });

  it("should return categories", function(done) {
    request(app)
      .get("/categories")
      .expect(200)
      .expect(function(res){
        console.log(res.body);
        // res.body.should.containDeep([{"user": "Hugo"}]);
        // res.body.should.containDeep([{"title": "osef"}]);
        // res.body.should.containDeep([{"url": "haha"}]);
        // res.body.should.containDeep([{"categories": [ '#tata', '#lol' ]}]);
      })
      .end(done);
  });
});