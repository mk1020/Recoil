/**
 * @flow strict
 * @format
 */

'use strict';

function isDate(d: mixed): boolean {
  return d instanceof Date;
}

function isEmpty(o: mixed): boolean {
  if (o == null || typeof o !== 'object') return true;
  return Object.keys(o).length === 0;
}

function isObject(o: mixed): boolean {
  return o != null && typeof o === 'object';
}

function hasOwnProperty(o: mixed, key: string): boolean {
  if (o == null || typeof o !== 'object') return false;
  return Object.prototype.hasOwnProperty.call(o, key);
}

function isEmptyObject(o: mixed): boolean {
  return isObject(o) && isEmpty(o);
}

function makeObjectWithoutPrototype(): {[string]: mixed} {
  return Object.create(null);
}

module.exports = {
  isDate,
  isEmpty,
  isObject,
  hasOwnProperty,
  isEmptyObject,
  makeObjectWithoutPrototype,
};

