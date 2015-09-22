const transport = Symbol();

export default class EventBus {
  static set transport (newTransport) {
    this[transport] = newTransport;
  }

  static get transport () {
    if (!this[transport]) { throw new ReferenceError(`No Transport defined. Please define one with "EventBus.transport = new MyTransport()"`); }
    return this[transport];
  }

  static publish (eventName, eventData = {}) {
    this.transport.publish(eventName, eventData);
  }

  static subscribe (eventName, callback) {
    this.transport.subscribe(eventName, callback);
  }

  static any (callback) {
    this.transport.any(callback);
  }
}
