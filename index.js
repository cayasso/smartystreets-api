//module.exports = 
var SmartyStreets = module.exports = require('./lib');

var ss = SmartyStreets('ae47df51-22b0-4b01-a4ce-5afcc02e271d', 'xppWifo53BnFQzgEhgXw');

/*ss.suggest({ prefix: '123 main', state_filter: 'ME', cityFilter: 'Abbot' }, function (err, data) {
  console.log(err, data);
});*/

ss.zipcode(
  [{
    'city':'cupertino',
    'state':'CA'
  },{
    'input_id':'228',
    'city':'cupertino',
    'state':'CA',
    'zipcode':'90210'
  }], function (err, data, raw) {
  console.log(JSON.stringify(data, null, 2));
  console.log(raw);
});