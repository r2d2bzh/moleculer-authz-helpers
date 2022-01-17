import cloneDeep from 'lodash/cloneDeep.js';
import moleculer from 'moleculer';
import { callEventMixin } from '@r2d2bzh/moleculer-event-callback';

const {
  Errors: { MoleculerError },
} = moleculer;

export const unsafeAddPreflightMixin = (serviceSchema, { timeout }) => {
  const actionsWithPreflight = Object.entries(serviceSchema.actions || {}).filter(
    ([, actionSpecification]) => actionSpecification?.preflight
  );

  const preflightActions = actionsWithPreflight.map(([actionName, { params, preflight } = {}]) => [
    `${actionName}-preflight`,
    {
      handler: preflight instanceof Function ? preflight : preflight.handler,
      ...(params ? { params } : {}),
    },
  ]);

  const schema = cloneDeep(serviceSchema);

  /**
   * use moleculer mixin mechanism to inject the new actions
   */
  schema.mixins = [
    ...(serviceSchema.mixins || []),
    {
      actions: Object.fromEntries(preflightActions),
    },
    callEventMixin({ timeout }),
  ];

  return schema;
};

export default (serviceSchema, { timeout = 200 } = {}) => {
  Object.entries(serviceSchema.actions || {})
    .filter(([, actionSpecification]) => actionSpecification?.rest && actionSpecification.rest?.authorization !== false)
    .forEach(([actionName, actionSpecification]) => {
      if (!(actionSpecification?.preflight instanceof Function || actionSpecification?.preflight?.handler)) {
        throw new MoleculerError('missing preflight handler', 500, 'MISSING_PREFLIGHT', { actionName });
      }
    });

  return unsafeAddPreflightMixin(serviceSchema, { timeout });
};
