import invariant from "invariant";
import isPlainObject from "is-plain-object";

const depParseRegex = /^(\w+)\.(\w+)$/;

function transformDepsArray(array) {
  invariant(Array.isArray(array), "deps is supposed to be an array not '%s'", array);
  return array.reduce(
    (memo, depExpr) => {
      const match = depExpr.match(depParseRegex);
      invariant(match !== null, "depExpr '%s' is not valid. Needs to take the form of 'model.field'");
      /*eslint-disable no-unused-vars*/
      const [all, modelName, modelField] = match;
      /*eslint-enable no-unused-vars*/
      (memo[modelName] = memo[modelName] || {})[modelField] = true;
      return memo;
    },
    {}
  );
}

function normaliseFieldValue(name, properties = {}) {
  return {
    isId: !!properties.isId || name === "id",
    deps: transformDepsArray(properties.deps || []),
    default: properties.default === undefined ? undefined : properties.default // being overly explicit here!
  };
}

function normaliseFieldArray(fieldArray, modelName) {
  if (typeof fieldArray === "string") {
    fieldArray = fieldArray.split(",");
  }

  invariant(Array.isArray(fieldArray), "'%s.fields' is supposed to be an array or string not '%s'", modelName, fieldArray);

  return fieldArray.reduce(
    (memo, field) => {
      if (typeof field === "string" && field.length) {
        field.split(",").forEach(fieldName => {
          memo[fieldName] = normaliseFieldValue(fieldName);
        });
      } else if (Array.isArray(field)) {
        field.forEach(fieldName => {
          memo[fieldName] = normaliseFieldValue(fieldName);
        });
      } else if (isPlainObject(field)) {
        Object.keys(field).forEach(fieldName => {
          memo[fieldName] = normaliseFieldValue(fieldName, field[fieldName]);
        });
      } else {
        invariant(false, "field value needs to be either string, array or object, instead received '%s'", field);
      }
      return memo;
    },
    {}
  );
}

export default function(description) {
  return Object.keys(description).reduce(
    (memo, modelName) => {
      const currentDesc = description[modelName];

      memo[modelName] = {
        name: modelName,
        singleton: !!currentDesc.singleton,
        deps: transformDepsArray(currentDesc.deps || []),
        fields: normaliseFieldArray(currentDesc.fields, modelName)
      };
      return memo;
    },
    {}
  );
}
