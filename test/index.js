'use strict';

var url = require('url');
var nock = require('nock');
var should = require('should');
var SmartyStreets = require('../');
var AUTH_ID = '123abc';
var AUTH_TOKEN = 'abc123';

describe('smartystreets-api', function () {

  it('should expose a constructor', function () {
    SmartyStreets.should.be.a.Function;
  });

  it('should throw error if auth id is missing', function () {
    (function(){
      SmartyStreets(null);
    }).should.throw(/pass your SmartyStreets Auth ID/);
  });

  it('should throw error if auth token is missing', function () {
    (function(){
      SmartyStreets('abc', null);
    }).should.throw(/pass your SmartyStreets Auth Token/);
  });

  it('should set auth credentials', function () {
    SmartyStreets('abc', 'def123')
    .auth.should.have.properties('auth-id', 'auth-token');
  });

  it('should allow passing options', function () {
    var smarty = SmartyStreets('abc', 'def123', { 
      host: 'https://test.com',
      proxy: 'http://localhost:9001'
    });
    smarty.host.should.be.eql('https://test.com');
    smarty.proxy.should.be.eql('http://localhost:9001');
  });

  describe('#address', function () {

    var query = null;
    var body = null;

    beforeEach(function () {
      
      nock('https://api.smartystreets.com')
        .get('/street-address')
        .query(true)
        .reply(200, function (uri, req) {
          query = url.parse(uri, true).query;
          return {};
        });

      nock('https://api.smartystreets.com')
        .filteringRequestBody(/.*/, '*')
          .post('/street-address', '*')
          .query(true)
          .reply(200, function (uri, data) {
            body = JSON.parse(data);
            return [];
          });
    });

    it('should call GET on string input', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = {
        street: '440 Park Ave S',
        city: 'New York',
        state: 'NY'
      };
      smarty.address('440 Park Ave S, New York, NY, United States', function (err) {
        if (err) return done(err);
        query.should.have.properties(obj);
        done();
      });
    });

    it('should call POST on array of strings input', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = {
        street: '440 Park Ave S',
        city: 'New York',
        state: 'NY'
      };
      smarty.address(['440 Park Ave S, New York, NY, United States'], function (err) {
        if (err) return done(err);
        body[0].should.have.properties(obj);
        done();
      });
    });

    it('should call GET on singgle object input', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = {
        input_id: 'abc',
        street: '440 Park Ave S',
        city: 'New York',
        state: 'NY'
      };
      smarty.address(obj, function (err) {
        if (err) return done(err);
        query.should.have.properties(obj);
        done();
      });
    });

    it('should call POST on array input', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = [{
        input_id: 'abc',
        street: '440 Park Ave S',
        city: 'New York',
        state: 'NY'
      }];
      smarty.address(obj, function (err) {
        if (err) return done(err);
        body[0].should.have.properties(obj[0]);
        done();
      });
    });

  });


  describe('#zipcode', function () {

    var query = null;

    before(function () {
      nock('https://api.smartystreets.com')
        .get('/zipcode')
        .query(true)
        .reply(200, function (uri, req) {
          query = url.parse(uri, true).query;
          return {};
        });
    });

    it('should call GET on input', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = {
        input_id: 'abc',
        city: 'Los Angeles',
        state: 'CA',
        zipcode: '90023'
      };
      smarty.zipcode(obj, function (err) {
        if (err) return done(err);
        query.should.have.properties(obj);
        done();
      });
    });

  });

  describe('#suggest', function () {

    var query = null;

    beforeEach(function () {
      nock('https://api.smartystreets.com')
        .get('/suggest')
        .query(true)
        .reply(200, function (uri, req) {
          query = url.parse(uri, true).query;
          return {};
        });
    });

    it('should call GET with prefix params when passed string', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      smarty.suggest('440 Park', function (err) {
        if (err) return done(err);
        query.should.have.properties({ prefix: '440 Park' });
        done();
      });
    });

    it('should call GET with prefix params when passed string', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      smarty.suggest('440 Park', function (err) {
        if (err) return done(err);
        query.should.have.properties({ prefix: '440 Park' });
        done();
      });
    });

    it('should accept camel case inputs', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = { 
        prefix: '440 Park', 
        cityFilter: 'Chicago, New York'
      };
      smarty.suggest(obj, function (err) {
        if (err) return done(err);
        query.should.have.properties({ city_filter: 'Chicago, New York' });
        done();
      });
    });

    it('should accept snake case inputs', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = { 
        prefix: '440 Park', 
        city_filter: 'Chicago, New York'
      };
      smarty.suggest(obj, function (err) {
        if (err) return done(err);
        query.should.have.properties(obj);
        done();
      });
    });

    it('should return error if prefix is invalid', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = { 
        prefix: '440 Park', 
        city_filter: 'Chicago, New York'
      };
      smarty.suggest(null, function (err) {
        err.message.should.be.eql('Prefix is required.');
        done();
      });
    });

    it('should return error if prefix is missing or undefined', function (done) {
      var smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      var obj = { 
        prefix: undefined, 
        city_filter: 'Chicago, New York'
      };
      smarty.suggest(obj, function (err) {
        err.message.should.be.eql('Prefix is required.');
        done();
      });
    });

  });

});