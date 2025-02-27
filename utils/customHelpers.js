const Handlebars = require('handlebars');

Handlebars.registerHelper('JSONStringify', function (object) {
  return JSON.stringify(object);
});

Handlebars.registerHelper('compareStringValue', function (value1, value2, options) {
  if(value1 == value2){
    return options.fn(this);
  }
  return options.inverse(this);
});

module.exports = Handlebars;