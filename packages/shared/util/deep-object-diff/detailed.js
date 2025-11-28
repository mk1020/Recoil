/**
 * @flow strict
 * @format
 */

'use strict';

const addedDiff = require('./added');
const deletedDiff = require('./deleted');
const updatedDiff = require('./updated');

function detailedDiff(lhs: mixed, rhs: mixed): {
  added: mixed,
  deleted: mixed,
  updated: mixed,
} {
  return {
    added: addedDiff(lhs, rhs),
    deleted: deletedDiff(lhs, rhs),
    updated: updatedDiff(lhs, rhs),
  };
}

module.exports = detailedDiff;

