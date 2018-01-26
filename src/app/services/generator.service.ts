import { Variable } from './../variable';
import { Injectable } from '@angular/core';
//import { mathjs } from 'mathjs';

//import './../../../node_modules/mathjs/core.js';
var math = require('mathjs');

import {
  findRange,
  createVariableObject,
  solveForVariable,
  simplifyEquation } from './../utilities';

import './../../../node_modules/nerdamer/nerdamer.core.js';
import './../../../node_modules/nerdamer/Solve.js';
import './../../../node_modules/nerdamer/Algebra.js';
import './../../../node_modules/nerdamer/Calculus.js';
import './../../../node_modules/nerdamer/Extra.js';
import { variable } from '@angular/compiler/src/output/output_ast';

declare var nerdamer: any;
declare var mathjs: any;

@Injectable()
export class GeneratorService {

  constructor() {}

  convertAnswerStringToDecimal(stringAnswer: string): any {
    let decimalAnswer = math.eval(stringAnswer);

    //let decimalAnswer: string  = mathjs(stringAnswer).eval();

    return decimalAnswer;
  }

  // For loop calculates the total number of permutations based on the range of the input parameters.
  calculateTotalPermutations(parameters: Variable[]): number {
    const permutationsTotal = parameters.slice(0, -1).reduce((permutations, parameter) => {
      const range = findRange(parameter);
      return permutations * range;
  }, 1) ;
    return permutationsTotal;
  }

  // Adds to Element based on the number of decimal places desired.
  incrementElement(variableObj: Variable): number {
    const increment = 1 / Math.pow(10, variableObj.decPoint);

    return increment;
  }

  generatePermutations(parametersArray: Variable[]): any[] {
    const answerArray = [];  // Array returned with all possible permutation sets.
    // Locates index of last variable.
    const unknownVariable = parametersArray.slice(-1)[0];
    const numberOfVariables = parametersArray.length - 1;
    const lastElementIndex = numberOfVariables - 1;
    const totalPermutations = this.calculateTotalPermutations(parametersArray);
    // Creates a template array of known variable mins
    const knownVariableMins = parametersArray.slice(0, -1).map( (parameter) => {
      return parameter.min;
    });

    for (let index = 0; index < totalPermutations; index++) {
    const  arrayValues = JSON.parse(JSON.stringify(knownVariableMins));

    // Gets knownVariablesMins ready for the next run.
      if (knownVariableMins[lastElementIndex] <= parametersArray[lastElementIndex].max) {
        knownVariableMins[lastElementIndex] += this.incrementElement(unknownVariable);
      } else {
        for (let i = lastElementIndex; i >= 0; i--) {
          // if current temp[i] value has reached the parameter maximum.
          if (knownVariableMins[i] > parametersArray[i].max) {
            knownVariableMins[i] = parametersArray[i].min; // current temp[i] set to minimum.
            knownVariableMins[i - 1] += this.incrementElement(parametersArray[i - 1]);

            // temp[i-1] (one to the left) is added.
          }
          arrayValues[i] = knownVariableMins[i];  // For loop ends with that temp[i] finalized in arrayValues.
        }
        // Adds to last element in array.
        knownVariableMins[lastElementIndex] += this.incrementElement(unknownVariable);
      }
      // For each index value, a set is pushed to the answerArray.
      answerArray.push(arrayValues);
    }
    return answerArray;
  }

  compareResultWithUserSpecification(values: any[], variables: Variable[]): boolean {
    let inRange = false;
    let sameDataType = false;
    const lastVariable = variables[variables.length - 1];
    // check if value is an integer/decimal.
    for (let i = 0; i < values.length; i++) {
      let currentValue = values[i];
    // check if value is an imaginary number
    // I am assuming that we dont check for the range if it is imaginary
      if (this.containsImaginary(currentValue) && lastVariable.containsImaginary) {
        return true;
      }
      const currentValueDecPoint = this.calculateDecimalPlaces(currentValue);
      currentValue = Number(values[i]);

      if (lastVariable.decPoint === 0 && this.isInt(currentValue)) {
        sameDataType = true;
      } else if (lastVariable.decPoint > 0 && currentValueDecPoint === lastVariable.decPoint) {
        sameDataType = true;
      }
      // check if value is in range.
      if (currentValue >= lastVariable.min && currentValue <= lastVariable.max) {
        inRange = true;
      } else {
        inRange = false;
      }
    }

    // if parameters are met, function will return true.
    if (inRange && sameDataType) {
      return true;
    } else {
      return false;
    }
  }

  getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum and the minimum is inclusive
  }

  splicePermutationSetRandomly(permutationsList: any[]): any[] {
    const splicingIndex: number = this.getRandomIntInclusive(0, permutationsList.length-1);
    const result = permutationsList.splice(splicingIndex, 1); // it returns [[...]]
    return result;
  }

  /* This method takes an object as an argument and converts into an array. */
  toArray(obj: object) {
    const objArr = Object.keys(obj).map(function(key){
      return [String(key), obj[key]];
    });
    return objArr;
  }

  isInt(input: any): boolean {
    const parsedInput = Number(input);
    if (parsedInput !== NaN && Math.floor(parsedInput) === parsedInput) {
      return true;
    }else {
      return false;
    }
  }

  containsImaginary(input: string) {
    return input.includes('i') ? true : false;
  }

  calculateDecimalPlaces(input: string): number {
    const inputArr = input.split('.');
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
      const answerArray  = solveForVariable(randomSet[0], simplifiedEquation, variables);

      for (let i = 0; i < answerArray.length; i++) {
        const currentAnswer = answerArray.slice(i, i + 1);
        // Check if it is valid set or not as per to the user's condition
        if (this.compareResultWithUserSpecification(currentAnswer, variables)) {
          const variableToSolve = variables[variables.length - 1];
          if (variableToSolve.answerMeetsAllSpecification === false) {
            randomSet[0].push(answerArray);
            result.push(randomSet[0]);
            break;
          }
          randomSet[0].push(currentAnswer);
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
