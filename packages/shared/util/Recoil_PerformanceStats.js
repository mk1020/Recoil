/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Performance statistics for tracking optimization effectiveness
 *
 * @flow strict-local
 * @format
 * @oncall recoil
 */

'use strict';

const {detailedDiff} = require('./deep-object-diff');

type Stats = {
  atomUpdatesAttempted: number,
  atomUpdatesPrevented: number,
  selectorRecalculationsAttempted: number,
  selectorRecalculationsPrevented: number,
  transactionUpdatesAttempted: number,
  transactionUpdatesPrevented: number,
  componentRerendersPrevented: number,
  componentRerendersTriggered: number,
};

const stats: Stats = {
  atomUpdatesAttempted: 0,
  atomUpdatesPrevented: 0,
  selectorRecalculationsAttempted: 0,
  selectorRecalculationsPrevented: 0,
  transactionUpdatesAttempted: 0,
  transactionUpdatesPrevented: 0,
  componentRerendersPrevented: 0,
  componentRerendersTriggered: 0,
};

let loggingEnabled = false;

function enableLogging(enabled: boolean = true): void {
  loggingEnabled = enabled;
}

function isLoggingEnabled(): boolean {
  return loggingEnabled;
}

function logAtomUpdate(
  key: string,
  prevented: boolean,
  prevContents?: mixed,
  nextContents?: mixed,
): void {
  stats.atomUpdatesAttempted++;
  if (prevented) {
    stats.atomUpdatesPrevented++;
    if (loggingEnabled) {
      // console.log(`[Recoil] ⏭️  Atom update PREVENTED: "${key}"`);
    }
  } else {
    if (loggingEnabled) {
      if (prevContents !== undefined && nextContents !== undefined) {
        const changes = detailedDiff(prevContents, nextContents);
        console.log(`[Recoil] 🔄 Atom: updated "${key}" | BEFORE:`, '| AFTER:', '| DIFF:', changes);
      } else {
        console.log(`[Recoil] 🔄 Atom updated: "${key}" (data changed)`);
      }
    }
  }
}

function logSelectorRecalculation(
  key: string,
  prevented: boolean,
  prevContents?: mixed,
  nextContents?: mixed,
): void {
  stats.selectorRecalculationsAttempted++;
  if (prevented) {
    stats.selectorRecalculationsPrevented++;
    if (loggingEnabled) {
      // console.log(`[Recoil] ⏭️  Selector PREVENTED: "${key}"`);
    }
  } else {
    if (loggingEnabled) {
      if (prevContents !== undefined && nextContents !== undefined) {
        const changes = detailedDiff(prevContents, nextContents);
        console.log(`[Recoil] 🔄 Selector re-rendered: "${key}" | BEFORE:`, '| AFTER:', '| DIFF:', changes);
      } else {
        console.log(`[Recoil] 🔄 Selector updated: "${key}" (data changed)`);
      }
    }
  }
}

function logTransactionUpdate(
  key: string,
  prevented: boolean,
  prevContents?: mixed,
  nextContents?: mixed,
): void {
  stats.transactionUpdatesAttempted++;
  if (prevented) {
    stats.transactionUpdatesPrevented++;
    if (loggingEnabled) {
      // console.log(`[Recoil] ⏭️  Transaction PREVENTED: "${key}"`);
    }
  } else {
    if (loggingEnabled) {
      if (prevContents !== undefined && nextContents !== undefined) {
        const changes = detailedDiff(prevContents, nextContents);
        console.log(`[Recoil] 🔄 Transaction applied: "${key}" | BEFORE:`, '| AFTER:', '| DIFF:', changes);
      } else {
        console.log(`[Recoil] 🔄 Transaction applied: "${key}" (data changed)`);
      }
    }
  }
}

function logComponentRerender(
  key: string,
  prevented: boolean,
  prevContents?: mixed,
  nextContents?: mixed
): void {
  if (prevented) {
    stats.componentRerendersPrevented++;
    if (loggingEnabled) {
      // console.log(`[Recoil] ⏭️  Re-render PREVENTED: "${key}"`);
    }
  } else {
    stats.componentRerendersTriggered++;
    if (loggingEnabled) {
      if (prevContents !== undefined && nextContents !== undefined) {
        const changes = detailedDiff(prevContents, nextContents);
        // console.log(`[Recoil] 🔄 Componenr Re-render: "${key}" | BEFORE:`, prevContents, '| AFTER:', nextContents, '| DIFF:', changes);
      } else {
        // console.log(`[Recoil] 🔄 Componenr Re-render: "${key}"`);
      }
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
  stats.componentRerendersPrevented = 0;
  stats.componentRerendersTriggered = 0;
}

function printStats(): void {
  const totalPrevented =
    stats.atomUpdatesPrevented +
    stats.selectorRecalculationsPrevented +
    stats.transactionUpdatesPrevented +
    stats.componentRerendersPrevented;

  console.log('\n========================================');
  console.log('📊 RECOIL PERFORMANCE STATISTICS');
  console.log('========================================');
  console.log(`\n🔹 Atoms:`);
  console.log(`   Attempted: ${stats.atomUpdatesAttempted}`);
  console.log(`   Prevented: ${stats.atomUpdatesPrevented} (${getPercentage(stats.atomUpdatesPrevented, stats.atomUpdatesAttempted)}%)`);

  console.log(`\n🔹 Selectors (setCache):`);
  console.log(`   Attempted: ${stats.selectorRecalculationsAttempted}`);
  console.log(`   Prevented: ${stats.selectorRecalculationsPrevented} (${getPercentage(stats.selectorRecalculationsPrevented, stats.selectorRecalculationsAttempted)}%)`);

  console.log(`\n🔹 Transactions:`);
  console.log(`   Attempted: ${stats.transactionUpdatesAttempted}`);
  console.log(`   Prevented: ${stats.transactionUpdatesPrevented} (${getPercentage(stats.transactionUpdatesPrevented, stats.transactionUpdatesAttempted)}%)`);

  const componentTotal = stats.componentRerendersPrevented + stats.componentRerendersTriggered;
  console.log(`\n🔹 Component Re-renders (hooks):`);
  console.log(`   Triggered: ${stats.componentRerendersTriggered}`);
  console.log(`   Prevented: ${stats.componentRerendersPrevented} (${getPercentage(stats.componentRerendersPrevented, componentTotal)}%)`);

  console.log(`\n🎯 Total operations prevented: ${totalPrevented}`);
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
  logComponentRerender,
  getStats,
  resetStats,
  printStats,
};

