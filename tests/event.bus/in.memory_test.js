import 'tests/helper';

import InMemoryEventTransport from 'src/event.bus/in.memory';

describe('InMemoryEventTransport', () => {
  describe('#pub/sub', () => {
    it('publishes events to all subscribers', () => {
      const transport = new InMemoryEventTransport();
      let actualEvent1;
      const event1 = { event: '1' };
      let actualEvent2;
      const event2 = { event: '2' };
      const allEvents = [];

      transport.subscribe('event 1', event => actualEvent1 = event);
      transport.subscribe('event 2', event => actualEvent2 = event);
      transport.any((name, event) => allEvents.push([name, event]));

      transport.publish('event 1', event1);
      transport.publish('event 2', event2);

      assert.deepEqual(actualEvent1, event1);
      assert.deepEqual(actualEvent2, event2);
      assert.deepEqual(allEvents, [['event 1', event1], ['event 2', event2]]);
    });
  });
});
