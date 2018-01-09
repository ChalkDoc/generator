import { Injectable } from '@angular/core';
import { Variable } from '../variable';

import './../../../node_modules/nerdamer/nerdamer.core.js';
import './../../../node_modules/nerdamer/Solve.js';
import './../../../node_modules/nerdamer/Algebra.js';
import './../../../node_modules/nerdamer/Calculus.js';
import './../../../node_modules/nerdamer/Extra.js';

declare var nerdamer: any;

@Injectable()
export class GeneratorService {

  constructor() { }

  findRange(max: number, min: number, decPoint: number): number {
    let range = (max - min) * (Math.pow(10, decPoint)) + 1;

    return range;
  }

  /** For loop calculates the total number of permutations based on the range
        of the input parameters.  **/
  calculateTotalPermutations(parameters: Variable[], numOfVars: number): number {
    let permutations = 1;

    for (let i = 0; i< numOfVars; i++) {
      /** Range includes subtracting minimum from maximu and adding 1
       * to include both the minimum and maximum numbers. */
      let range = this.findRange(parameters[i].max, parameters[i].min, parameters[i].decPoint);
      permutations *= range;
    }

    return permutations;
  }

  // Method initializes temp[] array with all the minimum parameters
  initializeTempArray(parameters: Variable[], numOfVars: number): number[] {
    let temp = [];

    for (let i = 0; i < numOfVars; i++) {
      temp[i] = parameters[i].min;
    }

    return temp;
  }

  // Method sets arrayValues to previous temp[] values
  
  setArrayValuesToTemp(numOfVars: number, temp: number[]): number[] {
    let arrayValues = [];
    
    for (let i = 0; i < numOfVars; i++) {
      arrayValues[i] = temp[i];
    }

    return arrayValues;
  }

  // Adds to Element based on the number of decimal places desired.
  incrementElement(decPoint: number): number {
    let increment = 1/Math.pow(10, decPoint);

    return increment;
  }

