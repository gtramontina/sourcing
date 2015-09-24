import 'tests/helper';

import Report from 'src/report';
import EventBus from 'src/event.bus';

class SampleReport extends Report {
  constructor () { super(); this.events = []; }
  onSomethingHappened (event) { this.events.push(event); }
  onSomethingElseHappened (event) { this.events.push(event); }
}

describe('Report', () => {
  it('is an abstract class', () => assert.throws(() => new Report(), TypeError));

  it('is able to listen on any event that might be of interest', () => {
    const someReport = new SampleReport();
    EventBus.publish('something happened', { some: 'data' });
    EventBus.publish('something else happened', { some: { more: 'data' } });

    const result = someReport.events.map(event => { return { name: event.name, data: event.data }; });
    assert.deepEqual(result, [
      { name: 'something happened', data: { some: 'data' } },
      { name: 'something else happened', data: { some: { more: 'data' }} }
    ]);
  });

  it('does not complain about not having anyone interested', () => {
    new SampleReport();
    assert.doesNotThrow(() => EventBus.publish('mistery happened'));
  });
});
