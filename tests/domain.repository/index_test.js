import test from "tests/support/helper";
import Event from "src/event";
import Entity from "src/entity";
import DomainRepository from "src/domain.repository";

class SampleEntity extends Entity {
  constructor () {
    super();
    this.name = '';
  }
  static create () {
    const self = new this();
    self.applyEvent(new Event("entity created", { uuid: this.generateUUID() }));
    return self;
  }
  appendToName (string) {
    this.applyEvent(new Event("appended to name", { string }));
  }
  onEntityCreated (event) { this.uuid = event.data.uuid; }
  onAppendedToName (event) { this.name += event.data.string; }
}

test("DomainRepository # is a factory class", assert => {
  assert.throws(() => { new DomainRepository(); }, TypeError, "should not allow direct instantiation");
  assert.end();
});

test("DomainRepository # committing a transaction", assert => {
  DomainRepository.begin();
  const entity = SampleEntity.create();
  entity.appendToName('FirstName');
  entity.appendToName('LastName');
  DomainRepository.commit();

  const restoredInstance = DomainRepository.find(SampleEntity, entity.uuid);
  assert.equal(restoredInstance.constructor.name, "SampleEntity");
  assert.equal(restoredInstance.uuid, entity.uuid, "should apply the events only once");
  assert.equal(restoredInstance.name, 'FirstNameLastName', "should apply the events in order");
  assert.end();
});
