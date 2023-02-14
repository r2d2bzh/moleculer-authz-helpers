export default (context) => (requests) =>
  Promise.all(
    requests.map(({ eventName, parameters, options }) =>
      context.service.$$callEvent(context, { eventName, payload: parameters, options })
    )
  );
