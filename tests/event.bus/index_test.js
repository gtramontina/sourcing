import test from "tests/support/helper";
import EventBus from "src/event.bus";

test("EventBus # pub/sub", assert => {
  EventBus.subscribe("something happened", (eventData) => {
    assert.deepEqual(eventData, { some: "data" });
    assert.end();
  });
  EventBus.publish("something happened", { some: "data" });
});

test("EventBus # any", assert => {
  EventBus.any((eventName, eventData) => {
    assert.equal(eventName, "something happened");
    assert.deepEqual(eventData, { some: "data" });
    assert.end();
  });
  EventBus.publish("something happened", { some: "data" });
});
