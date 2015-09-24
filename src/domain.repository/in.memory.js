const STORE = [];
const CREATED_AT = '_createdAt_';

export default class InMemoryEventStore {
  static reset () {
    STORE.splice(0, STORE.length);
  }

  save (rawEvent) {
    rawEvent[CREATED_AT] = nowInNanoseconds();
    STORE.push(rawEvent);
  }

  queryByUUID (uuid) {
    return STORE.
      filter(event => event.aggregateUUID === uuid).
      sort((a, b) => a[CREATED_AT] - b[CREATED_AT]);
  }
}

function nowInNanoseconds () {
  const now = process.hrtime();
  return now[0] * 1000000 + now[1] / 1000;
}
