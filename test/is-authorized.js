import test from 'ava';
import { inspect } from 'util';
import { isAuthorized } from '../index.js';

const getTitle = (testCase) => `should${testCase.expectation ? ' ' : ' not '}authorize: ${inspect(testCase.mock)}`;
const testSuite = [
  { mock: undefined, expectation: false },
  { mock: null, expectation: false },
  { mock: false, expectation: false },
  { mock: [], expectation: false },
  { mock: [undefined], expectation: false },
  { mock: [false, undefined], expectation: false },
  { mock: [false, undefined, true], expectation: false },
  { mock: [false, true], expectation: false },
  { mock: [true], expectation: true },
  { mock: [true, true], expectation: true },
  { mock: [true, undefined], expectation: true },
  // Test answer for two concurrent authorization requests
  { mock: [[undefined], [true]], expectation: false },
];

testSuite.forEach((testCase) =>
  test(getTitle(testCase), (t) => {
    t.assert(isAuthorized(testCase.mock) === testCase.expectation);
  })
);
