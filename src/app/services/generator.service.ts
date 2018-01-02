import { Injectable } from '@angular/core';
import { Variable } from '../variable';

import './../../../node_modules/nerdamer/Solve.js';
import './../../../node_modules/nerdamer/Algebra.js';
import './../../../node_modules/nerdamer/Calculus.js';
import './../../../node_modules/nerdamer/Extra.js';

declare var nerdamer: any;

var parameters = [{name: 'a'}, {name: 'b'}];
var equation = 'a*x^2 + b*x =0';
var set = [1, 2];
console.log(parameters, equation, set);

// var answer = convertProblemToLaTeX(parameters, equation, set);
// console.log(answer);

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

  // Method sets arrayValues to previous temp[] values.
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

  /* This method contains the logic to count through the possible permutations
    based on the given parameters. */
  createAnswerArray(parameters: Variable[], temp: number[], arrayValues: number[], numOfVars: number): any[] {
    let answerArray =[];
    let lastElementIndex = numOfVars - 1;
    /** If statement is true if the last element has not reached the maximum
        value.  It causes the last element to increase to the next in order. **/
    /** Else takes care of the situation where elements other than the last
        one (right-most) need to be changed. Index i starts on the right-most 
        element and works to the left.  If this addition brings the temp[i-1] to 
        above the maximum, this will be taken care in the next iteration of the for loop.**/

    // Gets temp ready for the next run.
    if (temp[lastElementIndex] <= parameters[lastElementIndex].max) {
      temp[lastElementIndex] += this.incrementElement(parameters[lastElementIndex].decPoint);
    }
    else {
      for (var i = lastElementIndex; i >= 0; i--) {
        // if current temp[i] value has reached the parameter maximum.
        if (temp[i] > parameters[i].max) {
          temp[i] = parameters[i].min; // current temp[i] set to minimum.
          temp[i - 1] += this.incrementElement(parameters[i - 1].decPoint);

          // temp[i-1] (one to the left) is added.
        }
        arrayValues[i] = temp[i];  // For loop ends with that temp[i] finalized in arrayValues.
      }
      // Adds to last element in array.
      temp[lastElementIndex] += this.incrementElement(parameters[lastElementIndex].decPoint);
    }
    // For each index value, a set is pushed to the answerArray.
    answerArray.push(arrayValues);

    return answerArray;
  }

  /** This method inputs parameters of variables with min and max values and
      generates sets that include all the permutations of these variables. **/
  generatePermutations(parametersArray: Variable[]): any[] {
    let temp = []; // Stores running array of values for each index place.
    let answerArray = [];  // Array returned with all possible permutation sets.
    // Locates index of last variable.
    let numberOfVariables = parametersArray.length-1;
    let lastElementIndex = numberOfVariables - 1;

    let totalPermutations = this.calculateTotalPermutations(parametersArray, numberOfVariables);
    console.log(totalPermutations);
    
    temp = this.initializeTempArray(parametersArray, numberOfVariables);

    /** This method is run as a for loop through all the calculated
        Permutations.  The index value is only used in order to track when
        all sets are generated. **/
    for (var index = 0; index < totalPermutations; index++) {
      var arrayValues = [];  // This will be pushed to final answerArray.

      /** If statement is true if the last element has not reached the maximum
        value.  It causes the last element to increase to the next in order. **/
    /** Else takes care of the situation where elements other than the last
        one (right-most) need to be changed. Index i starts on the right-most 
        element and works to the left.  If this addition brings the temp[i-1] to 
        above the maximum, this will be taken care in the next iteration of the for loop.**/

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

  formVariablesObject(parameters: any[], set: number[]): any[] {
    let variablesObject = [];
    
      for (let i = 0; i < parameters.length; i++) {
        variablesObject[parameters[i].name] = set[i];
      }

    return variablesObject;
  }

  convertProblemToLaTeX(parametersArray, equation, solutionSet): string {
    let variablesObject = this.formVariablesObject(parametersArray, solutionSet);

    let laTeXAnswer = nerdamer.convertToLaTeX(equation, variablesObject);

    return laTeXAnswer;
  }

  calculateLastVariable(parametersArray, testSet, expression) {
    let variablesObject = this.formVariablesObject(parametersArray, testSet);
  
    let lastVariable = nerdamer(expression, variablesObject).toString();
    console.log(lastVariable);
  
    return lastVariable;
  }

  // This method returns an expression based on the variable solved for.
  solveForExpression(equation, variable): string {
    let result = nerdamer.solve(equation, variable).toString();
    
    return result;
  }

  isValid(arrayOfCombinations: any[]) {
    // eg: arrayOfCombinations= [1,1,1,1];
    //use nerdamer to determine and user specification to determine the validity
    return true;
  }

  compareResultWithUserSpecification(value, parameters): boolean {
    // check if value is an integer/decimal.
    let position = parameters.length - 1;
    if (parameters[position].decPoint > 0) {
      if (Math.round(value) != value) {
        return false;
      }
    }

    // check if value is in range.
    if (value < parameters[position].min || value > parameters[position].max) {
      return false;
    }
    
    return true; // if parameters are met, function will return true.
  }

  checkValues(randomSet: number[], numberOfProblemsToGenerate: number, variable: Variable): boolean{
    let result: boolean = false;
    // Put the logic that checks the validity of the 'randomSet'
    // Determine which variable to calculate for
    // call nerdamer.solve() to get the simplified form;
    // call nerdamer(dimplified form of equation) to get the result
    let equation: string = "ax^2+bx+c=0"; //

    // let answerArray = this.solveForVariable(equation, variable, 1);
    // result = this.compareResultWithUserSpecification(answerArray, variable);
    // compare the 'answerArray' with the users specification --- we need to make a method
    // if it satisfies the user specification, then the 'randomSet' is valid, which means we return true;

    return result;
  }

  popFromList(list, index) {
    list.splice(index, 1);
  }

  findRandomIndex(index: number): number {
    return Math.random() * index;
  }

    // This method moves the given variable parameters to the last variable position.
  setLastVariable(index, parameters) {
    parameters.push(parameters[index]);
    parameters.splice(index, 1);
  }  

  // Determines how many solutions are created when solving for each variable.
  calculateComplexityFactor(variable, equation) {
    let count = this.solveForExpression(variable, equation).length;
   
    return count;
  }

  /** Determine the best variable for the computer to calculate. Perform nerdamer solve
   * method on each variable in order to determine complexity. **/
  determineCalculationVariable(parameters, equation) {
    let complexityFactor = 1;
    let index = 0;

    for (let i; i < parameters.length; i++) {
      let factor = this.calculateComplexityFactor(parameters[i].name, equation);

      if (factor <= complexityFactor) {
        index = i;
      }
    }

    return index;
  }

  // Method examines parameters to determine how many variables can be decimals.
  calculateTotalDecimals(parameters) {
    let decimals = 0;
    for (let i = 0; i < parameters.length; i++) {
      if (parameters[i].decPoint > 0) {
        decimals++;
      }
    }

    return decimals;
  }

  createValidList(expression: string, variables: Variable[], permutationsList: any[], index: number): any[] {
    let validList: any[] = [];
  
  // Feed each testSet into an expression in order to evaluate answer.
    for (let i = 0; i < index; i++) {
      let randomIndex = this.findRandomIndex(permutationsList.length);
      let testSet = permutationsList[randomIndex];
      let lastVariable = this.calculateLastVariable(variables, testSet, expression);
      
      // Check validity of answer based on parameters (range and integer).
      if (this.compareResultWithUserSpecification(lastVariable, variables)) {
        testSet.push(lastVariable);  // Send valid array to valid list.
        validList.push(testSet);
      }
      
      // Pop set out of permutations list.
      this.popFromList(permutationsList, randomIndex);
    }

    return validList;
  }

  generateValidResults(equation: string, variables: Variable[], numberOfProblemsToGenerate: number): any[] {
    let result: any[];

    // Solve Equation for a variable to make an expression.
    let variable = 'x';
    let expression = this.solveForExpression(equation, variable);

    /* Returns array of permutation sets.  Generate a random 
        testSet based on parameters. (Subtract last variable.) */
    let permutationsList: any[] = this.generatePermutations(variables);

    // Go through process to find list of valid sets.
    result = this.createValidList(expression, variables, permutationsList, numberOfProblemsToGenerate);

    return result;
  }

  // Determines solving course of action based on variables and decimals.
  solverDecisionTree(parameters) {
    let totalDecimals = this.calculateTotalDecimals(parameters);

    if (totalDecimals == 0) {
      // All variables are to be integers.  Use permutations table.
    }
    else if (totalDecimals < parameters.length){
      // Some variable parameters are decimals and some are integers.
    }
    else {
      // All variable parameters are decimals.
    }
  }

}