  /* This method inputs parameters of variables with min and max values and
    generates sets that include all the permutations of these variables. */
  generatePermutations(parametersArray: Variable[]): any[] {
    let temp = []; // Stores running array of values for each index place.
    let answerArray = [];  // Array returned with all possible permutation sets.
    // Locates index of last variable.
    let numberOfVariables = parametersArray.length - 1;
    let lastElementIndex = numberOfVariables - 1;

    let totalPermutations = this.calculateTotalPermutations(parametersArray, numberOfVariables);
    
    temp = this.initializeTempArray(parametersArray, numberOfVariables);

    /** This method is run as a for loop through all the calculated
        Permutations.  The index value is only used in order to track when
        all sets are generated. **/
    for (var index = 0; index < totalPermutations; index++) {
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
      }
      else {
        for (var i = lastElementIndex; i >= 0; i--) {
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

  createVariableObject(randomSet: number[], variables: Variable[]): object {
    const variablesObject = {};
    for (let i = 0; i < variables.length - 1; i++) {
      const objectName = variables[i].name;
      variablesObject[objectName] = randomSet[i];
    }
    return variablesObject;
  }

  reverseLaTex(input) {
    let arr = [];
    let reversedLaTex = "";
    let inputArr = input.split(/[+\s]/);
    let n = inputArr.length;
    if (inputArr[n-2] === "=") {
      for(var i = inputArr.length-3; i>=0; i--) {
        if(inputArr[i].length !== 0) {
          arr.push(inputArr[i]);
        }
      }
    reversedLaTex = arr.join(' + ');
    reversedLaTex+= " = 0";
    } else {
      for(var i = inputArr.length-1; i>=0; i--) {
        if(inputArr[i].length !== 0) {
          arr.push(inputArr[i]);
        }
      }
      reversedLaTex = arr.join(' + ');
    }
    return reversedLaTex;
  }

  convertProblemToLaTeX(parametersArray, equation, solutionSet): string {
    let variablesObject = this.createVariableObject(solutionSet, parametersArray);

    let nerdamerAnswer = nerdamer(equation, variablesObject).toString();
    let laTeXAnswer = nerdamer.convertToLaTeX(nerdamerAnswer);

    let reversedLaTeX = this.reverseLaTex(laTeXAnswer);

    return laTeXAnswer;
  }

  solveForVariable(randomSet: number[], simplifiedEquation: string, variables: Variable[]): any[] {
    let answerArray: any[] = [];
    
    let variablesObject = this.createVariableObject(randomSet, variables);

    let answer: string = nerdamer(simplifiedEquation, variablesObject);
    //console.log('answer: ' + answer);
    
    let decimalAnswer: string  = nerdamer(answer).text('decimal');
    //console.log('decimalAnswer:' + decimalAnswer);    
    
    let decimalAnswerArray: string[] = decimalAnswer.split(/[\[,\]]/);
    //console.log('decimalAnswerArray:' + decimalAnswerArray);
    
    for (let i = 0; i < decimalAnswerArray.length; i++) {
      if (decimalAnswerArray[i] !== '') {
        answerArray.push(decimalAnswerArray[i]);
      }
    }
    
    return answerArray;
  }

  // This method simplifies the equation and returns an expression
  simplifyEquation(equation: string, variableToSolve: string): string {
    const simplifiedEquation = nerdamer.solve(equation, variableToSolve);
    return simplifiedEquation.toString();
  }

  compareResultWithUserSpecification(values: any[], variables: Variable[]): boolean {
    let inRange = false;
    let sameDataType = false;
    // tslint:disable-next-line:max-line-length
    const lastVariable = variables[variables.length - 1]; // the last variable in the variables array. we are making an assumption that we are solving for the last variable

    // check if value is an integer/decimal.
    for (let i = 0; i < values.length; i++) {
      const currentValue = values[i];

    // check if value is an imaginary number
    // I am assuming that we dont check for the range if it is imaginary
      if (this.isImaginary(currentValue) && lastVariable.isImaginary) {
        return true;
      }

      if (lastVariable.decPoint === 0 && this.isInt(currentValue)) {
        sameDataType = true;
      } else if (lastVariable.decPoint > 0 && this.calculateDecimalPlaces(currentValue) > 0) {
        sameDataType = true;
      }
      // check if value is in range.
      if (currentValue >= lastVariable.min && currentValue <= lastVariable.max) {
        inRange = true;
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
    let splicingIndex: number = this.getRandomIntInclusive(0, permutationsList.length-1);
    let result = permutationsList.splice(splicingIndex, 1); // it returns [[...]]
    return result;
  }

  toArray(obj) {
    let objArr = Object.keys(obj).map(function(key){
      return [String(key), obj[key]];
    });
    return objArr;
  }

  isInt(input: number): boolean {
    if (Math.floor(input) === input) {
      return true;
    }else {
      return false;
    }
  }

  isImaginary(input: string ) {
    if (input.includes('i')) {
      return true;
    } else {
      return false;
    }
  }

  calculateDecimalPlaces(input: number): number {
    const inputArr = input.toString().split('.');
    return inputArr[1].length;
  }

  generateRangeOfValues(variable: Variable): number[] {
    let values = [];
    let countingValue = variable.min;
    let range = this.findRange(variable.max, variable.min, variable.decPoint);

    for (let i = 0; i < range; i++) {
      //countingValue.toFixed(variable.decPoint);
      values.push(countingValue.toFixed(variable.decPoint));
      countingValue += 1 / (Math.pow(10, variable.decPoint));
    }

    return values;
  }

  createTestSet(valueList: any[]): number[] {
    let testSet = [];
    let tempSetArray = [];

    for (let i = 0; i < valueList.length; i++) {
      let randomIndex = Math.floor(Math.random() * valueList[i].length);
      testSet[i] = valueList[i][randomIndex];
    }

    return testSet;
  }

  solveForDecimalVariable(set: number[], expression: string, variables: Variable[]): any[] {
    let answerArray: any[] = [];
    
    let variablesObject = this.createVariableObject(set, variables);

    let answer: string = nerdamer(expression, variablesObject);
    //console.log('answer: ' + answer);
    
    let decimalAnswer: string  = nerdamer(answer).text('decimal');
    //console.log('decimalAnswer:' + decimalAnswer);    
    
    let decimalAnswerArray: string[] = decimalAnswer.split(/[\[,\]]/);
    //console.log('decimalAnswerArray:' + decimalAnswerArray);
    
    for (let i = 0; i < decimalAnswerArray.length; i++) {
      if (decimalAnswerArray[i] !== '') {
        answerArray.push(decimalAnswerArray[i]);
      }
    }
    
    return answerArray;
  }

  // Method controls valid table for problems that have a decimal answer
  generateDecimalVariablesPermutations(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    let result = [];
    let valueList = [];
    let numberOfLists = variables.length - 1;  // Will take away last variable.
    let count = 0;
    let expression = this.simplifyEquation(equation, variables[variables.length - 1].name);

    for (let i = 0; i < numberOfLists; i++) {
      valueList[i] = this.generateRangeOfValues(variables[i]);
    }

    while (count < numberOfProblems) {
      let testSet: any[];
      testSet = this.createTestSet(valueList);

      let answerArray = this.solveForVariable(testSet, expression, variables);
      console.log(answerArray);
      let realAnswer = nerdamer(answerArray);
      console.log(realAnswer);

      // This for loop takes into account the fact that the answerArray is an array.
      // Caution:  The current implementation will potentially produce two of the same problem!!!
      for (let i = 0; i < answerArray.length; i++) {
        testSet.push(answerArray[i]);
        //console.log(testSet);
        count++;
      }
      result.push(testSet);
    }

    return result;
  }

  
  generateValidVariableCombination(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    // From the 'permutationsList' generate a random set and save it in 'randomSet' varialble

    // Check if it is valid set or not as per to the user's condition
    // If it is valid then push it to the 'result' array
    const result: any[] = [];
    const permutationsList: any[] = this.generatePermutations(variables);

    // tslint:disable-next-line:max-line-length
    let simplifiedEquation = this.simplifyEquation(equation, variables[variables.length - 1].name); // This runs only once per 'permutationsList', and we use the 'simplifiedEquation' to check the validity of each 'randomSet'.
    simplifiedEquation = nerdamer(simplifiedEquation).text('decimal');

    while (result.length !== numberOfProblems) {
      const randomSet: any[] = this.splicePermutationSetRandomly(permutationsList);  // splice a permutation set randomly

      const answerArray  = this.solveForVariable(randomSet[0], simplifiedEquation, variables);
      // console.log('answwer array');
      // console.log(answerArray);


      if (this.compareResultWithUserSpecification(answerArray, variables)) {
        randomSet.push(answerArray);
        result.push(randomSet);
      }
    }

    return result;
  }
}
