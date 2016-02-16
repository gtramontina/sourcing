import 'tests/helper'
import Client from 'domain/client';
import { ClientCreated, ClientDeposited, AccountCreated, AccountAssignedToClient } from 'domain/events';

import { TestSupport } from 'sourcing';
TestSupport.augmentAssert(assert);

describe('Client', () => {
  describe('.create', () => {
    it('creates a new client', () => {
      assert.emitEvents(() => { Client.create({ name: 'Marty', city: 'Hill Valley' }); }, [
        new ClientCreated({ uuid: /.+/, name: 'Marty', city: 'Hill Valley' })
      ]);
    });
  });

  describe('#openAccount', () => {
    it('ensures the client exists', () => {
      assert.throws(() => { new Client().openAccount({ number: '000-000-000' }); }, assert.AssertionError);
    });

    it('assigns the newly openned account to the client', () => {
      const client = Client.create({ name: 'Marty', city: 'Hill Valley' });
      assert.emitEvents(() => { client.openAccount({ number: '111-111-111' }); }, [
        new AccountCreated({ uuid: /.+/, number: '111-111-111', clientUuid: client.uuid }),
        new AccountAssignedToClient({ accountUuid: /.+/ })
      ]);
    });
  });
});
