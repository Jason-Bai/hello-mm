const _ = require('lodash');
const home = require('./home');
const session = require('./session');
const user = require('./user');
const imonline = require('./imonline');

module.exports = _.flatten([
  home,
  session,
  user,
  imonline,
]);
