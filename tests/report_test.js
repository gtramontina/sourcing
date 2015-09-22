import test from "tests/support/helper";
import Report from "src/report";
import EventBus from "src/event.bus";

test("Report # is an abstract class", assert => {
  assert.throws(() => { new Report(); }, TypeError, "should not allow direct instantiation");
  assert.end();
});

class SampleReport extends Report {
  constructor () { super(); this.events = []; }
  onSomethingHappened (event) { this.events.push(event); }
  onSomethingElseHappened (event) { this.events.push(event); }
}

test("Report # being aware of events", assert => {
  const someReport = new SampleReport();
  EventBus.publish("something happened", { some: "data" });
  EventBus.publish("something else happened", { some: { more: "data" } });

  const result = someReport.events.map(event => { return { name: event.name, data: event.data }; });
  assert.deepEqual(result, [
    { name: "something happened", data: { some: "data" } },
    { name: "something else happened", data: { some: { more: "data" }} }
  ], "should run the callbacks by event name");
  assert.end();
});

test("Report # unknown events", assert => {
  new SampleReport();
  assert.doesNotThrow(() => { EventBus.publish("mistery happened"); }, "should not complain about a missing handler");
  assert.end();
});
