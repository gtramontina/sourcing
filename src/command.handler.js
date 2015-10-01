import co from 'co';
import DomainRepository from './domain.repository';

export default class CommandHandler {
  constructor () {
    if (this.constructor === CommandHandler) { throw new TypeError(`"${this.constructor.name}" is an abstract class.`); }
  }

  static execute (...parameters) {
    if (this === CommandHandler) { throw new TypeError(`"${this.name}.execute" should never be called directly. Subclass it instead.`); }
    if (!Reflect.has(this.prototype, 'execute')) { throw new ReferenceError(`${this} should implement a method called "execute".`) }

    return co(function *execute () {
      DomainRepository.begin();
      const result = yield Reflect.construct(this).execute(...parameters);
      DomainRepository.commit();
      return result;
    }.bind(this));
  }
}
