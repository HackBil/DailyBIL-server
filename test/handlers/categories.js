'use strict';

require('should');
var request = require('supertest');
var async = require('async');
var mongoose = require('mongoose');
var app = require('../../app.js');

describe("get /categories", function() {
  var News = mongoose.model('News');
  var Category = mongoose.model('Category');
  var User = mongoose.model('User');
  before(function(done) {
    async.parallel([
      function clearNews(cb){
        News.remove({}, cb);
      },
      function clearCategory(cb){
        Category.remove({}, cb);
      },
      function clearUser(cb){
        User.remove({}, cb);
      }
    ], done);
  });

  it("should return categories", function(done) {
    async.waterfall([
      function createCategories(cb){
        request(app)
          .post("/news")
          .send({token: process.env.MASTER_TOKEN, url: "trouve.fr", title:"à", categories: "manger,tousseul", user: "Africain"})
          .expect(202)
          .end(cb);
      },
      function checkCategories(res, cb) {
        request(app)
          .get("/categories")
          .expect(200)
          .expect(function(res){
            res.body.should.eql("manger,tousseul,");
          })
          .end(cb);
      }
    ], done);
  });
});