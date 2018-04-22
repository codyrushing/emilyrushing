const handlebars = require('handlebars');
const helpers = require('handlebars-helpers')({
  handlebars: handlebars
});

module.exports = {
  ...helpers,
  // add more helpers here if needed
  spanWords: function(context=''){
    return context.split(' ')
    .map(
      word => `<span>${word}</span>`
    )
    .join(' ');
  }
}
