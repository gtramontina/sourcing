import EventBus from "src/event.bus";
import InMemoryEventTransport from "src/event.bus/in.memory";
EventBus.transport = new InMemoryEventTransport();

import { beforeEach } from "./tape.xtras";
import tape from "tape-catch";
const test = beforeEach(tape, (before) => {
  InMemoryEventTransport.reset();
  before.end();
});
export default test;
