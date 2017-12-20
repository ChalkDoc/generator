import { Injectable } from '@angular/core';

import './../../../node_modules/nerdamer/Solve.js';
import './../../../node_modules/nerdamer/Algebra.js';
import './../../../node_modules/nerdamer/Calculus.js';
import './../../../node_modules/nerdamer/Extra.js';

declare var nerdamer: any;

@Injectable()
export class GenertorService {

  constructor() { }


  findValues(equation, variable, decimalPlaces) {
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

  //problemsToGenerate should be an int, arrayOfCombinations is assumed to be an array of arrays
  /* solveForMin and solveForMax are the minimum and maximum allowed values for the variable to be solved for */
  checkValues(problemsToGenerate, arrayOCombinations, solveForMin, solveForMax) {
   	let validCombos = [];
    while (arrayOfCombinations.length > 0 && validCombos.length < problemsToGenerate) {
    	let i = Math.floor(Math.random() * arrayOfCombinations.length);

      /* problemSolver should take in an array of values, use the library to solve for the last variable, and output the value of that variable */
      let x = problemSolver(arrayOfCombinations[i]);

      if(x >= solveForMin && x <= solveForMax) {
      	arrayOfCombinations[i].push(x);
        validCombos.push(arrayOfCombinations[i]);
      }
      arrayOfCombinations.splice(i, 1);
    }
    return validCombos;
  }
}
