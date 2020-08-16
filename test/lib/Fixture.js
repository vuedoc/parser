const { join } = require('path');
const { readFileSync } = require('fs');

module.exports.Fixture = {
  resolve (filename) {
    return join(__dirname, `../fixtures/${filename}`);
  },
  get (filename) {
    return readFileSync(this.resolve(filename), 'utf8').toString();
  }
};
