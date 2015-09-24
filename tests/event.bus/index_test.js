import 'tests/helper';

import EventBus from 'src/event.bus';

describe('EventBus', () => {
  describe('.pub/sub', () => {
    it('publishes specific events to specific subscribers', (done) => {
      EventBus.subscribe('something happened', (eventData) => {
        assert.deepEqual(eventData, { some: 'data' });
        done();
      });
      EventBus.publish('something happened', { some: 'data' });
    });
  });

  describe('.any', () => {
    it('publishes any events to subscribers of any event', (done) => {
      EventBus.any((eventName, eventData) => {
        assert.equal(eventName, 'something happened');
        assert.deepEqual(eventData, { some: 'data' });
        done();
      });
      EventBus.publish('something happened', { some: 'data' });
    });
  });
});
