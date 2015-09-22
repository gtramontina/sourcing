import test from "tape-catch";
import Event from "src/event";

test("Event # when initialized", assert => {
  assert.throws(() => { new Event(); }, ReferenceError, "should require a name");
  const event = new Event("something happened", { some: "data", here: "too" });
  assert.deepEqual(event.data, { some: "data", here: "too" }, "should hold the given data");

  assert.end();
});

test("Event # setting aggregate UUID", assert => {
  const event = new Event("something happened", {});
  event.aggregateUUID = "some new uuid";
  assert.equal(event.aggregateUUID, "some new uuid", "should hold a reference to it");
  assert.end();
});

test("Event # when deriving the handler name", assert => {
  [ "something happened",
    "something_happened",
    "Something Happened",
    "something.happened",
    "SomethingHappened",
    "somethingHappened" ].forEach(name => {
    assert.equal(new Event(name).handlerName, "onSomethingHappened", `should prefix ${name} with "on" and concatenate with the PascalCase version of the name`);
  });
  assert.end();
});
