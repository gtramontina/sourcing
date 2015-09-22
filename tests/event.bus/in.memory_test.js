import test from "tests/support/helper";
import InMemoryEventTransport from "src/event.bus/in.memory";

test("InMemoryEventTransport # pub/sub", assert => {
  const transport = new InMemoryEventTransport();
  let actualEvent1;
  const event1 = { event: "1" };
  let actualEvent2;
  const event2 = { event: "2" };
  const allEvents = [];

  transport.subscribe("event 1", event => actualEvent1 = event);
  transport.subscribe("event 2", event => actualEvent2 = event);
  transport.any((name, event) => allEvents.push([name, event]));

  transport.publish("event 1", event1);
  transport.publish("event 2", event2);

  assert.deepEqual(actualEvent1, event1, "should emit to subscribers only");
  assert.deepEqual(actualEvent2, event2, "should emit to subscribers only");
  assert.deepEqual(allEvents, [["event 1", event1], ["event 2", event2]], "should emit to all subscribers of \"any\" events");

  assert.end();
});


test("InMemoryEventTransport # resetting", assert => {
  const transport = new InMemoryEventTransport();
  let actualEvent1;
  const event1 = { event: "1" };

  transport.subscribe("event 1", event => actualEvent1 = event);
  InMemoryEventTransport.reset();
  transport.publish("event 1", event1);

  assert.ok(actualEvent1 === undefined, "should clear all listeners");
  assert.end();
});
