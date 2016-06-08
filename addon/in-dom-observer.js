import Ember from 'ember';
import WeakMap from 'ember-weakmap';

// map to ensure once-ness without help from the run-loop
const inDOMPending = new WeakMap();

const { run, observer } = Ember;

// observer that only fires if:
// * the object is in DOM
// * the object is not destroyed or destroying
// * once per run-loop flush
export default function inDOMObserver(...args) {
  let fn = args.pop();

  if (typeof fn !== 'function') {
    throw new TypeError('last argument to inDOMObserver must be a function');
  }

  return observer(...args, function inDOMFn() {

    // grab the map of inDOMPending functions for this instance
    let pendingMap = inDOMPending.get(this);

    if (pendingMap && pendingMap.get(inDOMFn)) {
      // we found a map, and the current function is already schedule so we
      // have no work todo, skipping...
      return;
    } else {
      // no map found, create a new one
      pendingMap = new Ember.Map();
      inDOMPending.set(this, pendingMap);
    }

    // set the current function as pending
    pendingMap.set(inDOMFn, true);

    run.schedule('actions', () => {
      if (this.isDestroyed || this.isDestroying) {
        // if the current object is destroyed, skip
        return;
      }

      // purge the current function from pending
      inDOMPending.get(this).delete(inDOMFn);

      let state = this.state || this._state;
      if (state !== 'inDOM') {
        // don't bother invoking if this is not current inDOM
        return;
      }

      fn.call(this);
    });
  });
}
