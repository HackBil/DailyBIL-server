'use strict';

require('should');
var request = require('supertest');
var async = require('async');
var mongoose = require('mongoose');

var News = mongoose.model('News');
var Category = mongoose.model('Category');

describe("POST /news", function() {
  it("should refuse connexion without all parameters", function(done) {
    request("http://localhost:8000")
      .post("/news")
      .send({token: "0", url: "haha"})
      .expect(409)
      .end(done);
  });

  it("should refuse connexion without a valid token", function(done) {
    request("http://localhost:8000")
      .post("/news")
      .send({token: "0", url: "haha", title:"osef", categories: ["#tata"]})
      .expect(409)
      .end(done);
  });

  it("should create a category if does not exists", function(done) {
    async.waterfall([
      function sendRequest(cb) {
        request("http://localhost:8000")
          .post("/news")
          .send({token: "123456789", url: "haha", title:"osef", categories: ["#tata"]})
          .expect(202)
          .end(cb);
      },
      function checkDB(cb) {
        Category.find({name: "#tata"}, function(err, category){
          category.should.have.property("name", "#tata");
          cb();
        });
      }
    ], done);
  });

  it("should store the tweet", function(done) {
    async.waterfall([
      function sendRequest(cb) {
        request("http://localhost:8000")
          .post("/news")
          .send({token: "123456789", url: "haha", title:"osef", categories: ["#tata"]})
          .expect(202)
          .end(cb);
      },
      function checkDB(cb) {
        News.find({name: "#tata"}, function(err, category){
          category.should.have.property("name", "#tata");
          category.should.have.property("tile", "oser");
          category.should.have.property("url", "haha");
          cb();
        });
      }
    ], done);
  });
});