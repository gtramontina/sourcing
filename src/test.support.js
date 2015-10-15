import { AssertionError } from 'assert';
import { inspect } from 'util';
import DomainRepository from './domain.repository';
import EventBus from './event.bus';
import InMemoryEventStore  from './domain.repository/in.memory'
const voidEventTransport = { publish: () => {} };

function emitEvents (block, expectedEvents) {
  let originalEventStore;
  let originalEventTransport;
  try { originalEventStore = DomainRepository.eventStore; } catch (e) { originalEventStore = null; }
  try { originalEventTransport = EventBus.transport; } catch (e) { originalEventTransport = null; }

  try {
    EventBus.transport = voidEventTransport;
    const temporaryEventStore = new InMemoryEventStore();
    DomainRepository.eventStore = temporaryEventStore;

    DomainRepository.begin();
    block();
    DomainRepository.commit();

    const actualEvents = temporaryEventStore.all();
    if (!matches(actualEvents, expectedEvents)) {
      throw new AssertionError({ message: errorMessageFor(actualEvents, expectedEvents) });
    }
  } finally {
    DomainRepository.eventStore = originalEventStore;
    EventBus.transport = originalEventTransport;
  }
}

function matches(actualEvents, expectedEvents) {
  return expectedEvents.every((expected, index) => {
    const actual = actualEvents[index];
    return actual && matchesName(actual.name, expected.name) &&
      matchesAttributes(actual.data, expected.data);
  });
}

function matchesName (actualName, expectedName) {
  return actualName === expectedName;
}

function matchesAttributes (actualData, expectedData) {
  const actualDataKeys = Object.keys(actualData);
  const expectedDataKeys = Object.keys(expectedData);
  const sameNumberOfKeys = actualDataKeys.length === expectedDataKeys.length;
  return sameNumberOfKeys && expectedDataKeys.every(key => {
    return expectedData[key] instanceof RegExp ?
      expectedData[key].test(actualData[key]) :
      expectedData[key] === actualData[key];
  });
}

function toOrderedList (event, index) {
  return `${index+1}) ${event.name}: ${inspect(event.data)}`;
}

function errorMessageFor (actualEvents, expectedEvents) {

  return `The block didn't produce the expected events.

    The following events where expected in this order:
    ${expectedEvents.map(toOrderedList).join('\n    ')}

    These where received instead:
    ${actualEvents.map(toOrderedList).join('\n    ')}
  `;
}

export function augmentAssert (assert) {
  assert.emitEvents = emitEvents;
}
