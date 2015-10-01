import assert from 'assert';
global.assert = assert;

import DomainRepository from 'src/domain.repository';
import InMemoryEventStore from 'src/domain.repository/in.memory';
import EventBus from 'src/event.bus';
import InMemoryEventTransport from 'src/event.bus/in.memory';

beforeEach(() => DomainRepository.eventStore = new InMemoryEventStore());
beforeEach(() => EventBus.transport = new InMemoryEventTransport());
