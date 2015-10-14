import 'tests/helper';

import Event from 'src/event';

describe('Event', () => {
  it('requires a name', () => assert.throws(() => new Event(), ReferenceError));

  it('holds the given data', () => {
    const event = new Event('something happened', { some: 'data', here: 'too' });
    assert.deepEqual(event.data, { some: 'data', here: 'too' });
  });

  describe('#aggregateUUID=', () => {
    it('holds a reference to it', () => {
      const event = new Event('something happened', {});
      event.aggregateUUID = 'some new uuid';
      assert.equal(event.aggregateUUID, 'some new uuid');
    });
  });

  describe('#handlerName', () => {
    [ 'something happened', 'something_happened', 'Something Happened',
      'something.happened', 'SomethingHappened', 'somethingHappened' ].
    forEach(name => {
      it(`prefixes "${name}" with "on" and concatenate with the PascalCase version of the name`, () => {
        assert.equal(new Event(name).handlerName, 'onSomethingHappened');
      });
    });
  });

  describe('.new', () => {
    class SomethingHappened extends Event.new('one', 'two') {}
    class SomethingHappenedEvent extends Event.new('three') {}
    class NothingHappened extends Event.new() {}

    it('infers the event name from the class name', () => {
      assert.equal(new SomethingHappened().name, 'something happened');
      assert.equal(new SomethingHappenedEvent().name, 'something happened');
      assert.equal(new NothingHappened().name, 'nothing happened');
    });

    it('correctly defines the event handler name based on the class name', () => {
      assert.equal(new SomethingHappened().handlerName, 'onSomethingHappened');
      assert.equal(new SomethingHappenedEvent().handlerName, 'onSomethingHappened');
      assert.equal(new NothingHappened().handlerName, 'onNothingHappened');
    });

    it('holds only the data specified in the "new" function call', () => {
      const somethingHappened = new SomethingHappened({ one: 1, two: '', three: 3 });
      const somethingHappenedEvent = new SomethingHappenedEvent({ one: 1, two: 2, three: 3 });
      const nothingHappened = new NothingHappened({ one: 1, two: 2, three: 3 });

      assert.deepEqual(somethingHappened.data, { one: 1, two: '' });
      assert.deepEqual(somethingHappenedEvent.data, { three: 3 });
      assert.deepEqual(nothingHappened.data, {});
    });
  });
});
