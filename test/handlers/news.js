'use strict';

require('should');
var request = require('supertest');
var async = require('async');
var mongoose = require('mongoose');
var app = require('../../app.js');

describe("POST /news", function() {
  var News = mongoose.model('News');
  var Category = mongoose.model('Category');
  before(function(done) {
    async.parallel([
      function clearNews(cb){
        News.remove({}, cb);
      },
      function clearCategory(cb){
        Category.remove({}, cb);
      },
    ], done);
  });

  it("should refuse connexion without all parameters", function(done) {
    request(app)
      .post("/news")
      .send({token: process.env.MASTER_TOKEN, url: "haha"})
      .expect(409)
      .end(done);
  });

  it("should refuse connexion without a valid token", function(done) {
    request(app)
      .post("/news")
      .send({token: "0", url: "haha", title:"osef", categories: ["tata"]})
      .expect(409)
      .end(done);
  });

  it("should create a category if does not exists", function(done) {
    async.waterfall([
      function sendRequest(cb) {
        request(app)
          .post("/news")
          .send({token: process.env.MASTER_TOKEN, url: "haha", title:"osef", categories: "tata,lol", user: "Hugo"})
          .expect(202)
          .end(cb);
      },
      function checkDB(res, cb) {
        Category.find({name: "tata"}, function(err, category){
          category.should.containDeep([{"name": "tata"}]);
          cb();
        });
      }
    ], done);
  });

  it("should store the tweet", function(done) {
    async.waterfall([
      function sendRequest(cb) {
        request(app)
          .post("/news")
          .send({token: process.env.MASTER_TOKEN, url: "haha", title:"osef", categories: "tata,lol", user: "Hugo"})
          .expect(202)
          .end(cb);
      },
      function checkDB(res, cb) {
        News.findOne({categories: "tata"}, function(err, news){
          news.should.have.property("categories");
          news.categories.toString().should.be.eql(['tata', 'lol'].toString());
          news.should.have.property("title", "osef");
          news.should.have.property("url", "haha");
          cb();
        });
      }
    ], done);
  });
});

describe("get /news", function() {
  it("should return news", function(done) {
    request(app)
      .get("/news")
      .expect(200)
      .expect(function(res){
        res.body.should.containDeep([{"user": "Hugo"}]);
        res.body.should.containDeep([{"title": "osef"}]);
        res.body.should.containDeep([{"url": "haha"}]);
        res.body.should.containDeep([{"categories": [ 'tata', 'lol' ]}]);
      })
      .end(done);
  });
});