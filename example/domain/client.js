import assert from 'assert';
import { Entity } from 'sourcing';
import { ClientCreated, ClientDeposited, AccountAssignedToClient } from './events';
import Account from './account';

export default class Client extends Entity {
  static create (attributes) {
    const client = new this();
    client.applyEvent(new ClientCreated(Object.assign({}, attributes, { uuid: Entity.generateUUID() })));
    return client;
  }

  openAccount (attributes) {
    assert(this.exists());
    const account = Account.create(Object.assign({}, attributes, { clientUuid: this.uuid }));
    this.applyEvent(new AccountAssignedToClient({ accountUuid: account.uuid }));
  }

  exists () {
    return !!this.uuid;
  }

  onClientCreated (event) {
    this.uuid = event.data.uuid;
  }

  onClientDeposited (event) {}
  onAccountAssignedToClient (event) {}
};
