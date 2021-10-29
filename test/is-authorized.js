import test from 'ava';
import { inspect } from 'util';
import { isAuthorized } from '../index.js';

const getTitle = (testCase) => `should${testCase.expectation ? ' ' : ' not '}authorized: ${inspect(testCase.mock)}`;
const testSuite = [
  { mock: false, expectation: false },
  { mock: [], expectation: false },
  { mock: [undefined], expectation: false },
  { mock: [false, undefined], expectation: false },
  { mock: [false, undefined, true], expectation: false },
  { mock: [false, true], expectation: false },
  { mock: [true], expectation: true },
  { mock: [true, true], expectation: true },
  { mock: [true, undefined], expectation: true },
];

testSuite.forEach((testCase, i) => 
  test(
    getTitle(testCase), (t) =>  t.snapshot(isAuthorized(testCase.mock), `Am I authorized ? ${testCase.expectation}`)
  )
);

