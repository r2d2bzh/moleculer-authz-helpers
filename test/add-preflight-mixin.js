import test from 'ava';
import { addPreflightMixin } from '../index.js';

test('get a MISSING_PREFLIGHT when a preflight action is missing for an exposed action', (t) => {
  t.snapshot(
    t.throws(() =>
      addPreflightMixin({
        actions: {
          'exposed-action': {
            rest: {
              authorization: false,
            },
          },
          'exposed-action-missing-preflight': {
            rest: {},
          },
        },
      })
    )
  );
});

test('an exposed action is given a preflight', (t) => {
  t.snapshot(
    addPreflightMixin({
      actions: {
        'exposed-action': {
          rest: {},
          preflight: () => {},
        },
        'exposed-action-with-params': {
          rest: {},
          params: { actionParam: 'action parameter' },
          preflight: {
            handler: () => {},
          },
        },
      },
    })
  );
});

test('no error if no action is defined', (t) => {
  t.snapshot(addPreflightMixin({}));
});
