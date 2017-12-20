import { Injectable } from '@angular/core';

@Injectable()
export class GenertorService {

  constructor() { }

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
