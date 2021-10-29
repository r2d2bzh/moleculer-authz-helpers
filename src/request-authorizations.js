export default (ctx) => (requests) =>
  Promise.all(requests.map(({ eventName, parameters, options }) => ctx.emit(eventName, parameters, options)));
