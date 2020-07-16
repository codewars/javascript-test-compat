// Assertions aliased to names from the custom test framework.
import chai from "chai";
const assert = chai.assert;

export const pass = () => {};
export const fail = assert.fail;
export const expect = assert;
export const assertEquals = assert.strictEqual;
export const assertNotEquals = assert.notStrictEqual;
export const assertContains = assert.include;
export const assertNotContains = assert.notInclude;

export const assertSimilar = (actual: any, expected: any, msg?: any) => {
  console.error(`assertSimilar is deprecated, use assert.deepEqual`);
  assert.deepEqual(actual, expected, msg);
};

export const assertNotSimilar = (actual: any, expected: any, msg?: any) => {
  console.error(`assertNotSimilar is deprecated, use assert.notDeepEqual`);
  assert.notDeepEqual(actual, expected, msg);
};

// not using `assert.throws` because it can't test for fn to throw "anything"
export const expectError = (msg: string | (() => void), fn?: () => void) => {
  let message: string;
  let fun: () => void;
  if (typeof msg === "function") {
    fun = msg;
    message = "Expected an error to be thrown";
  } else {
    fun = fn!;
    message = msg;
  }

  let passed = false;
  try {
    fun();
  } catch {
    passed = true;
  }
  assert(passed, message);
};

export const expectNoError = (msg: string | (() => void), fn?: () => void) => {
  let message: string;
  let fun: () => void;
  if (typeof msg === "function") {
    fun = msg;
    message = "Unexpected error was thrown";
  } else {
    fun = fn!;
    message = msg;
  }

  try {
    fun();
  } catch (ex) {
    assert.fail(appendToMessage(message, ex.message));
  }
};

// Compares two floating point values and checks whether they are approximately equal to each other
export const assertApproxEquals = (
  actual: number,
  expected: number,
  msg?: string
) => {
  // uses absolute error when |expected| <= 1, compatible with old version
  if (Math.abs(expected) <= 1) {
    assert.closeTo(actual, expected, 1e-9);
  } else {
    msg = appendToMessage(
      msg,
      "Expected actual value " +
        actual +
        " to approximately equal expected value " +
        expected +
        " (accepted relative error: 1e-9)"
    );
    assert(Math.abs((expected - actual) / expected) <= 1e-9, msg);
  }
};

// Compares two floating point values and checks whether they are sufficiently different from each other
export const assertNotApproxEquals = (
  actual: number,
  unexpected: number,
  msg?: string
) => {
  msg = appendToMessage(
    msg,
    "Actual value " +
      actual +
      " should not approximately equal unexpected value " +
      unexpected +
      " (rejected relative error: 1e-9)"
  );
  if (Math.abs(unexpected) <= 1) {
    assert(Math.abs(unexpected - actual) > 1e-9, msg);
  } else {
    assert(Math.abs((unexpected - actual) / unexpected) > 1e-9, msg);
  }
};

const appendToMessage = (msg: string | undefined, s: string) =>
  msg ? msg + " - " + s : s;
