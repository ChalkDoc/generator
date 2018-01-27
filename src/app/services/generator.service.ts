import { Variable } from './../variable';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
  findRange,
  createVariableObject,
  solveForVariable,
  simplifyEquation,
  getRangeValues
} from './../utilities';

@Injectable()
export class GeneratorService {

  constructor() { }

  generatePermutations(parametersArray: Variable[]): number[] {
    const answerArray = parametersArray.slice(0, -1).reduce((possibleValues, parameter) => {
      const result = [];
      const rangeValues = getRangeValues(parameter);
      possibleValues.forEach(possibleValue => {
        rangeValues.forEach(value => {
          result.push([...possibleValue, value]);
        });
      });
      return result;
    }, [[]]);
    return answerArray;
  }

  compareResultWithUserSpecification(currentValue: string, unknownVariable: Variable): boolean {
    const isImaginary = this.containsImaginary(currentValue) && unknownVariable.containsImaginary;
    // this code will check for imaginary once that is implemented
    if (isImaginary) {
      return true;
    }

    const numCurrentValue = Number(currentValue);
    const currentValueDecPoint = this.calculateDecimalPlaces(numCurrentValue);
    const hasNoDecPoint = unknownVariable.decPoint === 0 && _.isInteger(numCurrentValue);
    const hasSameDecPoint = unknownVariable.decPoint > 0 && currentValueDecPoint === unknownVariable.decPoint;
    const isWithinRange = _.inRange(numCurrentValue, unknownVariable.min, unknownVariable.max);

    return (hasNoDecPoint || hasSameDecPoint) && isWithinRange;

  }

  splicePermutationSetRandomly(permutationsList: any[]): any[] {
    const splicingIndex: number = _.random(0, permutationsList.length - 1);
    const result = permutationsList.splice(splicingIndex, 1); // it returns [[...]]
    return result;
  }

  containsImaginary(input: string) {
    return input.includes('i');
  }

  calculateDecimalPlaces(input: string | number): number {
    const inputArr = `${input}`.split('.');
    return inputArr.length === 1 ? 0 : inputArr[1].length;
  }

  generateRangeOfValues(variableObj: Variable): number[] {
    const values = [];
    let countingValue = variableObj.min;
    const range = findRange(variableObj);

    for (let i = 0; i < range; i++) {
      // countingValue.toFixed(variable.decPoint);
      values.push(countingValue.toFixed(variableObj.decPoint));
      countingValue += 1 / (Math.pow(10, variableObj.decPoint));
    }

    return values;
  }

  createTestSet(valueList: any[]): number[] {
    const testSet = [];
    const tempSetArray = [];

    for (let i = 0; i < valueList.length; i++) {
      const randomIndex = Math.floor(Math.random() * valueList[i].length);
      testSet[i] = valueList[i][randomIndex];
    }

    return testSet;
  }

  generateDecimalVariablesPermutations(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    const result = [];
    const valueList = [];
    const numberOfLists = variables.length - 1;  // Will take away last variable.
    let count = 0;
    const expression = simplifyEquation(equation, variables[variables.length - 1].name);

    for (let i = 0; i < numberOfLists; i++) {
      valueList[i] = this.generateRangeOfValues(variables[i]);
    }

    while (count < numberOfProblems) {
      let testSet: any[];
      testSet = this.createTestSet(valueList);

      const answerArray = solveForVariable(testSet, expression, variables);
      console.log(answerArray);

      // This for loop takes into account the fact that the answerArray is an array.
      // Caution:  The current implementation will potentially produce two of the same problem!!!
      for (let i = 0; i < answerArray.length; i++) {
        testSet.push(answerArray[i]);
        // console.log(testSet);
        count++;
      }
      result.push(testSet);
    }

    return result;
  }

  generateValidVariablePermutations(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    const result: any[] = [];
    const permutationsList: any[] = this.generatePermutations(variables);
    // This runs only once per 'permutationsList', and we use the 'simplifiedEquation' to check the validity of each 'randomSet'.
    const simplifiedEquation = simplifyEquation(equation, variables[variables.length - 1].name);

    while (result.length !== numberOfProblems && permutationsList.length > 0) {
      // From the 'permutationsList' generate a random set and save it in 'randomSet' varialble
      const randomSet: any[] = this.splicePermutationSetRandomly(permutationsList);
      const answerArray = solveForVariable(randomSet[0], simplifiedEquation, variables);
      for (let i = 0; i < answerArray.length; i++) {
        const currentAnswer = answerArray[i];
        // Check if it is valid set or not as per to the user's condition
        if (this.compareResultWithUserSpecification(currentAnswer, variables[variables.length - 1])) {
          randomSet[0].push(answerArray);
          result.push(randomSet[0]);
        }
      }
    }

    return result;
  }
  // Method examines parameters to determine how many variables can be decimals.
  calculateTotalDecimals(variables) {
    let decimals = 0;
    for (let i = 0; i < variables.length; i++) {
      if (variables[i].decPoint > 0) {
        decimals++;
      }
    }

    return decimals;
  }
  // Determines solving course of action based on variables and decimals.
  solverDecisionTree(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    const totalDecimals = this.calculateTotalDecimals(variables);
    let result = [];

    if (totalDecimals === 0) {
      // All variables are to be integers.  Use permutations table.
      result = this.generateValidVariablePermutations(variables, numberOfProblems, equation);

      return result;
    } else {
      // All variable parameters are decimals.
      result = this.generateDecimalVariablesPermutations(variables, numberOfProblems, equation);

      return result;
    }
  }
}
