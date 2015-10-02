import Event from '../event';
import EventBus from '../event.bus';

const eventStore = Symbol();
export default class DomainRepository {
  constructor () {
    throw new TypeError(`"${this.constructor.name}" is a static class. To begin a transaction run "DomainRepository.begin()"`);
  }

  static set eventStore (newEventStore) {
    this[eventStore] = newEventStore;
  }

  static get eventStore () {
    if (!this[eventStore]) { throw new ReferenceError(`No EventStore defined. Please define one with "${this.name}.eventStore = new MyEventStore()"`); }
    return this[eventStore];
  }

  static begin () {
    process.aggregates = new Set();
  }

  static find (Type, uuid) {
    const events = this.eventStore.queryByUUID(uuid).
      map(rawEvent => new Event(rawEvent.name, rawEvent.data));
    return this.add(Type.fromEvents(events));
  }

  static add (aggregate) {
    aggregates().add(aggregate);
    return aggregate;
  }

  static commit () {
    aggregates().forEach((aggregate) => {
      aggregate.appliedEvents.forEach((event) => {
        Reflect.apply(save, this, [event]);
        EventBus.publish(event.name, event.data);
      });
      aggregate.setPristine();
    });
    Reflect.deleteProperty(process, 'aggregates');
  }
}

function save (event) {
  this.eventStore.save({
    name: event.name,
    data: event.data,
    aggregateUUID: event.aggregateUUID
  });
}

function aggregates () {
  if (!process.aggregates) { DomainRepository.begin(); }
  return process.aggregates;
}
