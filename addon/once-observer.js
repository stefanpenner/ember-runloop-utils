import onceHelper from './lib/once-helper';

export default onceHelper('onceObserver', function(target) {
  return target.isDestroying || target.isDestroyed;
});
