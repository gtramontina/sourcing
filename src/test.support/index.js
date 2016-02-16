import EmitEventsMatcher from './emit.events.matcher';

function emitEvents (block, expectedEvents) {
  new EmitEventsMatcher(block).match(expectedEvents);
}

export function augmentAssert (assert) {
  assert.emitEvents = emitEvents;
}
