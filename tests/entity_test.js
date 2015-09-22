import test from "tests/support/helper";
import Entity from "src/entity";
import Event from "src/event";
import DomainRepository from "src/domain.repository";

test("Entity # is an abstract class", assert => {
  assert.throws(() => { new Entity(); }, TypeError, "should not allow direct instantiation");
  assert.end();
});

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


test("Entity # building an entity from events", assert => {
  const entity = SampleEntity.fromEvents([
    new Event("entity created", { uuid: "new uuid" }),
    new Event("counter incremented", {})
  ]);

  assert.deepEqual(entity.counter, 1, "should re-play the events");
  assert.deepEqual(entity.uuid, "new uuid", "should re-play the events");
  assert.end();
});

test("Entity # finding an entity by UUID", assert => {
  DomainRepository.begin();
  const entity = SampleEntity.create();
  entity.incrementCounter();
  entity.incrementCounter();
  DomainRepository.commit();

  const found = SampleEntity.find(entity.uuid);
  assert.deepEqual(found, entity, "should be the same");
  assert.end();
});

test("Entity # generating UUIDs", assert => {
  const lotsOfUUIDs = Reflect.apply(Array, null, {length: 1000}).map(Function.call, Entity.generateUUID);
  const dedupedUUIDs = lotsOfUUIDs.filter((value, index, self) => self.indexOf(value) === index);

  assert.equal(lotsOfUUIDs.length, dedupedUUIDs.length, "should always be unique");
  assert.end();
});

test("Entity # applying events", assert => {
  const entity = SampleEntity.create();
  entity.applyEvent(new Event("counter incremented", {}));

  const lastEvent = entity.appliedEvents.pop();
  assert.ok(lastEvent, "should add the event to the list of applied events");
  assert.equal(lastEvent.aggregateUUID, entity.uuid, "should set the aggregateUUID on the event");
  assert.equal(entity.counter, 1, "should run the event handler function");

  assert.end();
});

test("Entity # applying events without a proper event handler", assert => {
  const entity = new SampleEntity();

  assert.throws(() => { entity.applyEvent(new Event("not implemented")); }, ReferenceError, "should error when the event handler is not found");
  assert.end();
});
