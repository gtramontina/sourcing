import "tests/helper";

import Event from "src/event";

describe("Event", () => {
  it("requires a name", () => assert.throws(() => new Event(), ReferenceError));

  it("holds the given data", () => {
    const event = new Event("something happened", { some: "data", here: "too" });
    assert.deepEqual(event.data, { some: "data", here: "too" });
  });

  describe("#aggregateUUID=", () => {
    it("holds a reference to it", () => {
      const event = new Event("something happened", {});
      event.aggregateUUID = "some new uuid";
      assert.equal(event.aggregateUUID, "some new uuid");
    });
  });

  describe("#handlerName", () => {
    [ "something happened", "something_happened", "Something Happened",
      "something.happened", "SomethingHappened", "somethingHappened" ].
    forEach(name => {
      it(`prefixes "${name}" with "on" and concatenate with the PascalCase version of the name`, () => {
        assert.equal(new Event(name).handlerName, "onSomethingHappened");
      });
    });
  });
});
