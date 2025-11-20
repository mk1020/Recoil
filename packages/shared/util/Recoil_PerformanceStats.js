/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Performance statistics for tracking optimization effectiveness
 *
 * @flow strict
 * @format
 * @oncall recoil
 */

'use strict';

type Stats = {
  atomUpdatesAttempted: number,
  atomUpdatesPrevented: number,
  selectorRecalculationsAttempted: number,
  selectorRecalculationsPrevented: number,
  transactionUpdatesAttempted: number,
  transactionUpdatesPrevented: number,
};

const stats: Stats = {
  atomUpdatesAttempted: 0,
  atomUpdatesPrevented: 0,
  selectorRecalculationsAttempted: 0,
  selectorRecalculationsPrevented: 0,
  transactionUpdatesAttempted: 0,
  transactionUpdatesPrevented: 0,
};

let loggingEnabled = false;

function enableLogging(enabled: boolean = true): void {
  loggingEnabled = enabled;
}

function isLoggingEnabled(): boolean {
  return loggingEnabled;
}

function logAtomUpdate(key: string, prevented: boolean): void {
  stats.atomUpdatesAttempted++;
  if (prevented) {
    stats.atomUpdatesPrevented++;
    if (loggingEnabled) {
      console.log(`[Recoil] ⏭️  Atom update prevented: ${key} (value unchanged)`);
    }
  }
}

function logSelectorRecalculation(key: string, prevented: boolean): void {
  stats.selectorRecalculationsAttempted++;
  if (prevented) {
    stats.selectorRecalculationsPrevented++;
    if (loggingEnabled) {
      console.log(`[Recoil] ⏭️  Selector recalculation prevented: ${key} (result unchanged)`);
    }
  }
}

function logTransactionUpdate(key: string, prevented: boolean): void {
  stats.transactionUpdatesAttempted++;
  if (prevented) {
    stats.transactionUpdatesPrevented++;
    if (loggingEnabled) {
      console.log(`[Recoil] ⏭️  Transaction update prevented: ${key} (value unchanged)`);
    }
  }
}

function getStats(): Stats {
  return {...stats};
}

function resetStats(): void {
  stats.atomUpdatesAttempted = 0;
  stats.atomUpdatesPrevented = 0;
  stats.selectorRecalculationsAttempted = 0;
  stats.selectorRecalculationsPrevented = 0;
  stats.transactionUpdatesAttempted = 0;
  stats.transactionUpdatesPrevented = 0;
}

function printStats(): void {
  const total =
    stats.atomUpdatesPrevented +
    stats.selectorRecalculationsPrevented +
    stats.transactionUpdatesPrevented;

  console.log('\n========================================');
  console.log('📊 RECOIL PERFORMANCE STATISTICS');
  console.log('========================================');
  console.log(`\n🔹 Atoms:`);
  console.log(`   Attempted: ${stats.atomUpdatesAttempted}`);
  console.log(`   Prevented: ${stats.atomUpdatesPrevented} (${getPercentage(stats.atomUpdatesPrevented, stats.atomUpdatesAttempted)}%)`);
  
  console.log(`\n🔹 Selectors:`);
  console.log(`   Attempted: ${stats.selectorRecalculationsAttempted}`);
  console.log(`   Prevented: ${stats.selectorRecalculationsPrevented} (${getPercentage(stats.selectorRecalculationsPrevented, stats.selectorRecalculationsAttempted)}%)`);
  
  console.log(`\n🔹 Transactions:`);
  console.log(`   Attempted: ${stats.transactionUpdatesAttempted}`);
  console.log(`   Prevented: ${stats.transactionUpdatesPrevented} (${getPercentage(stats.transactionUpdatesPrevented, stats.transactionUpdatesAttempted)}%)`);
  
  console.log(`\n🎯 Total prevented: ${total}`);
  console.log('========================================\n');
}

function getPercentage(prevented: number, attempted: number): string {
  if (attempted === 0) return '0';
  return ((prevented / attempted) * 100).toFixed(1);
}

module.exports = {
  enableLogging,
  isLoggingEnabled,
  logAtomUpdate,
  logSelectorRecalculation,
  logTransactionUpdate,
  getStats,
  resetStats,
  printStats,
};

