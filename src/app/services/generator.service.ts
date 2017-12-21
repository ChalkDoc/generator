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

//IN PROGRESS KIM
  calculateLastVariable(parametersArray, testSet, expression) {
    let variablesObject = [];

    for (let i = 0; i < parametersArray.length; i++) {
      variablesObject[parametersArray[i].name] = testSet[i];
    }

    let lastVariable = nerdamer(expression, variablesObject).toString();
    console.log(lastVariable);

    return lastVariable;
  }
//IN PROGRESS KIM CHANGE TO 'SOLVE()'
  solve(equation, variable, decimalPlaces) {
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
  checkValues(problemsToGenerate, arrayOfCombinations, solveForMin, solveForMax) {
   	let validCombos = [];
    while (arrayOfCombinations.length > 0 && validCombos.length < problemsToGenerate) {
    	let i = Math.floor(Math.random() * arrayOfCombinations.length);

      /* problemSolver should take in an array of values, use the library to solve for the last variable, and output the value of that variable */
      // let x = problemSolver(arrayOfCombinations[i]);

      var currentCombination = arrayOfCombinations.pop();
      if(this.isValid(currentCombination)) {
        validCombos.push(currentCombination);
      }

      // if(x >= solveForMin && x <= solveForMax) {
      // 	arrayOfCombinations[i].push(x);
      //   validCombos.push(arrayOfCombinations[i]);
      // }
      // arrayOfCombinations.splice(i, 1);
    }
    return validCombos;
  }

  isValid(arrayOfCombinations: any[]) {
    // eg: arrayOfCombinations= [1,1,1,1];
    //use nerdamer to determine and user specification to determine the validity
    return true;
  }

  generateValidResults(variables: Variable[]): any[] {
    let result: any[] = [];
    /* Returns array of permutation sets */
    let permutationsList: any[] = this.generatePermutations(variables);

    // Check each permutation set if it is valid set or not as per to the user's condition by taking random sets from the 'permutationsList'
    // If the randomly selected set is valid then push it to the 'result' array

    return result;
  }

  checkValues(randomSet: number[]): boolean{
    let result: boolean = false;
    

    return result;
  }
}
