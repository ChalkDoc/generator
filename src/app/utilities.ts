import { Variable } from './variable';
import { variable } from '@angular/compiler/src/output/output_ast';
import * as _ from 'lodash';
import * as nerdamer from 'nerdamer';


// export function containsImaginary(input: string): boolean {
//   return input.includes('i');
// }

export function createKnownValuesObject(randomSet: number[], variables: Variable[]): { [name: string]: string } {
  const variableNamesArray = _.map(variables.slice(0, -1), 'name');
  console.log(variableNamesArray);
  console.log(randomSet.map(_.toString));
  return _.zipObject(variableNamesArray, randomSet.map(_.toString));
}

export function solveForUnknownVariable(randomSet: number[], simplifiedEquation: string, variables: Variable[]): number {
    const variablesObject = createKnownValuesObject(randomSet, variables);
    const answer = nerdamer(simplifiedEquation, variablesObject);
    const nerdamerResult = nerdamer(answer).text();
    const fraction = nerdamerResult.substring(1, nerdamerResult.length - 1);
    const numbers = fraction.split('/');
    return Number(numbers[0]) / Number(numbers[1]);
}

export function simplifyEquation(equation: string, variableToSolve: string): string {
  return (nerdamer as any).solve(equation, variableToSolve).toString();
}

export function calculateDecimalPlaces(input: string | number): number {
  const inputArr = `${input}`.split('.');
  return inputArr.length === 1 ? 0 : inputArr[1].length;
}

export function getRangeValues({ min, max, decPoint }) {
  const rangeValues = [];
  const increment = 10 ** -decPoint;
  let number = min;
  while (number <= max) {
    rangeValues.push(_.round(number, decPoint));
    number += increment;
  }
  return rangeValues;
}

export function generatePermutations(variables: Variable[]): number[] {
  const permutations = variables.slice(0, -1).reduce((possibleValues, parameter) => {
    const result = [];
    const rangeValues = getRangeValues(parameter);
    possibleValues.forEach(possibleValue => {
      rangeValues.forEach(value => {
        result.push([...possibleValue, value]);
      });
    });
    return result;
  }, [[]]);
  return permutations;
}

export function meetsUnknownVariableSpecification(currentValue: number, unknownVariable: Variable): boolean {
  // const isImaginary = containsImaginary(currentValue) && unknownVariable.containsImaginary;
  // this code will check for imaginary once that is implemented
  // if (isImaginary) {
  //   return true;
  // }
  const numCurrentValue = Number(currentValue);
  const currentValueDecPoint = calculateDecimalPlaces(numCurrentValue);
  const hasNoDecPoint = unknownVariable.decPoint === 0 && _.isInteger(numCurrentValue);
  const hasSameDecPoint = unknownVariable.decPoint > 0 && currentValueDecPoint === unknownVariable.decPoint;
  const isWithinRange = _.inRange(numCurrentValue, unknownVariable.min, unknownVariable.max);
  return (hasNoDecPoint || hasSameDecPoint) && isWithinRange;
}

export function pullRandomValue(arr: any[]) {
  const index: number = _.random(0, arr.length - 1);
  return arr.splice(index, 1)[0];
}

function getVariableValuesCount({ min, max, decPoint }): number {
  return (max - min + 1) * 10 ** decPoint;
}

function getVariablesValuesCount(variables: Variable[]): number {
  return variables.reduce((acc, variableObj) =>
    acc * getVariableValuesCount(variableObj)
    , 1);
}

export function getCollisionRisk(variables, problems): number {
  const possibleValues = getVariablesValuesCount(variables);

  return 1 - Math.pow(Math.E, (-problems * (problems - 1) / (2 * possibleValues)));
}


export function genRandomPermutation(variables: Variable[]): number[] {
  return variables.slice(0, -1).map((variableOji) => getRandomValue(variableOji));
}

function getRandomValue({ min, max, decPoint }) {
  return parseFloat(_.random(min, max, true).toFixed(decPoint));
}

export function isVariableInArray(knownVariableValues: number[], existingValues: any[]): boolean {
  return existingValues.some((existingVariableArr) =>
    knownVariableValues.every((knownValue, index) =>
      knownValue === existingVariableArr[index]
    )
  );
}


/* This method takes an object as an argument and converts into an array.
used in test only */
export function toArray(obj: object) {
  const objArr = Object.keys(obj).map(function (key) {
    return [String(key), obj[key]];
  });
  return objArr;
}
