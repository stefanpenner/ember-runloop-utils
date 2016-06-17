import onceHelper from './lib/once-helper';

export default onceHelper('inDOMObserver', function(target) {
  return target.isDestroyed ||
        target.isDestroying ||
            ((target._state || target.state)) !== 'inDOM';
})
