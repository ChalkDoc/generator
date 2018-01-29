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

  generateDecimalVariablesPermutations(variables: Variable[], numberOfProblems: number, equation: string): any[] {
    const result = [];
    const permutationsList = generatePermutations(variables);
    const simplifiedEquation = simplifyEquation(equation, variables[variables.length - 1].name);
    while (result.length < numberOfProblems) {
      const permutation = pullRandomValue(permutationsList);
      const unknownVariable = _.last(variables);
      const answer = solveForUnknownVariable(permutation, simplifiedEquation, variables)[0];
      const isValid = meetsUnknownVariableSpecification(answer, unknownVariable);

      if (isValid) {
        result.push([...permutation, [answer]]);
      }
    }
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
