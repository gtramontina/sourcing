import Event from "../event";
import EventBus from "../event.bus";

const eventStore = Symbol();
const AGGREGATES = new Set();

export default class DomainRepository {
  constructor () {
    throw new TypeError(`"DomainRepository" is a factory class. To begin a transaction run "DomainRepository.begin()"`);
  }

  static set eventStore (newEventStore) {
    this[eventStore] = newEventStore;
  }

  static get eventStore () {
    if (!this[eventStore]) { throw new ReferenceError(`No EventStore defined. Please define one with "DomainRepository.eventStore = new MyEventStore()"`); }
    return this[eventStore];
  }

  static begin () {
    AGGREGATES.clear();
  }

  static find (Type, uuid) {
    const events = this.eventStore.queryByUUID(uuid).
      map(rawEvent => new Event(rawEvent.name, rawEvent.data));
    return this.add(Type.fromEvents(events));
  }

  static add (aggregate) {
    AGGREGATES.add(aggregate);
    return aggregate;
  }

  static commit () {
    AGGREGATES.forEach((aggregate) => {
      aggregate.appliedEvents.forEach((event) => {
        Reflect.apply(save, this, [event]);
        EventBus.publish(event.name, event.data);
      });
    });
  }
}

function save (event) {
  this.eventStore.save({
    name: event.name,
    data: event.data,
    aggregateUUID: event.aggregateUUID
  });
}
