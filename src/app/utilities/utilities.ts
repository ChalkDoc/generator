import { Variable } from './../variable';
import { variable } from '@angular/compiler/src/output/output_ast';
import * as _ from 'lodash';
import * as nerdamer from 'nerdamer';

export function createKnownValuesObject(
  randomSet: number[],
  variables: Variable[]
): { [name: string]: string } {
  const variableNamesArray = _.map(variables.slice(0, -1), 'name');
  return _.zipObject(variableNamesArray, randomSet.map(_.toString));
}

export function solveForUnknownVariable(
  randomSet: number[],
  simplifiedEquation: string,
  variables: Variable[]
): number {
  const variablesObject = createKnownValuesObject(randomSet, variables);
  const answer = nerdamer(simplifiedEquation, variablesObject);
  const nerdamerResult = nerdamer(answer).text();
  if (variables[variables.length - 1].decPoint !== 0) {
    const fraction = nerdamerResult.substring(1, nerdamerResult.length - 1);
    const numbers = fraction.split('/');
    return Number(numbers[0]) / Number(numbers[1]);
  } else {
    return Number(nerdamerResult.substring(1, nerdamerResult.length - 1));
  }
}

export function simplifyEquation(
  equation: string,
  variableToSolve: string
): string {
  return (nerdamer as any).solve(equation, variableToSolve).toString();
}

export function calculateDecimalPlaces(input: string | number): number {
  const inputArr = `${input}`.split('.');
  return inputArr.length === 1 ? 0 : inputArr[1].length;
}

export function getRangeValues(variableObj: Variable ) {
  const rangeValues = [];
  const increment = 10 ** - variableObj.decPoint;
  let number = variableObj.min;
  while (number <= variableObj.max) {
    rangeValues.push(_.round(number, variableObj.decPoint));
    number += increment;
  }
  return rangeValues;
}

<<<<<<< HEAD:src/app/utilities.ts
export function generatePermutations(variables: Variable[]): number[] {
  const permutations = variables.slice(0, -1).reduce(
    (possibleValues, parameter) => {
      const result = [];
      const rangeValues = getRangeValues(parameter);
      possibleValues.forEach(possibleValue => {
        rangeValues.forEach(value => {
          result.push([...possibleValue, value]);
        });
=======
export function generatePermutations(variables: Variable[]): [number[]] {
  const permutations: any = variables.slice(0, -1).reduce((possibleValues, parameter) => {
    const result = [];
    const rangeValues = getRangeValues(parameter);
    possibleValues.forEach(possibleValue => {
      rangeValues.forEach(value => {
        result.push([...possibleValue, value]);
>>>>>>> more-test-refactoring:src/app/utilities/utilities.ts
      });
      return result;
    },
    [[]]
  );
  return permutations;
}

export function meetsUnknownVariableSpecification(
  currentValue: number,
  unknownVariable: Variable
): boolean {
  const numCurrentValue = Number(currentValue);
  const currentValueDecPoint = calculateDecimalPlaces(numCurrentValue);
  const hasNoDecPoint =
    unknownVariable.decPoint === 0 && _.isInteger(numCurrentValue);
  const hasSameDecPoint =
    unknownVariable.decPoint > 0 &&
    currentValueDecPoint === unknownVariable.decPoint;
  const isWithinRange = _.inRange(
    numCurrentValue,
    unknownVariable.min,
    unknownVariable.max
  );
  return (hasNoDecPoint || hasSameDecPoint) && isWithinRange;
}

export function pullRandomValue(arr: any[]): number[] {
  const index: number = _.random(0, arr.length - 1);
  return arr.splice(index, 1)[0];
}

export function getVariableValuesCount({ min, max, decPoint }): number {
  return (max - min + 1) * 10 ** decPoint;
}

<<<<<<< HEAD:src/app/utilities.ts
function getVariablesValuesCount(variables: Variable[]): number {
  return variables.reduce(
    (acc, variableObj) => acc * getVariableValuesCount(variableObj),
    1
  );
=======
export function getVariablesValuesCount(variables: Variable[]): number {
  return variables.reduce((acc, variableObj) =>
    acc * getVariableValuesCount(variableObj)
    , 1);
>>>>>>> more-test-refactoring:src/app/utilities/utilities.ts
}

export function getCollisionRisk(variables, problems): number {
  const possibleValues = getVariablesValuesCount(variables);
<<<<<<< HEAD:src/app/utilities.ts

  return (
    1 - Math.pow(Math.E, -problems * (problems - 1) / (2 * possibleValues))
  );
=======
  return 1 - Math.pow(Math.E, (-problems * (problems - 1) / (2 * possibleValues)));
>>>>>>> more-test-refactoring:src/app/utilities/utilities.ts
}

export function genRandomPermutation(variables: Variable[]): number[] {
<<<<<<< HEAD:src/app/utilities.ts
  return variables.slice(0, -1).map(variableOji => getRandomValue(variableOji));
=======
  return variables.slice(0, -1).map((variableObj) => getRandomValue(variableObj));
>>>>>>> more-test-refactoring:src/app/utilities/utilities.ts
}

export function getRandomValue(variableObj: Variable): number {
  return parseFloat(_.random(variableObj.min, variableObj.max, true).toFixed(variableObj.decPoint));
}

export function isVariableInArray(
  knownVariableValues: number[],
  existingValues: any[]
): boolean {
  return existingValues.some(existingVariableArr =>
    knownVariableValues.every(
      (knownValue, index) => knownValue === existingVariableArr[index]
    )
  );
}
