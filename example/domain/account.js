import assert from 'assert';
import { Entity } from 'sourcing';
import { AccountCreated, Deposited } from './events';

export default class Account extends Entity {
  static create (attributes) {
    const account = new this();
    account.applyEvent(new AccountCreated(Object.assign({}, attributes, { uuid: Entity.generateUUID() })));
    return account;
  }

  deposite (amount) {
    assert(this.exists());
    this.applyEvent(new Deposited({ amount: amount }));
  }

  exists () {
    return !!this.uuid;
  }

  onAccountCreated(event) {
    this.uuid = event.data.uuid;
  }

  onDeposited (event) {}
};
