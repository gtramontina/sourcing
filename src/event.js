import pascalCase from 'pascal-case';
import sentenceCase from 'sentence-case';

const aggregateUUID = Symbol();
const name = Symbol();
const data = Symbol();

export default class Event {
  constructor (eventName, eventData = {}) {
    if (!eventName) { throw new ReferenceError(`${this.constructor.name} requires a name`); }
    this[name] = sentenceCase(eventName);
    this[data] = eventData;
  }
  set aggregateUUID (uuid) { this[aggregateUUID] = uuid; }
  get aggregateUUID () { return this[aggregateUUID]; }
  get data () { return this[data]; }
  get name () { return this[name]; }
  get handlerName () { return `on${pascalCase(this[name])}`; }

  static new (...attributes) {
    return class extends Event {
      constructor (eventData) { super('{name}', eventData); }
      get name () { return sentenceCase(this.constructor.name.replace(/Event$/, '')); }
      get data () {
        return attributes.reduce((filteredData, attribute) => {
          if (this[data][attribute]) { filteredData[attribute] = this[data][attribute]; }
          return filteredData;
        }, {});
      }
    }
  }
}
