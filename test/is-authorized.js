import test from 'ava';
import { inspect } from 'node:util';
import { isAuthorized } from '../index.js';

const getTitle = (testCase) => `should${testCase.expectation ? ' ' : ' not '}authorize: ${inspect(testCase.mock)}`;
const warn = (t) => ({
  warn: (message) => t.snapshot(message),
});
const testSuite = [
  { mock: undefined, expectation: false },
  // intends to explicitly test null value
  // eslint-disable-next-line unicorn/no-null
  { mock: null, expectation: false, warn },
  { mock: false, expectation: false },
  { mock: [], expectation: false },
  { mock: [undefined], expectation: false },
  { mock: [false, undefined], expectation: false },
  { mock: [false, undefined, true], expectation: false, warn },
  { mock: [false, true], expectation: false, warn },
  { mock: [true], expectation: true },
  { mock: [true, true, true], expectation: true, warn },
  { mock: [true, undefined], expectation: true },
  { mock: [true, [true]], expectation: true },
  { mock: [false, [true]], expectation: false },
  { mock: [true, [false, true, true]], expectation: false, warn },
  { mock: [false, [false, true, true]], expectation: false, warn },
  // Test answer for two concurrent authorization requests
  { mock: [[undefined], [true]], expectation: false },
  // intends to explicitly test null value
  // eslint-disable-next-line unicorn/no-null
  { mock: [[null], [true]], expectation: false, warn },
  { mock: [[true, true], [true]], expectation: true, warn },
  {
    mock: [
      [true, undefined, undefined],
      [undefined, true, undefined],
      [undefined, undefined, false],
    ],
    expectation: false,
  },
];

for (const testCase of testSuite)
  test(getTitle(testCase), (t) => {
    if (testCase.warn) {
      t.plan(2);
    }
    t.assert(
      isAuthorized(testCase.warn ? testCase.warn(t) : { warn: () => t.fail() })(testCase.mock) === testCase.expectation
    );
  });

test('throws on missing logger', (t) => {
  t.snapshot(t.throws(() => isAuthorized()));
});

test('throws on bad logger', (t) => {
  t.snapshot(t.throws(() => isAuthorized({ warn: true })));
});
