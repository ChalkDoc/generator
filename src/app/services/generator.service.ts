/* tslint:disable:max-line-length */
import {
  Variable
} from './../variable';
import {
  Injectable
} from '@angular/core';
import * as _ from 'lodash';
import {
  solveForUnknownVariable,
  simplifyEquation,
  getRangeValues,
  generatePermutations,
  meetsUnknownVariableSpecification,
  pullRandomValue,
  getCollisionRisk,
  genRandomPermutation,
  isVariableInArray,
  singleZeroCheck,
  multiZeroCheck
} from './../utilities/utilities';

const COLLISION_THRESHOLD = 0.9;
const MAX_INVALID_COUNTER = 100;

@Injectable()
export class GeneratorService {

  generatePermutationsByRandom(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    const result = [];
    let invalidCounter = 0;
    const simplifiedEquation = simplifyEquation(equation, variables[variables.length - 1].name);
    console.log("simplifiedEquation",simplifiedEquation);
    while (result.length < numberOfProblems && invalidCounter < MAX_INVALID_COUNTER) {
      const permutation = genRandomPermutation(variables);
      console.log("permutation",permutation);
      const unknownVariable = _.last(variables);
      console.log("unknownVariable ",unknownVariable);
      const answer = solveForUnknownVariable(permutation, simplifiedEquation, variables); // returns a string array of 1 or 2 results
      console.log("answer",answer);
      const isValid = meetsUnknownVariableSpecification(answer, unknownVariable);
      console.log("isValid",isValid);
      const isNew = !isVariableInArray(permutation, result);
      console.log("isNew",isNew);
      //Checking zero compliance for all known variables
      const knownCheckZero = multiZeroCheck(permutation, variables);
      console.log("knownCheckZero: ",knownCheckZero);
      //Checking zero compliance for all unknown variables
      const unknownCheckZero = singleZeroCheck(answer, unknownVariable);
      console.log("unknownCheckZero: ",unknownCheckZero);

      if (isValid && isNew && knownCheckZero && unknownCheckZero) {
        invalidCounter = 0;
        result.push([...permutation, [answer]]);

        console.log("final??",result);
      } else {
        invalidCounter++;
      }
    }

    console.log("final final??",result);
    return result;
  }

  generatePermutationsFromList(variables: Variable[], numberOfProblems: number, equation: string) {
    const result = [];
    const permutationsList = generatePermutations(variables);
    console.log("permutationsList: "+ permutationsList);
    const unknownVariable = _.last(variables);
    console.log("unknownVariable: "+ unknownVariable);
    const simplifiedEquation = simplifyEquation(equation, unknownVariable.name);
    console.log("simplifiedEquation: "+ simplifiedEquation);
    while (result.length < numberOfProblems && permutationsList.length > 0) {

      const permutation = pullRandomValue(permutationsList);
      console.log("permutation: "+ permutation);
      const answer = solveForUnknownVariable(permutation, simplifiedEquation, variables);
      console.log("answer: "+ answer);
      const isValid = meetsUnknownVariableSpecification(answer, unknownVariable);
      console.log("isValid: "+ isValid);
      const knownCheckZero = multiZeroCheck(permutation, variables);
      console.log("knownCheckZero: ",knownCheckZero);
      //Checking zero compliance for all unknown variables
      const unknownCheckZero = singleZeroCheck(answer, unknownVariable);
      console.log("unknownCheckZero: ",unknownCheckZero);
      if (isValid && knownCheckZero && unknownCheckZero) {
        result.push([...permutation, [answer]]);
      }
    }
    console.log("result: "+ result);
    return result;
  }

  calculateTotalDecimals(variables) {
    let decimals = 0;
    for (let i = 0; i < variables.length; i++) {
      if (variables[i].decPoint > 0) {
        decimals++;
      }
    }
    return decimals;
  }

  /**
   * There could be a very large number of possible solutions (e.g. many decimal, number of problems, large range)
   * when that happens, we pick a permutations at random
   * but when the possibilities are small or we want a large fraction of them, we pick them from the full list otherwise the collision risk is too high.
   */
  solverDecisionTree(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    //const collisionRisk = getCollisionRisk(variables, numberOfProblems);
    let totalDecimals = this.calculateTotalDecimals(variables);
    //numberOfProblems = Math.min(numberOfProblems, 500);
    console.log("Total Decimals: " +totalDecimals);
    if (totalDecimals == 0) {
      console.log("Total Decimals is 0");
      return this.generatePermutationsFromList(variables, numberOfProblems, equation);
    }

    return this.generatePermutationsByRandom(variables, numberOfProblems, equation);
  }

}
