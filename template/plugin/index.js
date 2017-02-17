'use strict';

const help = require('./lib/help');
const go = require('./lib/go');

module.exports = {
  help,
  go,
  default: help
};
