import cloneDeep from 'lodash/cloneDeep';
import moleculer from 'moleculer';
const {
  Service,
  Errors: { MoleculerError },
} = moleculer;

export default (serviceSchema) => {
  const { actions } = serviceSchema;
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

  const schema = cloneDeep(serviceSchema);

  schema.mixins = [ ...(serviceSchema.mixins || []), {
    actions: Object.fromEntries(preflightActions),
  } ];

  return schema;
};
