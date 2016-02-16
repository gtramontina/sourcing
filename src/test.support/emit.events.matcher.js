import { inspect } from 'util';
import { AssertionError } from 'assert';
import DomainRepository from '../domain.repository';
import EventBus from '../event.bus';
import InMemoryEventStore  from '../domain.repository/in.memory'

export default class EmitEventsMatcher {
  constructor (blockToRun) {
    this.blockToRun = blockToRun;
  }

  match (expectedEvents) {
    try {
      this.setup();
      this.run();
      this.compare(expectedEvents);
    } finally {
      this.tearDown();
    }
  }

  setup () {
    try { this.originalEventStore = DomainRepository.eventStore; } catch (e) { this.originalEventStore = null; }
    try { this.originalEventTransport = EventBus.transport; } catch (e) { this.originalEventTransport = null; }
    EventBus.transport = { publish: () => {} };
    DomainRepository.commit();
    DomainRepository.eventStore = this.temporaryEventStore = new InMemoryEventStore();
  }

  run () {
    DomainRepository.begin();
    this.blockToRun();
    DomainRepository.commit();
  }

  compare (expectedEvents) {
    const actualEvents = this.temporaryEventStore.all();
    if (!matches(actualEvents, expectedEvents)) {
      throw new AssertionError({ message: errorMessageFor(actualEvents, expectedEvents) });
    }
  }

  tearDown () {
    DomainRepository.eventStore = this.originalEventStore;
    EventBus.transport = this.originalEventTransport;
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
