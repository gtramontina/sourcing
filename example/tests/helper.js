import 'babel-polyfill';
import assert from 'assert';
global.assert = assert;

import { DomainRepository, EventBus } from 'sourcing';
import InMemoryEventStore from 'sourcing/lib/domain.repository/in.memory';
import InMemoryEventTransport from 'sourcing/lib/event.bus/in.memory';

beforeEach(() => DomainRepository.eventStore = new InMemoryEventStore());
beforeEach(() => EventBus.transport = new InMemoryEventTransport());
