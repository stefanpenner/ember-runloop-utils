# Ember-runloop-utils [![Build Status](https://travis-ci.org/stefanpenner/ember-runloop-utils.svg?branch=master)](https://travis-ci.org/stefanpenner/ember-runloop-utils)

Observers are hard to use, when possible we should avoid them see: [this video](https://www.youtube.com/watch?v=vvZEddrClAQ) if you are curious how.

#### Now sometimes, observers are required (but rarely):

* pushing change information away from ember (to d3, or jQuery or similar)
* thats more or less it

Unfortunately, even in this scenarios it can be quite tricky to write them correctly. 

#### Common Requirements (tricky to implement):

* schedule on the run-loop
* should fire once per run-loop queue flush
* should not fire if the object is `isDestroyed` or `isDestroying`
* sometimes should not fire if the object is no longer `inDOM`
 
#### Solution:

This library provides several helpers which aim to address the above issue. The goal is to have a shared, well tested implemention of `onceObserver` and `inDomObserver` macros.


```js
// For the DOM observer use-case
import inDOMObserver from 'ember-runloop-utils/in-dom-observer'
import Component from 'ember/component'

export default Component.extend({
  dataDidChange: inDOMObserver('data.[]', function() {
    // safely and efficiently invoke your wonderful D3 code
  })
})
```

```js
// For crappy reasons non inDOM use-cases
import onceObserver from 'ember-runloop-utils/in-dom-observer'
import Component from 'ember/component'

export default Service.extend({
  dataDidChange: onceObserver('data.[]', function() {
    // for some unknown and most likely poor reason create an observer that only flushes once per run-loop flush
    // in well factored code, this should essentially never happen instead:
    //  * use actions + invoke explicit methods
    //  * use computed properties
    // Why is stef so emo about this? go watch -> https://www.youtube.com/watch?v=vvZEddrClAQ
  })
});
```




## Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://ember-cli.com/](http://ember-cli.com/).
