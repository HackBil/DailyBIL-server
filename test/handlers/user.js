'use strict';

require('should');
var request = require('supertest');
var async = require('async');
var mongoose = require('mongoose');
var app = require('../../app.js');

describe("GET /users", function() {
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

  before(function createCategory(done){
    request(app)
      .post("/news")
      .send({token: process.env.MASTER_TOKEN, url: "blague.fr", title:"fortran", categories: "supérieur,ruby", user: "Jean Blagun"})
      .expect(202)
      .end(done);
  });

  it("should return good values", function(done) {
    request(app)
      .get("/users")
      .expect(200)
      .expect(function(res) {
        res.body.should.eql("Jean Blagun,");
      })
      .end(done);
  });
});