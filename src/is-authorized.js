const ensureBoolArray = (something) =>
  (Array.isArray(something) ? something : [something]).flat(Infinity).filter((response) => response !== undefined);

const someRequestsFailed = (booleanArray) => !booleanArray.length || booleanArray.includes(false);

export default (something) => !someRequestsFailed(ensureBoolArray(something));
