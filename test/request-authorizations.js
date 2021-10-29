import test from 'ava';
import { ServiceBroker } from 'moleculer';
import { v4 as uuid } from 'uuid';
import { requestAuthorizations } from '../index.js';

test.beforeEach(async (t) => {
  t.context.broker = new ServiceBroker({ namespace: uuid(), logLevel: { '**': 'warn' } });

  t.context.broker.createService({
    name: 'events-stub',
    events: {
      'return-boolean': {
        params: {
          eventReturn: 'boolean',
        },
        handler: (ctx) => ctx.params.eventReturn,
      },
      return: {
        handler: () => {},
      },
    },
  });

  await t.context.broker.start();

  await t.context.broker.waitForServices('events-stub');
});

test.afterEach.always(async (t) => {
  await t.context.broker.stop();
});

test('send authorization requests', async (t) => {
  t.snapshot(
    await requestAuthorizations(t.context.broker)([
      { eventName: 'return-boolean', parameters: { eventReturn: true }, options: {} },
      { eventName: 'return-boolean', parameters: { eventReturn: false }, options: {} },
      { eventName: 'return', parameters: { eventReturn: false }, options: {} },
    ])
  );
});
