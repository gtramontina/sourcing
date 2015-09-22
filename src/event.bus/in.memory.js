const CHANNELS = {};
const ALL = "__any__";

export default class InMemoryEventTransport {
  static reset () {
    for (const channel in CHANNELS) { Reflect.deleteProperty(CHANNELS, channel) }
  }

  publish (eventName, eventData) {
    const dataDump = JSON.stringify(eventData); // Simulates the event going through the wire
    subscribersOf(eventName).forEach(callback => Reflect.apply(callback, this, [JSON.parse(dataDump)]));
    subscribersOf(ALL).forEach(callback => Reflect.apply(callback, this, [eventName, JSON.parse(dataDump)]));
  }

  subscribe (eventName, callback) {
    const channel = CHANNELS[eventName] = CHANNELS[eventName] || [];
    channel.push(callback);
  }

  any (callback) {
    this.subscribe(ALL, callback);
  }
}

function subscribersOf (channel) {
  return CHANNELS[channel] || [];
}
