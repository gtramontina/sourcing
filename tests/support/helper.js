import DomainRepository from "src/domain.repository";
import InMemoryEventStore from "src/domain.repository/in.memory";
DomainRepository.eventStore = new InMemoryEventStore();

import EventBus from "src/event.bus";
import InMemoryEventTransport from "src/event.bus/in.memory";
EventBus.transport = new InMemoryEventTransport();

import { beforeEach } from "./tape.xtras";
import tape from "tape-catch";
const test = beforeEach(tape, (before) => {
  InMemoryEventStore.reset();
  InMemoryEventTransport.reset();
  before.end();
});
export default test;
