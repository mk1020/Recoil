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

function diff(lhs: mixed, rhs: mixed): mixed {
  if (lhs === rhs) return {}; // equal return no diff

  if (!isObject(lhs) || !isObject(rhs)) return rhs; // return updated rhs

  // $FlowFixMe[prop-missing]
  const deletedValues = Object.keys(lhs).reduce((acc, key) => {
    if (!hasOwnProperty(rhs, key)) {
      acc[key] = undefined;
    }
    return acc;
  }, makeObjectWithoutPrototype());

  if (isDate(lhs) || isDate(rhs)) {
    // $FlowFixMe[prop-missing]
    if (lhs.valueOf() == rhs.valueOf()) return {};
    return rhs;
  }

  // $FlowFixMe[prop-missing]
  return Object.keys(rhs).reduce((acc, key) => {
    if (!hasOwnProperty(lhs, key)) {
      // $FlowFixMe[prop-missing]
      acc[key] = rhs[key]; // return added r key
      return acc;
    }

    // $FlowFixMe[prop-missing]
    const difference = diff(lhs[key], rhs[key]);

    // If the difference is empty, and the lhs is an empty object or the rhs is not an empty object
    // $FlowFixMe[prop-missing]
    if (
      isEmptyObject(difference) &&
      !isDate(difference) &&
      // $FlowFixMe[prop-missing]
      (isEmptyObject(lhs[key]) || !isEmptyObject(rhs[key]))
    )
      return acc; // return no diff

    acc[key] = difference; // return updated key
    return acc; // return updated key
  }, deletedValues);
}

module.exports = diff;

