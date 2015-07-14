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

    var smarty = null;
    var query = null;
    var body = null;

    beforeEach(function () {

      smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      
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
      var arr = [{
        input_id: 'abc',
        street: '440 Park Ave S',
        city: 'New York',
        state: 'NY'
      }];
      smarty.address(arr, function (err) {
        if (err) return done(err);
        body[0].should.have.properties(arr[0]);
        done();
      });
    });

  });


  describe('#zipcode', function () {

    var smarty = null;
    var query = null;
    var body = null;

    beforeEach(function () {
      smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);

      nock('https://api.smartystreets.com')
        .get('/zipcode')
        .query(true)
        .reply(200, function (uri, req) {
          query = url.parse(uri, true).query;
          return {};
        });

      nock('https://api.smartystreets.com')
        .filteringRequestBody(/.*/, '*')
          .post('/zipcode', '*')
          .query(true)
          .reply(200, function (uri, data) {
            body = JSON.parse(data);
            return [];
          });
    });

    it('should call GET on input', function (done) {
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

    it('should call POST on array input', function (done) {
      var arr = [{
        input_id: 'abc',
        city: 'Los Angeles',
        state: 'CA',
        zipcode: '90023'
      }];
      smarty.zipcode(arr, function (err) {
        if (err) return done(err);
        body[0].should.have.properties(arr[0]);
        done();
      });
    });

  });

  describe('#suggest', function () {

    var query = null;
    var smarty = null;

    beforeEach(function () {
      smarty = SmartyStreets(AUTH_ID, AUTH_TOKEN);
      nock('https://autocomplete-api.smartystreets.com')
        .get('/suggest')
        .query(true)
        .reply(200, function (uri, req) {
          query = url.parse(uri, true).query;
          return {};
        });
    });

    it('should call GET with prefix params when passed string', function (done) {
      smarty.suggest('440 Park', function (err) {
        if (err) return done(err);
        query.should.have.properties({ prefix: '440 Park' });
        done();
      });
    });

    it('should call GET with prefix params when passed string', function (done) {
      smarty.suggest('440 Park', function (err) {
        if (err) return done(err);
        query.should.have.properties({ prefix: '440 Park' });
        done();
      });
    });

    it('should accept camel case inputs', function (done) {
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

    it('should return error if prefix is invalid', function () {
      (function(){
        smarty.suggest(null);
      }).should.throw(/pass a valid prefix object or string/);
    });

    it('should return error if prefix is missing or undefined', function () {
      (function(){
        smarty.suggest({});
      }).should.throw(/pass a valid prefix object or string/);
    });

  });

});