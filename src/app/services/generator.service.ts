import { Injectable } from '@angular/core';
import { Variable } from '../variable';

import './../../../node_modules/nerdamer/Solve.js';
import './../../../node_modules/nerdamer/Algebra.js';
import './../../../node_modules/nerdamer/Calculus.js';
import './../../../node_modules/nerdamer/Extra.js';

declare var nerdamer: any;

@Injectable()
export class GeneratorService {

  constructor() { }


  /** This method inputs parameters of variables with min and max values and
      generates sets that include all the permutations of these variables. **/
// IN PROGRESS FOR DECIMAL ROBERT
  generatePermutations(parametersArray: Variable[]): any[] {
    let temp = []; // Stores running array of values for each index place.
    let answerArray = [];  // Array returned with all possible permutation sets.
    // Locates index of last variable.
    let numberOfVariables = parametersArray.length-1;

    /** For loop calculates the total number of permutations based on the range
        of the input parameters.  **/
    var totalPermutations = 1;
    for (var i = 0; i < numberOfVariables; i++) {
      /** Range includes subtracting minimum from maximum and adding 1 to
        include the minimum and maximum numbers **/
    	var range = (parametersArray[i].max - parametersArray[i].min) *
      ((Math.pow(10, parametersArray[i].decPoint))) + 1;
    	totalPermutations *= range;
      console.log(totalPermutations);
    }
    //totalPermutations = 500000;

    // Intializes temp[] array with all the minimum parameters.
    for (var i = 0; i < numberOfVariables; i++) {
    	temp[i] = parametersArray[i].min;
    }

    /** This method is run as a for loop through all the calculated
        Permutations.  The index value is only used in order to track when
        all sets are generated. **/
    for (var index = 0; index < totalPermutations; index++) {
    	var arrayValues = [];  // This will be pushed to final answerArray.

      // Sets arrayValues to previous temp[] values.
      for (var i = 0; i < numberOfVariables; i++) {
      	arrayValues[i] = temp[i];
      }

      /** If statement is true if the last element has not reached the maximum
          value.  It causes the last element to increase to the next in
          order. **/
          // Gets temp ready for the next run.
      if (temp[numberOfVariables - 1] <= parametersArray[numberOfVariables - 1].max) {
        temp[numberOfVariables - 1]
        += 1/Math.pow(10, parametersArray[numberOfVariables - 1].decPoint);
        //temp[numberOfVariables - 1] = temp[numberOfVariables - 1].toFixed(parametersArray[numberOfVariables - 1].decPoint);
      }

      /** Else takes care of the situation where elements other than the last
          one (right-most) need to be changed.  **/
      else {
        /** Index i starts on the right-most element and works to the left.
            If this addition brings the temp[i-1] to above the maximum,
            this will be taken care in the next iteration of the for loop.**/
        for (var i = numberOfVariables - 1; i >= 0; i--) {
          // if current temp[i] value has reached the parameter maximum.
          if (temp[i] > parametersArray[i].max) {
    				temp[i] = parametersArray[i].min; // current temp[i] set to minimum.
            temp[i - 1]
            += 1/Math.pow(10, parametersArray[i - 1].decPoint);

            //temp[i - 1] = temp[i - 1].toFixed(parametersArray[i - 1].decPoint);
            // temp[i-1] (one to the left) is added.
          }
          arrayValues[i] = temp[i];  /** For loop ends with that temp[i]
          finalized in arrayValues. **/
        }
        // Adds to last element in array.
        temp[numberOfVariables - 1]
        += 1/Math.pow(10, parametersArray[numberOfVariables - 1].decPoint);
        //temp[numberOfVariables - 1] = temp[numberOfVariables - 1].toFixed(parametersArray[numberOfVariables - 1].decPoint);
      }
      // For each index value, a set is pushed to the answerArray.
      answerArray.push(arrayValues);
    }
    return answerArray;
  }

  calculateLastVariable(parametersArray, testSet, expression) {
    let variablesObject = [];
  
    for (let i = 0; i < parametersArray.length; i++) {
      variablesObject[parametersArray[i].name] = testSet[i];
    }
  
    let lastVariable = nerdamer(expression, variablesObject).toString();
    console.log(lastVariable);
  
    return lastVariable;
  }

  solveForExpression(equation, variable): string {
    let result = nerdamer.solve(equation, variable).toString();
    
    return result;
  }

  solveForVariable(equation: string, variable: string, decimalPlaces: number): any[] {
    let result = nerdamer.solve(equation, variable).toString();
    let answerValues = nerdamer(result);
    console.log(answerValues);
    let answerArray = [];
    let expressionValue;

    for (let i = 0; i < answerValues.symbol.elements.length; i++) {
      let expressionValue = answerValues.symbol.elements[i].value;
      console.log(expressionValue);
      if (expressionValue === '#'|| expressionValue === 'i') {
        let numerator = answerValues.symbol.elements[i].multiplier.num.value;
        let denominator = answerValues.symbol.elements[i].multiplier.den.value;
        expressionValue = numerator/denominator;
        expressionValue = expressionValue.toFixed(decimalPlaces);
      }
      else {
        expressionValue = nerdamer(expressionValue).text('decimals');
      }
      answerArray.push(expressionValue);
    }
    return answerArray;
  }

  //problemsToGenerate should be an int, arrayOfCombinations is assumed to be an array of arrays
  /* solveForMin and solveForMax are the minimum and maximum allowed values for the variable to be solved for */
  /*checkValues(problemsToGenerate, arrayOfCombinations, solveForMin, solveForMax) {
   	let validCombos = [];
    while (arrayOfCombinations.length > 0 && validCombos.length < problemsToGenerate) {
    	let i = Math.floor(Math.random() * arrayOfCombinations.length);

      // problemSolver should take in an array of values, use the library to solve for the last variable, and output the value of that variable
      let x = problemSolver(arrayOfCombinations[i]);

      var currentCombination = arrayOfCombinations.pop();
      if(this.isValid(currentCombination)) {
        validCombos.push(currentCombination);
      }

      if(x >= solveForMin && x <= solveForMax) {
      	arrayOfCombinations[i].push(x);
        validCombos.push(arrayOfCombinations[i]);
      }
      arrayOfCombinations.splice(i, 1);
    }
    return validCombos;
  } */

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

    
    // From the 'permutationsList' generate a random set and save it in 'randomSet' varialble
    // Check each permutation set if it is valid set or not as per to the user's condition by taking random sets from the 'permutationsList'
    // If the randomly selected set is valid then push it to the 'result' array
    //
    //let randomSet: number[]= [1,1,1,2];// to be generated randomly from the permutationsList

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
      if (parameters[i].decPoint > 1) {
        decimals++;
      }
    }

    return decimals;
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
