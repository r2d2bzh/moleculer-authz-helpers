const requestAuthorizations = (ctx) => async (requests) => {
  const authorizationRequests = Object.entries(requests).map((eventName, eventParams) =>
    ctx.emit(eventName, eventParams)
  );

  Promise.all(authorizationRequests).then();
};
