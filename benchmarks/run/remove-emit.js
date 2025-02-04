'use strict';

var benchmark = require('benchmark');

var EventEmitter2 = require('eventemitter2').EventEmitter2
  , EventEmitter1 = require('events').EventEmitter
  , EventEmitter3 = require('eventemitter3')
  , Drip = require('drip').EventEmitter
  , CE = require('contra/emitter')
  , EE = require('event-emitter')
  , TSEE = require('tsee')
  , TSEEP = require('../../lib')
  , Emitix = require('emitix').default
;

function handle() {
  if (arguments.length > 100) console.log('damn');
}

var ee1 = new EventEmitter1()
  , ee2 = new EventEmitter2()
  , ee3 = new EventEmitter3()
  , drip = new Drip()
  , ce = CE()
  , tsee = new TSEE.EventEmitter()
  , tseep = new TSEEP.EventEmitter()
  , ee = EE()
  , emitix = new Emitix()
;

[ee1, ee2, ee3, drip, ee, ce, tsee, tseep, emitix].forEach(function ohai(emitter) {
  emitter.on('foo', handle);
  if (emitter.removeListener) emitter.removeListener('foo', handle);
  else if (emitter.off) emitter.off('foo', handle);

  //
  // We add and remove a listener to see if the event emitter implementation is
  // de-optimized because it deletes items from an object etc.
  //
  emitter.on('ohai', ohai);
  if (emitter.removeListener) emitter.removeListener('ohai', ohai);
  else if (emitter.off) emitter.off('ohai', ohai);
  else throw new Error('No proper remove implementation');
});

//
// FastEmitter is omitted as it throws an error.
//

(
  new benchmark.Suite()
)
.add('EventEmitter1', function() {
  ee1.emit('foo');
  ee1.emit('foo', 'bar');
  ee1.emit('foo', 'bar', 'baz');
  ee1.emit('foo', 'bar', 'baz', 'boom');
}).add('EventEmitter2', function() {
  ee2.emit('foo');
  ee2.emit('foo', 'bar');
  ee2.emit('foo', 'bar', 'baz');
  ee2.emit('foo', 'bar', 'baz', 'boom');
}).add('EventEmitter3', function() {
  ee3.emit('foo');
  ee3.emit('foo', 'bar');
  ee3.emit('foo', 'bar', 'baz');
  ee3.emit('foo', 'bar', 'baz', 'boom');
}).add('Drip', function() {
  drip.emit('foo');
  drip.emit('foo', 'bar');
  drip.emit('foo', 'bar', 'baz');
  drip.emit('foo', 'bar', 'baz', 'boom');
}).add('event-emitter', function() {
  ee.emit('foo');
  ee.emit('foo', 'bar');
  ee.emit('foo', 'bar', 'baz');
  ee.emit('foo', 'bar', 'baz', 'boom');
}).add('contra/emitter', function() {
  ce.emit('foo');
  ce.emit('foo', 'bar');
  ce.emit('foo', 'bar', 'baz');
  ce.emit('foo', 'bar', 'baz', 'boom');
}).add('tsee', function() {
  tsee.emit('foo');
  tsee.emit('foo', 'bar');
  tsee.emit('foo', 'bar', 'baz');
  tsee.emit('foo', 'bar', 'baz', 'boom');
})
.add('tseep', function() {
  tseep.emit('foo');
  tseep.emit('foo', 'bar');
  tseep.emit('foo', 'bar', 'baz');
  tseep.emit('foo', 'bar', 'baz', 'boom');
})
.add('emitix', function() {
  emitix.emit('foo');
  emitix.emit('foo', 'bar');
  emitix.emit('foo', 'bar', 'baz');
  emitix.emit('foo', 'bar', 'baz', 'boom');
})
.on('cycle', function cycle(e) {
  console.log(e.target.toString());
}).on('complete', function completed() {
  console.log('Fastest is %s', this.filter('fastest').map('name'));
}).run({ async: true });
