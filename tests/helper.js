import assert from 'assert';
global.assert = assert;

import DomainRepository from 'src/domain.repository';
import InMemoryEventStore from 'src/domain.repository/in.memory';
DomainRepository.eventStore = new InMemoryEventStore();

import EventBus from 'src/event.bus';
import InMemoryEventTransport from 'src/event.bus/in.memory';
EventBus.transport = new InMemoryEventTransport();

beforeEach(InMemoryEventStore.reset);
beforeEach(InMemoryEventTransport.reset);
