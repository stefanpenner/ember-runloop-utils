import onceObserver from 'ember-runloop-utils/once-observer';
import { module, test } from 'qunit';
import Ember from 'ember';

module('once-observer');

test('validates input', function(assert) {
  assert.throws(function() {
    onceObserver();
  }, /last argument to onceObserver must be a function/);
});

test('basic usage', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: onceObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create();

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Stef');
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 1, 'expected one invocation');
});

test('coalescing (same property)', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: onceObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create();

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Stef');
    p.set('name', 'Bob');
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 1, 'expected one invocation');
});

test('coalescing (different property)', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: onceObserver('name', 'age', function() {
      invoked++;
    })
  });

  var p = Parent.create();

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Stef');
    p.set('age', 12);
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 1, 'expected one invocation');
});

test('isDestroying', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: onceObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create();

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Stef');
    p.isDestroying = true;
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 0, 'expected one invocation');
});

test('isDestroyed', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: onceObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create();

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Stef');
    p.isDestroyed = true;
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 0, 'expected one invocation');
});
