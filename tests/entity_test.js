import "tests/helper";

import Entity from "src/entity";
import Event from "src/event";
import DomainRepository from "src/domain.repository";

class SampleEntity extends Entity {
  constructor () {
    super();
    this.counter = 0;
  }
  static create () {
    const self = new this();
    self.applyEvent(new Event("entity created", { uuid: this.generateUUID() }));
    return self;
  }
  incrementCounter () { this.applyEvent(new Event("counter incremented")); }
  onEntityCreated (event) { this.uuid = event.data.uuid; }
  onCounterIncremented () { this.counter++; }
}

describe("Entity", () => {
  it("is an abstract class", () => assert.throws(() => new Entity(), TypeError));

  describe("#fromEvents", () => {
    it ("replays all given events", () => {
      const entity = SampleEntity.fromEvents([
        new Event("entity created", { uuid: "new uuid" }),
        new Event("counter incremented", {})
      ]);
      assert.equal(entity.counter, 1);
      assert.equal(entity.uuid, "new uuid");
    });
  });

  describe("#find", () => {
    it("rebuilds an entity by UUID", () => {
      DomainRepository.begin();
      const entity = SampleEntity.create();
      entity.incrementCounter();
      entity.incrementCounter();
      DomainRepository.commit();

      const found = SampleEntity.find(entity.uuid);
      assert.deepEqual(found, entity);
    });
  });

  describe(".generateUUID", () => {
    it("generates always unique IDs", () => {
      const lotsOfUUIDs = Reflect.apply(Array, null, {length: 1000}).map(Function.call, Entity.generateUUID);
      const dedupedUUIDs = lotsOfUUIDs.filter((value, index, self) => self.indexOf(value) === index);

      assert.equal(lotsOfUUIDs.length, dedupedUUIDs.length);
    });
  });

  describe("#applyEvent", () => {
    const entity = SampleEntity.create();
    entity.applyEvent(new Event("counter incremented", {}));
    const lastEvent = entity.appliedEvents.pop();

    it("adds the event to the list of applied events", () => assert.ok(lastEvent));
    it("sets the aggregateUUID on the event", () => assert.equal(lastEvent.aggregateUUID, entity.uuid));
    it("runs the event handler function", () => assert.equal(entity.counter, 1));
    it("fails if the event handler is not implemented", () => assert.throws(() => entity.applyEvent(new Event("not implemented")), ReferenceError));
  });
});
