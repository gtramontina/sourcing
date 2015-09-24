import uuidGen from 'uuid';
import DomainRepository from './domain.repository';

const appliedEvents = Symbol();
const uuid = Symbol();

export default class Entity {
  constructor () {
    if (this.constructor === Entity) { throw new TypeError(`"Entity" is an abstract class.`); }
    this[appliedEvents] = [];
  }

  static fromEvents (events) {
    const instance = new this();
    events.forEach(playEvent.bind(instance));
    return instance;
  }

  static generateUUID () {
    return uuidGen.v4();
  }

  static find (uuid) {
    return DomainRepository.find(this, uuid);
  }

  applyEvent (event) {
    Reflect.apply(playEvent, this, [event]);
    event.aggregateUUID = this[uuid];
    this[appliedEvents].push(event);
    DomainRepository.add(this);
  }

  get appliedEvents () {
    return this[appliedEvents].slice(0);
  }

  set uuid (newUUID) {
    this[uuid] = newUUID;
  }

  get uuid () {
    return this[uuid];
  }
}

function playEvent (event) {
  const handler = Reflect.apply(locateHandler, this, [event.handlerName]);
  Reflect.apply(handler, this, [event])
}

function locateHandler (handlerName) {
  if (!Reflect.has(this, handlerName)) { throw new ReferenceError(`"${this.constructor.name}" does not define the event handler "${handlerName}"`); }
  return this[handlerName];
}
