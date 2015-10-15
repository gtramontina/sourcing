import assert from 'assert';
import Event from 'src/event';
import Entity from 'src/entity';
import * as TestSupport from 'src/test.support';

class SampleEntity extends Entity {
  static create (name) {
    const self = new this();
    self.applyEvent(new Event('entity created', { uuid: 'new uuid', name: name }));
    return self;
  }
  onEntityCreated () {}
}

describe('test.support', () => {
  context(`for nodejs' built-in "assert" module`, () => {
    TestSupport.augmentAssert(assert);

    it('adds a new method to "assert"', () => {
      assert(Reflect.has(assert, 'emitEvents'));
    });

    context('comparing event name', () => {
      it('fails when it is not equal', () => {
        assert.throws(() => {
          assert.emitEvents(() => SampleEntity.create('right'), [
            new Event('something happened', { uuid: /.*/, name: /.*/ })
          ]);
        }, assert.AssertionError, 'should fail the assertion');
      });

      it('passes when it is equal', () => {
        assert.emitEvents(() => SampleEntity.create('right'), [
          new Event('entity created', { uuid: /.*/, name: /.*/ })
        ]);
      });
    });

    context('comparing data', () => {
      it('fails when they are not equal in lenght', () => {
        assert.throws(() => {
          assert.emitEvents(() => SampleEntity.create(), [
            new Event('entity created', {})
          ]);
        }, assert.AssertionError, 'should fail the assertion');
      });

      it('fails when any data attribute is not equal', () => {
        assert.throws(() => {
          assert.emitEvents(() => SampleEntity.create('right'), [
            new Event('entity created', { uuid: 'wrong uuid', name: 'right' })
          ]);
        }, assert.AssertionError, 'should fail the assertion');
        assert.throws(() => {
          assert.emitEvents(() => SampleEntity.create('right'), [
            new Event('entity created', { uuid: 'new uuid', name: 'wrong' })
          ]);
        }, assert.AssertionError, 'should fail the assertion');
      });

      it('passes when it is equal', () => {
        assert.emitEvents(() => SampleEntity.create('right'), [
          new Event('entity created', { uuid: 'new uuid', name: 'right' })
        ]);
      });

      it('passes when it matches the given regexp', () => {
        assert.emitEvents(() => SampleEntity.create('right name'), [
          new Event('entity created', { uuid: /uid$/, name: /.*ght n/ })
        ]);
      });
    });
  });
});
