import { match } from "ts-pattern";
import type { ConditionalConfig, Dependencies, FormConfig } from "./form-config-types";

import type { ObjectConfig } from "./form-config-types";
// a function that takes a form config and returns the keys in dot notation
// it's the same as the FormKeys type, but it's a function
// that is the root keys of the form config AND the keys of "properties" in the "object" type
// i.e. return ["pointOfInvolvement", "delaysInPresentationAndEvaluation.hasDelays", "delaysInPresentationAndEvaluation.top3Causes", "howDoYouTriageAndDetermineSpecialty", "whichGuidelinesDoYouFollowForTriage", "isTheUseOfTheseGuidelinesConsistentAcrossTheRegion.isConsistent", "isTheUseOfTheseGuidelinesConsistentAcrossTheRegion.disparities"]
export const getFormKeys = <T extends FormConfig>(formConfig: T) => {
  const rootKeys = Object.keys(formConfig);
  const objectKeys = rootKeys.filter((key) => formConfig[key as keyof T]?.type === "object");
  const objectKeysInDotNotation = objectKeys.map((key) => {
    const object = formConfig[key as keyof T] as ObjectConfig;
    return Object.keys(object.properties).map((property) => `${key}.${property}`);
  });

  return [...rootKeys, ...objectKeysInDotNotation.flat()].filter((k) => {
    // don't include the keys that are in the object keys in dot notation
    if (objectKeys.includes(k)) return !rootKeys.includes(k);

    return true;
  });
};

/**
 * Returns true if the dependency value passes the operator check against the value to check against.
 */
export function testFieldAgainstDependencyOperator({
  operator,
  valueToCheckAgainst,
  dependencyValue,
}: {
  operator: ConditionalConfig[1];
  valueToCheckAgainst: ConditionalConfig[2];
  dependencyValue: ConditionalConfig[2];
}) {
  return !!match(operator)
    .with("equals", () => {
      if (dependencyValue === valueToCheckAgainst) {
        return true;
      }
    })
    .with("not-equals", () => {
      if (dependencyValue !== valueToCheckAgainst) {
        return true;
      }
    })
    .with("contains-case-insensitive", () => {
      // check if the dependency value is an array and if it contains the value to check against
      if (
        Array.isArray(dependencyValue) &&
        dependencyValue.some((item) => String(item).toLowerCase().includes(String(valueToCheckAgainst).toLowerCase()))
      ) {
        return true;
      }

      // cast as a string
      if (String(dependencyValue).toLowerCase().includes(String(valueToCheckAgainst).toLowerCase())) {
        return true;
      }
    })
    .with("not-contains-case-insensitive", () => {
      // check if the dependency value is an array and if it DOES NOT contain the value to check against
      if (
        Array.isArray(dependencyValue) &&
        !dependencyValue.some((item) => String(item).toLowerCase().includes(String(valueToCheckAgainst).toLowerCase()))
      ) {
        return true;
      }

      // cast as a string
      if (!String(dependencyValue).toLowerCase().includes(String(valueToCheckAgainst).toLowerCase())) {
        return true;
      }
    })
    .exhaustive();
}

export function testFieldAgainstAllDependencies({
  testFor,
  dependencies,
  getDependencyValue,
}: {
  testFor: Dependencies["then"];
  dependencies: Dependencies[];
  getDependencyValue: (pathToDependency: string) => any;
}) {
  let doesFieldPassAllDependencies = false;

  //
  // only look at "hide" dependencies
  //
  dependencies
    .filter((dependency) => dependency.then === testFor)
    .forEach((dependency) => {
      // const [pathToDependency, operator, valueToCheckAgainst] = dependency.if;

      //
      // check the "if" dependency
      //
      const if_dependencyValue = getDependencyValue(dependency.if[0]);
      const doesFieldPass_if_check = testFieldAgainstDependencyOperator({
        operator: dependency.if[1],
        valueToCheckAgainst: dependency.if[2],
        dependencyValue: if_dependencyValue,
      });

      if (doesFieldPass_if_check) {
        doesFieldPassAllDependencies = true;
      }

      //
      // check the "or" dependency
      //
      if (dependency.or) {
        const or_dependencyValue = getDependencyValue(dependency.or[0]);
        const doesFieldPass_or_check = testFieldAgainstDependencyOperator({
          operator: dependency.or[1],
          valueToCheckAgainst: dependency.or[2],
          dependencyValue: or_dependencyValue,
        });

        if (doesFieldPass_or_check) {
          doesFieldPassAllDependencies = true;
        }
      }

      //
      // check the "or2" dependency
      //
      if (dependency.or2) {
        const or2_dependencyValue = getDependencyValue(dependency.or2[0]);
        const doesFieldPass_or2_check = testFieldAgainstDependencyOperator({
          operator: dependency.or2[1],
          valueToCheckAgainst: dependency.or2[2],
          dependencyValue: or2_dependencyValue,
        });

        if (doesFieldPass_or2_check) {
          doesFieldPassAllDependencies = true;
        }
      }

      //
      // check the "and" dependency
      //
      if (dependency.and) {
        const and_dependencyValue = getDependencyValue(dependency.and[0]);
        const doesFieldPass_and_check = testFieldAgainstDependencyOperator({
          operator: dependency.and[1],
          valueToCheckAgainst: dependency.and[2],
          dependencyValue: and_dependencyValue,
        });

        // "and" dependencies are ANDed together
        doesFieldPassAllDependencies = doesFieldPassAllDependencies && doesFieldPass_and_check;
      }

      //
      // check the "and2" dependency
      //
      if (dependency.and2) {
        const and2_dependencyValue = getDependencyValue(dependency.and2[0]);
        const doesFieldPass_and2_check = testFieldAgainstDependencyOperator({
          operator: dependency.and2[1],
          valueToCheckAgainst: dependency.and2[2],
          dependencyValue: and2_dependencyValue,
        });

        // "and" dependencies are ANDed together
        doesFieldPassAllDependencies = doesFieldPassAllDependencies && doesFieldPass_and2_check;
      }
    });

  return doesFieldPassAllDependencies;
}
