export default (ctx) => (requests) =>
  Promise.all(
    requests.map(({ eventName, parameters, options }) =>
      ctx.service.$$callEvent(ctx, { eventName, payload: parameters, options })
    )
  );
