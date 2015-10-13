const CREATED_AT = '_createdAt_';

const store = Symbol();
export default class InMemoryEventStore {
  constructor () {
    this[store] = []
  }

  save (rawEvent) {
    rawEvent[CREATED_AT] = nowInNanoseconds();
    this[store].push(rawEvent);
  }

  queryByUUID (uuid) {
    return this[store].
      filter(event => event.aggregateUUID === uuid).
      sort(byCreatedAt);
  }

  all () {
    return this[store].
      sort(byCreatedAt);
  }
}

function byCreatedAt (a, b) {
  return a[CREATED_AT] - b[CREATED_AT];
}

function nowInNanoseconds () {
  const now = process.hrtime();
  return now[0] * 1000000 + now[1] / 1000;
}
