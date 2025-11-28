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

function addedDiff(lhs: mixed, rhs: mixed): mixed {
  if (lhs === rhs || !isObject(lhs) || !isObject(rhs)) return {};

  // $FlowFixMe[prop-missing]
  return Object.keys(rhs).reduce((acc, key) => {
    if (hasOwnProperty(lhs, key)) {
      // $FlowFixMe[prop-missing]
      const difference = addedDiff(lhs[key], rhs[key]);

      if (isObject(difference) && isEmpty(difference)) return acc;

      acc[key] = difference;
      return acc;
    }

    // $FlowFixMe[prop-missing]
    acc[key] = rhs[key];
    return acc;
  }, makeObjectWithoutPrototype());
}

module.exports = addedDiff;

