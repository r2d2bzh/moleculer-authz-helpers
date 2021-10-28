import moleculer from 'moleculer';
const {
  Service,
  Errors: { MoleculerError },
} = moleculer;

export default (serviceSpecification) => {
  const { actions } = serviceSpecification;
  const actionsWithPreflight = Object.entries(actions).filter(
    ([, actionSpecification]) => actionSpecification?.rest && !actionSpecification?.preflight?.skip
  );

  const missingPreflight = actionsWithPreflight.filter(([, actionSpecification]) =>
    Boolean(actionSpecification?.preflight?.handler)
  );

  if (missingPreflight.length) {
    throw new MoleculerError('missing preflight handler', 500, 'MISSING_PREFLIGHT', { missingPreflight });
  }

  const preflightActions = actionsWithPreflight.map(([actionName, { params, preflight } = {}]) => {
    return [
      `${actionName}-preflight`,
      {
        handler: preflight.handler,
        ...(params ? { params } : {}),
      },
    ];
  });

  serviceSpecification.actions = Service.mergeSchemaActions(
    Object.fromEntries(preflightActions),
    serviceSpecification.actions
  );
};
