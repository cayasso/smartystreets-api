# smartystreets-api

[![Build Status](https://travis-ci.org/cayasso/smartystreets-api.png?branch=master)](https://travis-ci.org/cayasso/smartystreets-api)
[![NPM version](https://badge.fury.io/js/smartystreets-api.png)](http://badge.fury.io/js/smartystreets-api)

Simple [SmartyStreets](https://smartystreets.com/) API wrapper.

## Installation

``` bash
$ npm install smartystreets-api
```

## Usage

``` javascript
var SmartyStreets = require('smartystreets-api');
var smartyStreets = SmartyStreets(AUTH_ID, AUTH_TOKEN, [options]);

var address = '440 Park Ave S, New York, NY, United States';

smartyStreets.address(address, function (err, data, raw) {
  if (err) return console.error(err);
  console.log(data);
});

// err => Error object
// data => formated return data
// raw => unformated raw data from SmartyStreets
```

## API

### SmartyStreets(authId, authToken, [options])

`authId` and `authToken` are required.

Options are:

* `host`: Api host.
* `proxy`: Proxy address.

### address(data, fn)

Verify one or more addresses using the SmartyStreets API.

Pass the address as a string:

```javascript
var address = '440 Park Ave S, New York, NY, United States';
smartyStreets.address(address, function (err, data) {
  console.log(data);

  /*
  [ { inputId: '0gwwfk8a',
    inputIndex: 0,
    candidateIndex: 0,
    deliveryLine1: '440 Park Ave S',
    lastLine: 'New York NY 10016-8012',
    deliveryPointBarcode: '100168012993',
    components:
     { primaryNumber: '440',
       streetName: 'Park',
       streetPostdirection: 'S',
       streetSuffix: 'Ave',
       cityName: 'New York',
       stateAbbreviation: 'NY',
       zipcode: '10016',
       plus4Code: '8012',
       deliveryPoint: '99',
       deliveryPointCheckDigit: '3' },
    metadata:
     { recordType: 'H',
       zipType: 'Standard',
       countyFips: '36061',
       countyName: 'New York',
       carrierRoute: 'C035',
       congressionalDistrict: '12',
       buildingDefaultIndicator: 'Y',
       rdi: 'Commercial',
       elotSequence: '0006',
       elotSort: 'A',
       latitude: 40.74459,
       longitude: -73.98326,
       precision: 'Zip9',
       timeZone: 'Eastern',
       utcOffset: -5,
       dst: true },
    analysis:
     { dpvMatchCode: 'D',
       dpvFootnotes: 'AAN1',
       dpvCmra: 'N',
       dpvVacant: 'N',
       active: 'Y',
       footnotes: 'H#' } } ]
   */
});
```
or you can pass the address as an object:

```javascript
var address = {
  input_id: 'abc',
  street: '440 Park Ave S',
  city: 'New York',
  state: 'NY'
};

smartyStreets.address(address, function (err, data) {
  console.log(data);
});
```

For multi address support just pass an array of address strings or objects:

```javascript
var addresses = [
  '440 Park Ave S, New York, NY, United States',
  '1 infinite loop, cupertino, CA, United States'
];

smartyStreets.address(addresses, function (err, data) {
  console.log(data);
});
```

or: 

```javascript
var addresses = [
  {
    "street":"1 Santa Claus",
    "city":"North Pole",
    "state":"AK",
    "candidates":10
  },
  {
    "addressee":"Apple Inc",
    "street":"1 infinite loop",
    "city":"cupertino",
    "state":"CA",
    "zipcode":"95014",
    "candidates":10
  }
];

smartyStreets.address(addresses, function (err, data) {
  console.log(data);
});
```
### zipcode(data, fn)

Look up and verify city, state, and ZIP Code combinations.

```javascript
var address = {
  "city":"cupertino",
  "state":"CA"
};

smartyStreets.zipcode(address, function (err, data) {
  
  console.log(data);

  /*
  [
    {
      "input_index": 0,
      "city_states": [
        {
          "city": "Cupertino",
          "state_abbreviation": "CA",
          "state": "California",
          "default_city": true,
          "mailable_city": true
        }
      ],
      "zipcodes": [
        {
          "zipcode": "95014",
          "zipcode_type": "S",
          "county_fips": "06085",
          "county_name": "Santa Clara",
          "latitude": 37.32056,
          "longitude": -122.03866
        },
        {
          "zipcode": "95015",
          "zipcode_type": "P",
          "county_fips": "06085",
          "county_name": "Santa Clara",
          "latitude": 37.32292,
          "longitude": -122.05415
        }
      ]
    }
  ]
   */
});
```

```javascript
var addresses = [{
  'city':'cupertino',
  'state':'CA'
},{
  'input_id':'228',
  'city':'cupertino',
  'state':'CA',
  'zipcode':'90210'
}];

smartyStreets.zipcode(addresses, function (err, data) {
  console.log(data);
});
```

### suggest(data, fn)

Call autocomplete SmartStreets API.

Pass prefix as string:

```javascript
smartyStreets.suggest('123 Mai', function (err, data) {
  
  console.log(data);

  /*
    [ { text: '123 Main Rd, Abbot ME',
    streetLine: '123 Main Rd',
    city: 'Abbot',
    state: 'ME' },
    ...
    ...
    } ]
  */
});
```
Or pass prefix as object with options:

```javascript
smartyStreets.suggest({
  prefix: '123 Mai',
  cityFilter: 'Abbot',
  stateFilter: 'ME'
}, function (err, data) {
  
  console.log(data);

  /*
    [ { text: '123 Main Rd, Abbot ME',
    streetLine: '123 Main Rd',
    city: 'Abbot',
    state: 'ME' } ]
  */
});
```

## Run tests

``` bash
$ npm install
$ make test
```

## License

(The MIT License)

Copyright (c) 2015 Jonathan Brumley &lt;cayasso@gmail.com&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
