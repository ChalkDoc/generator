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
  containsImaginary,
  pullRandomValue
} from './../utilities';

@Injectable()
export class GeneratorService {

  generateRangeOfValues(variableObj: Variable): number[] {
    return getRangeValues(variableObj)
      .map(val => val.toFixed(variableObj.decPoint));
  }

  createTestSet(knownVariableValueList: any[]): number[] {
    const testSet = [];
    const tempSetArray = [];

    for (let i = 0; i < knownVariableValueList.length; i++) {
      const randomIndex = Math.floor(Math.random() * knownVariableValueList[i].length);
      testSet[i] = knownVariableValueList[i][randomIndex];
    }

    return testSet;
  }

  generateDecimalVariablesPermutations(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    const result = [];
    const knownVariableValueList = [];
    const numberOfKnownVariables = variables.length - 1; // Will take away last variable.
    const expression = simplifyEquation(equation, variables[variables.length - 1].name);

    for (let i = 0; i < numberOfKnownVariables; i++) {
      knownVariableValueList[i] = this.generateRangeOfValues(variables[i]);
    }
    let count = 0;
    while (count < numberOfProblems) {
      let testSet: any[];
      testSet = this.createTestSet(knownVariableValueList);

      const answerArray = solveForUnknownVariable(testSet, expression, variables);
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
    debugger;

    return result;
  }

  generateValidVariablePermutations(variables: Variable[], numberOfProblems: number, equation: string) {
    const result = [];
    const permutationsList = generatePermutations(variables);
    const unknownVariable = _.last(variables);
    const simplifiedEquation = simplifyEquation(equation, unknownVariable.name);

    while (result.length < numberOfProblems && permutationsList.length > 0) {
      const permutation = pullRandomValue(permutationsList);
      const answer = solveForUnknownVariable(permutation, simplifiedEquation, variables)[0];
      const isValid = meetsUnknownVariableSpecification(answer, unknownVariable);

      if (isValid) {
        result.push([...permutation, [answer]]);
      }
    }

    return result;
  }
  // Method examines parameters to determine how many variables can be decimals.

  // Determines solving course of action based on variables and decimals.
  solverDecisionTree(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    const hasDecimals = variables.some(({
      decPoint
    }) => decPoint > 0);

    if (hasDecimals) {
      return this.generateDecimalVariablesPermutations(variables, numberOfProblems, equation);
    }
    return this.generateValidVariablePermutations(variables, numberOfProblems, equation);
  }
}
