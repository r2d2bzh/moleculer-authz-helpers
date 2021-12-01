const removeUnanswered = (authzAnswers) => authzAnswers.filter((answer) => answer !== undefined);

const doAnswersAuthorize = (authzAnswers) =>
  authzAnswers.length
    ? authzAnswers.reduce((isAuthorized, authzAnswer) => isAuthorized && doesAnswerAuthorize(authzAnswer), true)
    : false;

const doesAnswerAuthorize = function (something) {
  switch (Object.prototype.toString.call(something)) {
    case '[object Boolean]':
      return something;
    case '[object Array]':
      return doAnswersAuthorize(removeUnanswered(something));
    default:
      return false;
  }
};

export default doesAnswerAuthorize;
