'use strict';

require('should');

var formatNews = require("../lib/tweet/tweet").formatNews;

describe("formatNews", function() {
  it("should return a small news formatted as tweet", function(done) {
    var news = {
      categories: ["bil", "hashtag"],
      user: "Amoki",
      title: "Le mec qui developpe ça est vraiment bon",
      url: "t.co/123456789101112131"
    };

    var after = formatNews(news);
    after.should.be.eql("Le mec qui developpe ça est vraiment bon t.co/123456789101112131 #bil #hashtag via @Amoki");
    after.length.should.be.below(140);
    done();
  });

  it("should return a big news formatted as tweet", function(done) {
    var news = {
      categories: ["bil", "hashtag", "sousous", "startup", "stagiaires"],
      user: "Amoki",
      title: "Le mec qui developpe ça est vraiment bon et est entouré de mecs méga bons qui lui filent plein de sous",
      url: "t.co/123456789101112131"
    };

    var after = formatNews(news);
    after.should.be.eql("Le mec qui developpe ça est vraiment bon et est entouré de me t.co/123456789101112131 #bil #hashtag #sousous #startup #stagiaires via @Amoki");
    after.length.should.be.eql("140");
    done();
  });
});