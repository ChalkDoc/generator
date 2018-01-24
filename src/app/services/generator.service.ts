import { Variable } from './../variable';
import { Injectable } from '@angular/core';

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

declare var nerdamer: any;

@Injectable()
export class GeneratorService {

  constructor() {}

  // For loop calculates the total number of permutations based on the range of the input parameters.
  calculateTotalPermutations(parameters: Variable[], numOfVars: number): number {
    let permutations = 1;

    for (let i = 0; i < numOfVars; i++) {
      // Range includes subtracting minimum from maximu and adding 1 to include both the minimum and maximum numbers.
      const range = findRange(parameters[i].max, parameters[i].min, parameters[i].decPoint);
      permutations *= range;
    }

    return permutations;
  }

  // Initializes temp[] array with all the minimum parameters
  initializeTempArray(parameters: Variable[], numOfVars: number): number[] {
    const temp = [];

    for (let i = 0; i < numOfVars; i++) {
      temp[i] = parameters[i].min;
    }

    return temp;
  }

  // Method sets arrayValues to previous temp[] values

  setArrayValuesToTemp(numOfVars: number, temp: number[]): number[] {
    const arrayValues = [];

    for (let i = 0; i < numOfVars; i++) {
      arrayValues[i] = temp[i];
    }

    return arrayValues;
  }

  // Adds to Element based on the number of decimal places desired.
  incrementElement(decPoint: number): number {
    const increment = 1 / Math.pow(10, decPoint);

    return increment;
  }

  /* This method inputs parameters of variables with min and max values and
    generates sets that include all the permutations of these variables. */
  generatePermutations(parametersArray: Variable[]): any[] {
    let temp = []; // Stores running array of values for each index place.
    const answerArray = [];  // Array returned with all possible permutation sets.
    // Locates index of last variable.
    const numberOfVariables = parametersArray.length - 1;
    const lastElementIndex = numberOfVariables - 1;

    const totalPermutations = this.calculateTotalPermutations(parametersArray, numberOfVariables);
    console.log(totalPermutations);

    temp = this.initializeTempArray(parametersArray, numberOfVariables);

    /** This method is run as a for loop through all the calculated
        Permutations.  The index value is only used in order to track when
        all sets are generated. **/
    for (let index = 0; index < totalPermutations; index++) {
      let arrayValues = [];  // This will be pushed to final answerArray.
      /** If statement is true if the last element has not reached the maximum
        value.  It causes the last element to increase to the next in order. **/
    /** Else takes care of the situation where elements other than the last
        one (right-most) need to be changed. Index i starts on the right-most
        element and works to the left.  If this addition brings the temp[i-1] to
        above the maximum, this will be taken care in the next iteration of the for loop.**/

      arrayValues = this.setArrayValuesToTemp(numberOfVariables, temp);

    // Gets temp ready for the next run.
      if (temp[lastElementIndex] <= parametersArray[lastElementIndex].max) {
        temp[lastElementIndex] += this.incrementElement(parametersArray[lastElementIndex].decPoint);
      } else {
        for (let i = lastElementIndex; i >= 0; i--) {
          // if current temp[i] value has reached the parameter maximum.
          if (temp[i] > parametersArray[i].max) {
            temp[i] = parametersArray[i].min; // current temp[i] set to minimum.
            temp[i - 1] += this.incrementElement(parametersArray[i - 1].decPoint);

            // temp[i-1] (one to the left) is added.
          }
          arrayValues[i] = temp[i];  // For loop ends with that temp[i] finalized in arrayValues.
        }
        // Adds to last element in array.
        temp[lastElementIndex] += this.incrementElement(parametersArray[lastElementIndex].decPoint);
      }
      // For each index value, a set is pushed to the answerArray.
      answerArray.push(arrayValues);
    }
    return answerArray;
  }

  // tslint:disable-next-line:max-line-length
  /* It compares value with the user's varialble specfication. It takes array of any and array of variable and return true if all conditions are met otherwise false. */
  compareResultWithUserSpecification(values: any[], variables: Variable[]): boolean {
    let inRange = false;
    let sameDataType = false;
    // tslint:disable-next-line:max-line-length
    const lastVariable = variables[variables.length - 1]; // the last variable in the variables array. we are making an assumption that we are solving for the last variable

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

  /* Generate a random intiger between two integers(inclusive). The method takes the min and max boundaries as an argument. */
  getRandomIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum and the minimum is inclusive
  }

  /* It cuts out an element from an array at a random position. It takes an array of any as an argument. */
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

  /* Checks if an input is an integer or not after being parsed to number. It takes a string or a number as an argument. */
  isInt(input: any): boolean {
    const parsedInput = Number(input);
    if (parsedInput !== NaN && Math.floor(parsedInput) === parsedInput) {
      return true;
    }else {
      return false;
    }
  }

  /* Checks if a string contains 'i' which is an indirect check of a number if it is imaginary or not. It takes a string as an argument. */
  containsImaginary(input: string) {
    if (input.includes('i')) {
      return true;
    } else {
      return false;
    }
  }

  /* Takes a number as a string and calculates the number of decimal places. */
  calculateDecimalPlaces(input: string): number {
    const inputArr = input.split('.');
    if (inputArr.length === 1) {
      return 0;
    } else {
      return inputArr[1].length;
    }
  }

  generateRangeOfValues(variable: Variable): number[] {
    const values = [];
    let countingValue = variable.min;
    const range = findRange(variable.max, variable.min, variable.decPoint);

    for (let i = 0; i < range; i++) {
      // countingValue.toFixed(variable.decPoint);
      values.push(countingValue.toFixed(variable.decPoint));
      countingValue += 1 / (Math.pow(10, variable.decPoint));
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

  // Method controls valid table for problems that have a decimal answer
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

  // tslint:disable-next-line:max-line-length
  /* Generates combination of numbers(including complex numbers) that are valid as per the user's specification. It takes array of variables, the number of combination to generate and a string of  algebric eaution as an argument.  Returns an array of any.*/
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
        const currentAnswer = answerArray.slice(i, i+1);
        // Check if it is valid set or not as per to the user's condition
        if (this.compareResultWithUserSpecification(currentAnswer, variables)) {
          let variableToSolve = variables[variables.length-1];
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
