import Ember from 'ember';
import WeakMap from 'ember-weakmap';

const { run, observer } = Ember;
const oncePending = new WeakMap();

export default function(name, shortCircuitFn) {
  return function(...args) {
    let fn = args.pop();

    if (typeof fn !== 'function') {
      throw new TypeError(`last argument to ${name} must be a function`);
    }

    return observer(...args, function onceFn() {
      // grab the map of oncePending functions for this instance
      let pendingMap = oncePending.get(this);

      if (pendingMap && pendingMap.get(onceFn)) {
        // we found a map, and the current function is already schedule so we
        // have no work todo, skipping...
        return;
      } else if (!pendingMap) {
        // no map found, create a new one
        pendingMap = new Ember.Map();
        oncePending.set(this, pendingMap);
      } else {
        // map found, but not for the giving function
      }

      // set the current function as pending
      pendingMap.set(onceFn, true);

      run.schedule('actions', () => {
        // purge the current function from pending
        oncePending.get(this).delete(onceFn);

        if (shortCircuitFn(this)) { return; }

        fn.call(this);
      });
    });
  };
}
