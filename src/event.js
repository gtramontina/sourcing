import pascalCase from "pascal-case";

const aggregateUUID = Symbol();
const name = Symbol();
const data = Symbol();

export default class Event {
  constructor (eventName, eventData = {}) {
    if (!eventName) { throw new ReferenceError("Event requires a name"); }
    this[name] = eventName;
    this[data] = eventData;
  }
  set aggregateUUID (uuid) { this[aggregateUUID] = uuid; }
  get aggregateUUID () { return this[aggregateUUID]; }
  get data () { return this[data]; }
  get name () { return this[name]; }
  get handlerName () { return `on${pascalCase(this[name])}`; }
}
