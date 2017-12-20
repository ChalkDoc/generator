import { Injectable } from '@angular/core';

import './../../../node_modules/nerdamer/Solve.js';
import './../../../node_modules/nerdamer/Algebra.js';
import './../../../node_modules/nerdamer/Calculus.js';
import './../../../node_modules/nerdamer/Extra.js';

declare var nerdamer: any;

@Injectable()
export class GeneratorService {

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
  }

  generatePermutations() {



  let temp = [];
  let parametersArray = [
    {name: 'a', min: 1, max: 5},
    {name: 'b', min: 1, max: 5},
    {name: 'c', min: 1, max: 5},
    {name: 'x', min: 1, max: 5},
    {name: 'y', min: 2, max: 7}
  ];

  let arrayOfSets = [];
  let answerArray = [];
  let numberOfVariables = parametersArray.length;

  var totalPermutations = 1;
  for (var i = 0; i < numberOfVariables; i++) {
  	var range = parametersArray[i].max - parametersArray[i].min + 1;
  	totalPermutations *= range;
    console.log(totalPermutations);
  }


  for (var i = 0; i < numberOfVariables; i++) {
  	temp[i] = parametersArray[i].min;
  }

  for (var index = 0; index < totalPermutations; index++) {
  	var arrayValues = [];

    for (var i = 0; i < numberOfVariables; i++) {
    	arrayValues[i] = temp[i];
    }

    if (temp[numberOfVariables - 1] <= parametersArray[numberOfVariables - 1].max) {
      temp[numberOfVariables - 1]++;
    }
    else {
      for (var i = numberOfVariables - 1; i >= 0; i--) {
        if (temp[i] > parametersArray[i].max) {
  				temp[i] = parametersArray[i].min;
        	temp[i - 1]++;
        }
        arrayValues[i] = temp[i];
      }
      temp[numberOfVariables - 1]++;
    }

    answerArray.push(arrayValues);
  }
  }
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
