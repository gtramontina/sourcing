const ALL = '__any__';

const channels = Symbol();
export default class InMemoryEventTransport {
  constructor () {
    this[channels] = {}
  }

  publish (eventName, eventData) {
    const dataDump = JSON.stringify(eventData); // Simulates the event going through the wire
    (this[channels][eventName] || []).forEach(callback => Reflect.apply(callback, this, [JSON.parse(dataDump)]));
    (this[channels][ALL] || []).forEach(callback => Reflect.apply(callback, this, [eventName, JSON.parse(dataDump)]));
  }

  subscribe (eventName, callback) {
    const channel = this[channels][eventName] = this[channels][eventName] || [];
    channel.push(callback);
  }

  any (callback) {
    this.subscribe(ALL, callback);
  }
}
