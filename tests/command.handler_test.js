import 'tests/helper';

import Event from 'src/event';
import Entity from 'src/entity';
import CommandHandler from 'src/command.handler';
import DomainRepository from 'src/domain.repository';

describe('CommandHandler', () => {
  it('is an abstract class', () => assert.throws(() => new CommandHandler(), TypeError));

  describe('.execute', () => {
    context('on the abstract class', () => {
      it('is not allowed', () => assert.throws(() => CommandHandler.execute(), TypeError));
    });

    context('on a concrete class that does not implement "execute"', () => {
      it('fails', () => {
        class VoidCommandHandler extends CommandHandler {}
        assert.throws(() => VoidCommandHandler.execute(), ReferenceError, `should error when the "execute" function is not implemented`);
      });
    });

    context('on a concrete class', () => {
      it('runs the "execute" instance method', () => {
        class SampleCommandHandler extends CommandHandler {
          execute (firstName, lastName) { return { firstName, lastName }; }
        }
        return SampleCommandHandler.execute('FirstName', 'LastName').
          then(({firstName, lastName}) => {
            assert.equal(firstName, 'FirstName');
            assert.equal(lastName, 'LastName');
          });
      });
    });

    context('concurrently', () => {
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

      class CreateEntityCommandHandler extends CommandHandler {
        execute (name, delay) {
          const entity = SampleEntity.create();
          return new Promise((resolve) => {
            setTimeout(() => {
              entity.appendToName(name);
              resolve(entity);
            }, delay);
          });
        }
      }

      it('processess the entity correctly', () => {
        return Promise.all([
          CreateEntityCommandHandler.execute('First', 5),
          CreateEntityCommandHandler.execute('Second', 1)
        ]).then(([entity1, entity2]) => {
          const restoredEntity1 = DomainRepository.find(SampleEntity, entity1.uuid);
          assert.equal(restoredEntity1.uuid, entity1.uuid)
          assert.equal(restoredEntity1.name, entity1.name)

          const restoredEntity2 = DomainRepository.find(SampleEntity, entity2.uuid);
          assert.equal(restoredEntity2.uuid, entity2.uuid)
          assert.equal(restoredEntity2.name, entity2.name)
        });
      });
    });
  });
});
