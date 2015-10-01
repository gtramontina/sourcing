import Event from './event';
import EventBus from './event.bus';

export default class Report {
  constructor () {
    if (this.constructor === Report) { throw new TypeError(`"${this.constructor.name}" is an abstract class.`); }
    EventBus.any(dispatchEvent.bind(this));
  }
}

function dispatchEvent (eventName, eventData) {
  const event = new Event(eventName, eventData);
  const eventHandler = this[event.handlerName];
  if (eventHandler) { Reflect.apply(eventHandler, this, [event]); }
}
