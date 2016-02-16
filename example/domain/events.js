import { Event } from 'sourcing';

// Client Events
export class ClientCreated extends Event.new('uuid', 'name', 'city') {};
export class AccountAssignedToClient extends Event.new('accountUuid') {};

// Account Events
export class AccountCreated extends Event.new('uuid', 'number', 'clientUuid') {};
export class Deposited extends Event.new('amount') {};
