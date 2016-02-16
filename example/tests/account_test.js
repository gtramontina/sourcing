import 'tests/helper'
import Account from 'domain/account';
import { AccountCreated, Deposited } from 'domain/events';

import { TestSupport } from 'sourcing';
TestSupport.augmentAssert(assert);

describe('Account', () => {
  describe('.create', () => {
    it('creates a new client', () => {
      assert.emitEvents(() => { Account.create({ number: '111-111-111' }) }, [
        new AccountCreated({ uuid: /.+/, number: '111-111-111' })
      ]);
    });
  });

  describe('#deposite', () => {
    it('ensures the account exists', () => {
      assert.throws(() => { new Account().deposite(100); }, assert.AssertionError);
    });

    it('deposites the given amount', () => {
      const account = Account.create({ name: 'Marty', city: 'Hill Valley' });
      assert.emitEvents(() => { account.deposite(100); }, [
        new Deposited({ amount: 100 })
      ]);
    });
  });
});
