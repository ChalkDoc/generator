import { Variable } from './variable';
import { variable } from '@angular/compiler/src/output/output_ast';
import * as _ from 'lodash';

declare var nerdamer: any;


export function containsImaginary(input: string): boolean {
  return input.includes('i');
}

export function createKnownValuesObject(randomSet: number[], variables: Variable[]): object {
  const variableNamesArray = _.map(variables.slice(0, -1), 'name');
  return _.zipObject(variableNamesArray, randomSet);
}

export function solveForUnknownVariable(randomSet: number[], simplifiedEquation: string, variables: Variable[]): any[] {
  const answerArray: any[] = [];
  const variableValuesObject = createKnownValuesObject(randomSet, variables);
  const answer: string = nerdamer(simplifiedEquation, variableValuesObject);
  // console.log(answer);
  const decimalAnswer: string = nerdamer(answer).text('decimal');
  const decimalAnswerArray: string[] = decimalAnswer.split(/[\[,\]]/);

  for (let i = 0; i < decimalAnswerArray.length; i++) {
    if (decimalAnswerArray[i] !== '') {
      console.log(decimalAnswerArray[i]);
      answerArray.push(decimalAnswerArray[i]);
    }
  }
  return answerArray;
}

/* This method simplifies an algebric equation and returns an expression */
export function simplifyEquation(equation: string, variableToSolve: string): string {
  return nerdamer.solve(equation, variableToSolve).toString();
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

export function meetsUnknownVariableSpecification(currentValue: string, unknownVariable: Variable): boolean {
  const isImaginary = containsImaginary(currentValue) && unknownVariable.containsImaginary;
  // this code will check for imaginary once that is implemented
  if (isImaginary) {
    return true;
  }
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


/* This method takes an object as an argument and converts into an array.
used in test only */
export function toArray(obj: object) {
  const objArr = Object.keys(obj).map(function (key) {
    return [String(key), obj[key]];
  });
  return objArr;
}
