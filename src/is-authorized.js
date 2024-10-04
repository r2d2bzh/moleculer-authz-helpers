const removeUnanswered = (authzAnswers) => authzAnswers.filter((answer) => answer !== undefined);

const reduceAnswers = (answers, reducer) => {
  if (answers.length > 0) {
    let accumulator = [true, 0];

    for (const answer of answers) {
      const [authorizationStatus, authorizationsCount] = accumulator;
      accumulator = reducer(answer, authorizationStatus, authorizationsCount);
    }
    return accumulator;
  }

  return [false, 0];
};

const onMultipleAuthorizations =
  (handle) =>
  ([answersAuthorization, authorizationsCount]) => {
    if (authorizationsCount > 1) {
      handle(authorizationsCount);
    }
    return answersAuthorization;
  };

const processAndCountManyAnswers = (warn) => {
  const warnOnMultipleAuthorizations = onMultipleAuthorizations((authorizationsCount) =>
    warn(`multiple answers to the same authorization request (${authorizationsCount})`)
  );
  return (answers, authorizationStatus) => {
    const newRequestIsAuthorized = warnOnMultipleAuthorizations(
      reduceAnswers(removeUnanswered(answers), processAndCountAnswer(warn))
    );
    return authorizationStatus && newRequestIsAuthorized;
  };
};

const processAndCountAnswer = (warn) => {
  const doAnswersAuthorize = processAndCountManyAnswers(warn);
  return function (answer, authorizationStatus = true, authorizationsCount = 0) {
    switch (Object.prototype.toString.call(answer)) {
      case '[object Boolean]': {
        return [authorizationStatus && answer, authorizationsCount + 1];
      }
      case '[object Array]': {
        // A new array means a new authorization request with its own
        // answers count that does not reflect on the current one
        return [doAnswersAuthorize(answer, authorizationStatus), authorizationsCount];
      }
      case '[object Undefined]': {
        return [false, authorizationsCount];
      }
      default: {
        warn(`odd authorization answer`, { answer });
        return [false, authorizationsCount];
      }
    }
  };
};

export default (logger) => {
  try {
    const doesAnswerAuthorizeAndWarn = processAndCountAnswer(logger.warn.bind(logger));
    return function (answer) {
      const [authorize] = doesAnswerAuthorizeAndWarn(answer);
      return authorize;
    };
  } catch {
    throw new Error(`logger.warn must be a function`);
  }
};
