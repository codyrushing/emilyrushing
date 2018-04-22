const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

var config;
try {
  config = yaml.safeLoad(
    fs.readFileSync(
      path.resolve( __dirname, '../config.yaml'),
      'utf8'
    )
  );
} catch(err) {
  console.error(`Error loading config - ${err.message}`);
  process.exit(1);
}

module.exports = config;
