/**
 * @flow strict
 * @format
 */

'use strict';

const diff = require('./diff');
const addedDiff = require('./added');
const deletedDiff = require('./deleted');
const updatedDiff = require('./updated');
const detailedDiff = require('./detailed');

module.exports = {
  diff,
  addedDiff,
  deletedDiff,
  updatedDiff,
  detailedDiff,
};

