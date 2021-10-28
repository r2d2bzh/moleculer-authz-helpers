export default (ctx) => (requests) =>
  Promise.all(Object.entries(requests).map((eventName, { payload, opts }) => ctx.emit(eventName, payload, opts)));
