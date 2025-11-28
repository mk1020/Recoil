/**
 * @flow strict
 * @format
 */

'use strict';

const {
  isDate,
  isEmptyObject,
  isObject,
  hasOwnProperty,
  makeObjectWithoutPrototype,
} = require('./utils');

function updatedDiff(lhs: mixed, rhs: mixed): mixed {
  if (lhs === rhs) return {};

  if (!isObject(lhs) || !isObject(rhs)) return rhs;

  if (isDate(lhs) || isDate(rhs)) {
    // $FlowFixMe[prop-missing]
    if (lhs.valueOf() == rhs.valueOf()) return {};
    return rhs;
  }

  // $FlowFixMe[prop-missing]
  return Object.keys(rhs).reduce((acc, key) => {
    if (hasOwnProperty(lhs, key)) {
      // $FlowFixMe[prop-missing]
      const difference = updatedDiff(lhs[key], rhs[key]);

      // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object
      // $FlowFixMe[prop-missing]
      if (
        isEmptyObject(difference) &&
        !isDate(difference) &&
        // $FlowFixMe[prop-missing]
        (isEmptyObject(lhs[key]) || !isEmptyObject(rhs[key]))
      )
        return acc; // return no diff

      acc[key] = difference;
      return acc;
    }

    return acc;
  }, makeObjectWithoutPrototype());
}

module.exports = updatedDiff;

