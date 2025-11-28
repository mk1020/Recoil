/**
 * @flow strict
 * @format
 */

'use strict';

const {
  isEmpty,
  isObject,
  hasOwnProperty,
  makeObjectWithoutPrototype,
} = require('./utils');

function deletedDiff(lhs: mixed, rhs: mixed): mixed {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  // $FlowFixMe[prop-missing]
  return Object.keys(lhs).reduce((acc, key) => {
    if (hasOwnProperty(rhs, key)) {
      // $FlowFixMe[prop-missing]
      const difference = deletedDiff(lhs[key], rhs[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      acc[key] = difference;
      return acc;
    }

    acc[key] = undefined;
    return acc;
  }, makeObjectWithoutPrototype());
}

module.exports = deletedDiff;

