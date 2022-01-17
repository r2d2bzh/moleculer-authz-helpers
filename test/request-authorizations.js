import test from 'ava';
import { ServiceBroker } from 'moleculer';
import { v4 as uuid } from 'uuid';
import { requestAuthorizations } from '../index.js';
import { callEventMixin, callEventReturnDecorator } from '@r2d2bzh/moleculer-event-callback';

test.beforeEach(async (t) => {
  t.context.broker = new ServiceBroker({ namespace: uuid(), logLevel: { '**': 'warn' } });

  t.context.broker.createService({
    name: 'events-stub',
    mixins: [callEventMixin()],
    events: {
      'return-boolean': callEventReturnDecorator({
        params: {
          eventReturn: 'boolean',
        },
        handler: (ctx) => ctx.params.eventReturn,
      }),
      return: callEventReturnDecorator({
        handler: () => {},
      }),
    },
    actions: {
      'run-test': (ctx) => requestAuthorizations(ctx)(ctx.params.authorizationTests),
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
    await t.context.broker.call('events-stub.run-test', {
      authorizationTests: [
        { eventName: 'return-boolean', parameters: { eventReturn: true }, options: {} },
        { eventName: 'return-boolean', parameters: { eventReturn: false }, options: {} },
        { eventName: 'return', parameters: { eventReturn: false }, options: {} },
      ],
    })
  );
});
