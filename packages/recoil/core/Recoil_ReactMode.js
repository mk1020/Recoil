/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow strict-local
 * @format
 * @oncall recoil
 */

'use strict';

const React = require('react');
const gkx = require('recoil-shared/util/Recoil_gkx');
const recoverableViolation = require('recoil-shared/util/Recoil_recoverableViolation');

// https://github.com/reactwg/react-18/discussions/86
const useSyncExternalStore: <T>(
  subscribe: (() => void) => () => void,
  getSnapshot: () => T,
  getServerSnapshot?: () => T,
) => T =
  // flowlint-next-line unclear-type:off
  (React: any).useSyncExternalStore ??
  // flowlint-next-line unclear-type:off
  (React: any).unstable_useSyncExternalStore;

let ReactRendererVersionMismatchWarnOnce = false;

// Check if the current renderer supports `useSyncExternalStore()`.
// Since React goes through a proxy dispatcher and the current renderer can
// change we can't simply check if `React.useSyncExternalStore()` is defined.
function currentRendererSupportsUseSyncExternalStore(): boolean {
  try {
    // Support for React 19+
    // $FlowFixMe[incompatible-use]
    const internals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    
    // React 19 changed the internal structure
    const ReactCurrentDispatcher = internals.ReactCurrentDispatcher || internals.ReactCurrentDispatcher$1;
    const ReactCurrentOwner = internals.ReactCurrentOwner || internals.ReactCurrentOwner$1;
    
    if (!ReactCurrentDispatcher) {
      // If we can't find the dispatcher, assume useSyncExternalStore is supported
      // since React 19+ has it by default
      // This is common in React Native with new architecture (Fabric)
      // and is not an error - just means we can't detect the renderer dynamically
      return true;
    }
    
    const dispatcher =
      ReactCurrentDispatcher?.current ?? (ReactCurrentOwner && ReactCurrentOwner.currentDispatcher);
    const isUseSyncExternalStoreSupported =
      dispatcher && dispatcher.useSyncExternalStore != null;
    
    if (
      useSyncExternalStore &&
      !isUseSyncExternalStoreSupported &&
      !ReactRendererVersionMismatchWarnOnce
    ) {
      ReactRendererVersionMismatchWarnOnce = true;
      recoverableViolation(
        'A React renderer without React 18+ API support is being used with React 18+.',
        'recoil',
      );
    }
    
    return isUseSyncExternalStoreSupported;
  } catch (error) {
    // Fallback for React 19 or other versions where internals changed
    // This is expected in some environments (React Native with Fabric, etc.)
    // and is not an error - we simply assume useSyncExternalStore is supported
    return true;
  }
}

type ReactMode = 'TRANSITION_SUPPORT' | 'SYNC_EXTERNAL_STORE' | 'LEGACY';

/**
 * mode: The React API and approach to use for syncing state with React
 * early: Re-renders from Recoil updates occur:
 *    1) earlier
 *    2) in sync with React updates in the same batch
 *    3) before transaction observers instead of after.
 * concurrent: Is the current mode compatible with Concurrent Mode and useTransition()
 */
function reactMode(): {mode: ReactMode, early: boolean, concurrent: boolean} {
  // NOTE: This mode is currently broken with some Suspense cases
  // see Recoil_selector-test.js
  if (gkx('recoil_transition_support')) {
    return {mode: 'TRANSITION_SUPPORT', early: true, concurrent: true};
  }

  if (gkx('recoil_sync_external_store') && useSyncExternalStore != null) {
    return {mode: 'SYNC_EXTERNAL_STORE', early: true, concurrent: false};
  }

  return gkx('recoil_suppress_rerender_in_callback')
    ? {mode: 'LEGACY', early: true, concurrent: false}
    : {mode: 'LEGACY', early: false, concurrent: false};
}

// TODO Need to figure out if there is a standard/open-source equivalent to see if hot module replacement is happening:
function isFastRefreshEnabled(): boolean {
  // @fb-only: const {isAcceptingUpdate} = require('__debug');
  // @fb-only: return typeof isAcceptingUpdate === 'function' && isAcceptingUpdate();
  return false; // @oss-only
}

module.exports = {
  useSyncExternalStore,
  currentRendererSupportsUseSyncExternalStore,
  reactMode,
  isFastRefreshEnabled,
};
