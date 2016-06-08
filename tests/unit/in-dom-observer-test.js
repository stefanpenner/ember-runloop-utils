import inDOMObserver from 'ember-runloop-utils/in-dom-observer';
import { module, test } from 'qunit';
import Ember from 'ember';

module('in-dom-observer');

test('input is validated (last arg is a function)', function(assert) {
  assert.throws(function() {
    inDOMObserver();
  }, /last argument to inDOMObserver must be a function/);
});

test('works with both `state` and `_state`', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: inDOMObserver('name', function() {
      invoked++;
    })
  });

  let a = Parent.create({ state: 'inDOM' });
  let b = Parent.create({ _state: 'inDOM' });

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    a.set('name', 'foo');
    b.set('name', 'foo');
  });

  assert.equal(invoked, 2, 'expected TWO invocations');

  a.state = 'preRender';

  Ember.run(() => {
    a.set('name', 'bar');
    b.set('name', 'bar');
  });

  assert.equal(invoked, 3, 'expected THREE invocations');

  b._state = 'preRender';

  Ember.run(() => {
    a.set('name', 'baz');
    b.set('name', 'baz');
  });

  assert.equal(invoked, 3, 'expected THREE invocations');

  a.state = 'inDOM';
  b._state = 'inDOM';

  Ember.run(() => {
    a.set('name', 'quz');
    b.set('name', 'quz');
  });

  assert.equal(invoked, 5, 'expected FIVE invocations');
});

test('basic usage', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: inDOMObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create({
    _state: 'inDOM',
  });

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Stef');
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 1, 'expected one invocation');
});

test('state pre-render + change', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: inDOMObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create({
    _state: 'prerender',
  });

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Stef');
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 0, 'expected no invocations');
});

test('pre-render -> inDOM', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: inDOMObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create({
    _state: 'prerender',
  });

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Stef');
    assert.equal(invoked, 0, 'expected no invocations');
  });

  Ember.run(() => p.set('_state', 'inDOM'));

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Desmond');
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 1, 'expected one invocation');
});

test('pre-render -> inDOM but after change', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: inDOMObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create({
    _state: 'prerender',
  });

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Desmond');
    p.set('_state', 'inDOM');
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 1, 'expected one invocation');
});

test('isDestroyed', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: inDOMObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create({
    _state: 'inDOM',
  });

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Desmond');
    p.isDestroyed = true;
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 0, 'expected no invocations');
});

test('isDestroying', function(assert) {
  let invoked = 0;
  let Parent = Ember.Object.extend({
    nameDidChange: inDOMObserver('name', function() {
      invoked++;
    })
  });

  var p = Parent.create({
    _state: 'inDOM',
  });

  assert.equal(invoked, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Desmond');
    p.isDestroying = true;
    assert.equal(invoked, 0, 'expected no invocations');
  });

  assert.equal(invoked, 0, 'expected no invocations');
});

test('same instance 2 inDOMObservers', function(assert) {
  let invokedName = 0;
  let invokedAge = 0;

  let Parent = Ember.Object.extend({
    nameDidChange: inDOMObserver('name', function() {
      invokedName++;
    }),
    ageDidChange: inDOMObserver('age', function() {
      invokedAge++;
    })
  });

  var p = Parent.create({
    _state: 'inDOM',
  });

  assert.equal(invokedName, 0, 'expected no invocations');
  assert.equal(invokedAge, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('name', 'Desmond');
    assert.equal(invokedName, 0, 'expected no invocations');
    assert.equal(invokedAge, 0, 'expected no invocations');
  });

  assert.equal(invokedName, 1, 'expected no invocations');
  assert.equal(invokedAge, 0, 'expected no invocations');

  Ember.run(() => {
    p.set('age', '30');
    assert.equal(invokedName, 1, 'expected ONE invocations');
    assert.equal(invokedAge, 0, 'expected no invocations');
  });

  assert.equal(invokedName, 1, 'expected ONE invocations');
  assert.equal(invokedAge, 1, 'expected ONE invocations');
});

test('same inDOMObservers 2 instances', function(assert) {
  let invokedName = 0;

  let nameDidChange = inDOMObserver('name', function() {
    invokedName++;
  });

  let Parent = Ember.Object.extend({
    nameDidChange,
  });

  let a = Parent.create({ _state: 'inDOM' });
  let b = Parent.create({ _state: 'inDOM' });

  Ember.run(() => a.set('name', 'foo'));

  assert.equal(invokedName, 1, 'expected ONE invocation');

  Ember.run(() => b.set('name', 'foo'));

  assert.equal(invokedName, 2, 'expected TWO invocations');

  Ember.run(() => {
    b.set('name', 'bar');
    b.isDestroyed = true;
  });

  assert.equal(invokedName, 2, 'expected TWO invocations');

  Ember.run(() => a.set('name', 'bar'));

  assert.equal(invokedName, 3, 'expected THREE invocations');
});

test('once-ness', function(assert) {
  let invokedName = 0;
  let value;
  let nameDidChange = inDOMObserver('name', function() {
    invokedName++;
    value = this.get('name');
  });

  let Parent = Ember.Object.extend({
    _state: 'inDOM',
    nameDidChange,
  });

  let a = Parent.create();

  assert.equal(invokedName, 0, 'expected no invocations');

  Ember.run(() => {
    a.set('name', 'stef');
    a.set('name', 'desmond');

    assert.equal(invokedName, 0, 'expected no invocations');
  });

  assert.equal(invokedName, 1, 'expected ONE invocation');
  assert.equal(value, 'desmond');
});
