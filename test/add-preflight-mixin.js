import test from 'ava';
import { addPreflightMixin } from '../index.js';

test('get a MISSING_PREFLIGHT when a preflight action is missing for an exposed action', (t) => {
  t.snapshot(
    t.throws(() => addPreflightMixin({
      actions: {
        'exposed-action': {
          rest: {},
        },
        'exposed-skipped-action': {
          rest: {},
          preflight: {
            skip: true,
          },
        },
      },
    }))
  );
});

test('an exposed action is given a preflight', (t) => {
  t.snapshot(
    addPreflightMixin({
      actions: {
        'exposed-action': {
          rest: {},
          preflight: {
            handler: () => {},
          },
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
