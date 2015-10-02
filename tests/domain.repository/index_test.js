import 'tests/helper';

import Event from 'src/event';
import Entity from 'src/entity';
import DomainRepository from 'src/domain.repository';

class SampleEntity extends Entity {
  constructor () {
    super();
    this.name = '';
  }
  static create () {
    const self = new this();
    self.applyEvent(new Event('entity created', { uuid: this.generateUUID() }));
    return self;
  }
  appendToName (string) {
    this.applyEvent(new Event('appended to name', { string }));
  }
  onEntityCreated (event) { this.uuid = event.data.uuid; }
  onAppendedToName (event) { this.name += event.data.string; }
}

describe('DomainRepository', () => {
  it('is a static class', () => assert.throws(() => new DomainRepository(), TypeError));

  describe('.commit', () => {
    let entity;
    beforeEach(() => {
      DomainRepository.begin();
      entity = SampleEntity.create();
      entity.appendToName('FirstName');
      entity.appendToName('LastName');
      DomainRepository.commit();
    });

    it('applies the events in chronological order', () => {
      const restoredInstance = DomainRepository.find(SampleEntity, entity.uuid);
      assert.equal(restoredInstance.constructor.name, 'SampleEntity');
      assert.equal(restoredInstance.uuid, entity.uuid);
      assert.equal(restoredInstance.name, 'FirstNameLastName');
    });

    it("cleans up the entity's applied events", () => {
      assert.deepEqual(entity.appliedEvents, []);
    });
  });

  describe('.eventStore', () => {
    it('complains when there is no eventStore set', () => {
      DomainRepository.eventStore = null;
      assert.throws(() => DomainRepository.eventStore, ReferenceError);
    });
  });
});
