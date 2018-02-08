/* tslint:disable:max-line-length */
import { TestBed, inject } from '@angular/core/testing';

import { GeneratorService } from './../services/generator.service';

import {
  createKnownValuesObject,
  solveForUnknownVariable,
  simplifyEquation,
  generatePermutations,
  meetsUnknownVariableSpecification,
  calculateDecimalPlaces,
  pullRandomValue,
  genRandomPermutation,
  getRangeValues,
  isVariableInArray,
  getRandomValue,
  getCollisionRisk,
  getVariablesValueTotal,
  getValueTotal
} from './utilities';
import * as _ from 'lodash';
import { Variable } from '../variable';
import { randomBytes } from 'crypto';
import { checkAndUpdateBinding } from '@angular/core/src/view/util';

describe('All Utilities methods', () => {
    const varObjA = new Variable('a', 0, _.random(0, 5, false), _.random(15, 20, false));
    const varObjB = new Variable('b', 0, _.random(0, 5, false), _.random(15, 20, false));
    const varObjC = new Variable('c', 0, _.random(0, 5, false), _.random(15, 20, false));
    const varObjX = new Variable('x', 0, _.random(0, 5, false), _.random(15, 20, false));
    const variables: Variable[] = [varObjA, varObjB, varObjC, varObjX];
    const randomSet: number [] = genRandomPermutation(variables);

    const decVarObjH: Variable = new Variable('h', 1, _.random(0, 5.0), _.random(15, 20.0));
    const decVarObjI: Variable = new Variable('i', 1, _.random(0, 5.0), _.random(15, 20.0));
    const decVarObjJ: Variable = new Variable('j', 1, _.random(0, 5.0), _.random(15, 20.0));
    const decVarObjK: Variable = new Variable('k', 1, _.random(0, 5.0), _.random(15, 20.0));
    const decVariables: Variable[] = [decVarObjH, decVarObjI, decVarObjJ, decVarObjK];
    const randomDecSet: number [] = genRandomPermutation(decVariables);

    const knownVarsObj: { [name: string]: string } = createKnownValuesObject(randomSet, variables);
    const equation = 'a*b+c=x';
    const numberOfProblems = 30;

    beforeEach(() => {
      TestBed.configureTestingModule({
      });
    });

    describe('createKnownValuesObject for a random set', () => {
      it('should take a random set generated by genRandomPermutations and return a variable object.', () => {
        expect(knownVarsObj).toEqual({[varObjA.name]: String(randomSet[0]), [varObjB.name]: String(randomSet[1]), [varObjC.name]: String(randomSet[2])});
      });

      describe('solveForUnknownVariable ', () => {
        it('should take a set of numbers, plug them into the simplified equation and return a number for the variable thats being solved for)', () => {
          const simplifiedEquation = simplifyEquation(equation, 'x');
          const solvedForUnknownVariable = solveForUnknownVariable(randomSet, simplifiedEquation, variables);

          expect(solvedForUnknownVariable).toEqual(randomSet[0] * randomSet[1] + randomSet[2]);
      });

      describe('simplifyEquation', () => {
        it('should return the equation in terms of variable being solved for', () => {
          const simplifiedEquation = simplifyEquation(equation, 'b');
          expect(simplifiedEquation).toEqual('[-(-x+c)*a^(-1)]');
        });

        it('should return "[-a]" when calling simplifyEquation(equation, variableToSolve)', () => {
          const notSimplifiedEquation = 'x + a = 0';
          const variableToSolve: Variable = new Variable('x', 0, 10, 16);
          const simplifiedEquation: string = simplifyEquation(notSimplifiedEquation, variableToSolve.name);
          expect(simplifiedEquation.toString()).toBe('[-a]');
        });
        it('should return "[sqrt(-a), -sqrt(-a)]" when calling simplifyEquation(equation, variableToSolve)', () => {
          const squaredEquation = 'x^2 + a = 0';
          const variableToSolve: Variable = new Variable('x', 0, 0, 0);

          const simplifiedEquation: string = simplifyEquation(squaredEquation, variableToSolve.name);
          expect(simplifiedEquation.toString()).toBe('[sqrt(-a),-sqrt(-a)]');
        });
        it('should return "[(-220328269/832788672)*(27*a+27*abs(a))^(1/3),(220328269/1665577344)*((138907099/80198051)*i+1)*(27*a+27*abs(a))^(1/3),(220328269/1665577344)*((-138907099/80198051)*i+1)*(27*a+27*abs(a))^(1/3)]" when calling simplifyEquation(equation, variableToSolve)', () => {
          const equation = 'x^3 + a = 0';
          const variableToSolve: Variable = new Variable('x', 0, 0, 0);

          const simplifiedEquation: string = simplifyEquation(equation, variableToSolve.name);
          expect(simplifiedEquation.toString()).toBe('[(-220328269/832788672)*(27*a+27*abs(a))^(1/3),(220328269/1665577344)*((138907099/80198051)*i+1)*(27*a+27*abs(a))^(1/3),(220328269/1665577344)*((-138907099/80198051)*i+1)*(27*a+27*abs(a))^(1/3)]');
        });

        it('should return "[(1/2)*(-b+sqrt(-4*a*c+b^2))*a^(-1),(1/2)*(-b-sqrt(-4*a*c+b^2))*a^(-1)]" when calling simplifyEquation(equation, variableToSolve) testing cases for quadratic equations', () => {
          const equation = 'a*x^2 + b*x + c = 0';
          const variableToSolve: Variable = new Variable('x', 0, 0, 0);
      
          const simplifiedEquation: string = simplifyEquation(equation, variableToSolve.name);
          expect(simplifiedEquation.toString()).toBe('[(1/2)*(-b+sqrt(-4*a*c+b^2))*a^(-1),(1/2)*(-b-sqrt(-4*a*c+b^2))*a^(-1)]');
        });

      });

      describe('calculateDecimalPlaces', () => {
        it('checks the value returned by calculateDecimalPlaces when a string is given as parameter', () => {
          const stringAsParameter: string = '4.49854';
          const calculatedDecimal: number = calculateDecimalPlaces(stringAsParameter);
          expect(calculatedDecimal).toBe(5);
        });

        it('checks the value returned by calculateDecimalPlaces when a number with decimals is given as parameter', () => {
          const numberAsParameter: number = 4.49854;
          const calculatedDecimal: number = calculateDecimalPlaces(numberAsParameter);
          expect(calculatedDecimal).toBe(5);
        });

        it('checks the value returned by calculateDecimalPlaces when a number without decimals is given as parameter', () => {
          const numberAsParameter: number = 4;
          const calculatedDecimal: number = calculateDecimalPlaces(numberAsParameter);
          expect(calculatedDecimal).toBe(0);
        });

        it('checks the value returned by calculateDecimalPlaces when a string is given as parameter', () => {
          const numberAsParameter: string = '4';
          const calculatedDecimal: number = calculateDecimalPlaces(numberAsParameter);
          expect(calculatedDecimal).toBe(0);
        });
      });

      describe('getRangeValues for input with 0 decimals', () => {
        it('should check getRangeValues when Variable contains 0 decimals', () => {
          const newVariable: Variable = new Variable( 'n', 0, 1, 5);
          expect(getRangeValues(newVariable)).toEqual([1, 2, 3, 4, 5]);
        });
        it('should check getRangeValues when Variables contains > 0 decimals', () =>  {
          const newVariable: Variable = new Variable('q', 1, 1, 2);
          expect(getRangeValues(newVariable)).toEqual([1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2.0]);
        });
      });

      describe('generatePermutations', () => {
        describe('Cases where parameters contain no decimals', () => {
          const firstVariable: Variable = new Variable('p', 0, 1, 2);
          const secondVariable: Variable = new Variable('z', 0, 3, 5);
          const thirdVariable: Variable = new Variable('d', 0, 1, 2);
          const variablesTestSet: Variable [] = [firstVariable, secondVariable, thirdVariable];
          const generatedSet: [number []] = generatePermutations(variablesTestSet);

          it('should generate permutations for cases where variables contain no decimals', () => {
            expect(generatedSet).toEqual([[1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [2, 5]]);
          });
          it('should check that the generated set contains [1,5] when calling generatePermutations', () => {
            expect(generatedSet).toContain([1, 5]);
          });

          it('should check the length of the array of permutations generated', () => {
            expect(generatedSet.length).toEqual(6);
          });
          it('should check that generatePermutations returns [[]]', () => {
            expect(generatedSet).toEqual(jasmine.any(Array));
            expect(generatedSet[0]).toEqual(jasmine.any(Array));
          });
        });

        describe('cases where parameters contain decimals', () => {
          it('should test for cases where variables contain > 0 decimals', () => {

          });
        });

        describe('isVariableInArray method', () => {

          describe('isVariableInArray for arrays of integer values', () => {
            it('should check isVariableInArray when variable is not in array', () => {
              const checkVariableIsInArray = isVariableInArray([3, 4, 5], [[3, 5, 6], [2, 3, 4]]);
              expect(checkVariableIsInArray).toEqual(false);
            });
            it('should check isVariableInArray when variable is in array', () => {
              const checkVariableIsInArray = isVariableInArray([3, 4, 5], [[3, 4, 5], [2, 3, 4]]);
              expect(checkVariableIsInArray).toBe(true);
            });
          });

          describe('isVariableInArray for arrays of decimal values', () => {
            it('isVariableInArray for cases when variable is not in the array', () => {
              const checkVariableIsInArray = isVariableInArray([3.4, 4.2, 5.9], [[3.4, 5.8, 6.8], [2.4, 3.6, 4.9]]);
              expect(checkVariableIsInArray).toEqual(false);
            });
            it('should check isVariableInArray for cases when variable is in the array', () => {
              const checkVariableIsInArray = isVariableInArray([3.4, 4.2, 5.9], [[3.4, 5.8, 6.8], [3.4, 4.2, 5.9]]);
              expect(checkVariableIsInArray).toBe(true);
            });
          });
        });

        describe('getRandomValue', () => {
          it('should verify that getRandomValue lies between min and max for non-decimal variables', () => {
            const randomValue = getRandomValue(varObjA);
            expect(randomValue).toBeGreaterThanOrEqual(varObjA.min);
            expect(randomValue).not.toBeGreaterThan(varObjA.max);
          });

          it('should verify that getRandomValue lies between min and max for non-decimal variables', () => {
            const randomValue = getRandomValue(decVarObjH);
            expect(randomValue).toBeGreaterThanOrEqual(decVarObjH.min);
            expect(randomValue).not.toBeGreaterThan(decVarObjH.max);
          });
        });

        describe('genRandomPermutation', () => {
          it('should verify that Non-decimal permutations generated by getRandomValue are within min and max values', () => {
            const randomPermutation = genRandomPermutation(variables);
            expect(randomPermutation[0]).toBeGreaterThanOrEqual(varObjA.min);
            expect(randomPermutation[0]).toBeLessThanOrEqual(varObjA.max);
            expect(randomPermutation[1]).toBeGreaterThanOrEqual(varObjB.min);
            expect(randomPermutation[1]).toBeLessThanOrEqual(varObjB.max);
            expect(randomPermutation[2]).toBeGreaterThanOrEqual(varObjC.min);
            expect(randomPermutation[2]).toBeLessThanOrEqual(varObjC.max);
          });

          it('should verify that Decimal permutations generated by getRandomValue are within min and max values', () => {
            const randomPermutation = genRandomPermutation(decVariables);
            expect(randomPermutation[0]).toBeGreaterThanOrEqual(decVarObjH.min);
            expect(randomPermutation[0]).toBeLessThanOrEqual(decVarObjH.max);
            expect(randomPermutation[1]).toBeGreaterThanOrEqual(decVarObjI.min);
            expect(randomPermutation[1]).toBeLessThanOrEqual(decVarObjI.max);
            expect(randomPermutation[2]).toBeGreaterThanOrEqual(decVarObjJ.min);
            expect(randomPermutation[2]).toBeLessThanOrEqual(decVarObjJ.max);
          });
        });


        describe('getCollisionRisk', () => {
          it('should check that collision risk is a decimal value between 0 and 1', () => {
            const collisionRisk = getCollisionRisk(variables, numberOfProblems);
            expect(collisionRisk).toBeLessThanOrEqual(1.0);
            expect(collisionRisk).toBeGreaterThanOrEqual(0.0);
          });

          it('should check that collision risk is a decimal value between 0 and 1 for decimal Variables', () => {
            const collisionRisk = getCollisionRisk(decVariables, numberOfProblems);
            expect(collisionRisk).toBeLessThanOrEqual(1.0);
            expect(collisionRisk).toBeGreaterThanOrEqual(0.0);
          });
        });

        describe('getVariablesValueTotal', () => {
          const intVarValuesCount = getVariablesValueTotal(variables);
          const varCountA = getValueTotal(varObjA);
          const varCountB = getValueTotal(varObjB);
          const varCountC = getValueTotal(varObjC);
          const varCountX = getValueTotal(varObjX);

          const decVarValuesCount = getVariablesValueTotal(decVariables);
          const varCountH = getValueTotal(decVarObjH);
          const varCountI = getValueTotal(decVarObjI);
          const varCountJ = getValueTotal(decVarObjJ);
          const varCountK = getValueTotal(decVarObjK);


          describe('getVariablesValueTotal for Non-decimal cases', () => {
            it('should check Non-decimal cases and return an integer count of number of variables', () => {
              expect(intVarValuesCount).toEqual(varCountA * varCountB * varCountC * varCountX);
            });

            it('getVariablesValueTotal should check Decimal cases and return an integer count of number of variables', () => {
              expect(decVarValuesCount).toEqual(varCountH * varCountI * varCountJ  * varCountK);
            });
          });

          describe('getValueTotal', () => {
            it('should check non-decimal Variables cases', () => {
              expect(varCountA).toEqual(varObjA.max - varObjA.min + 1);
              expect(varCountB).toEqual(varObjB.max - varObjB.min + 1);
              expect(varCountC).toEqual(varObjC.max - varObjC.min + 1);
              expect(varCountX).toEqual(varObjX.max - varObjX.min + 1);
            });

            it('should check Decimal Variables cases', () => {
              expect(varCountH).toEqual((decVarObjH.max - decVarObjH.min + 1) * 10 ** decVarObjH.decPoint);
              expect(varCountI).toEqual((decVarObjI.max - decVarObjI.min + 1) * 10 ** decVarObjH.decPoint);
              expect(varCountJ).toEqual((decVarObjJ.max - decVarObjJ.min + 1) * 10 ** decVarObjJ.decPoint);
              expect(varCountK).toEqual((decVarObjK.max - decVarObjK.min + 1) * 10 ** decVarObjH.decPoint);
            });
          });
        });

        describe('pullRandomValue', () => {
          const testSet = [ [1, 2], [2, 4], [7, 4], [9, 9] ];
          const refTestSet = testSet.slice();
          const splicedPermutation = pullRandomValue(testSet);

          const decTestSet = [ [1.1, 3.3], [2.4], [4.9] ];
          const decRefTestSet = decTestSet.slice();
          const decSplicedPermutation = pullRandomValue(decTestSet);

          it('should check that a permutation is removed from a set of possible permutations', () => {

            const permutationIncluded = testSet.includes(splicedPermutation);
            expect(permutationIncluded).toBe(false);
          });
          it('should verify that a permutation is present in a copy of the original array', () => {
            const randomValIncluded = refTestSet.includes(splicedPermutation);
            expect(randomValIncluded).toBe(true);
          });

          it('should check that the random set that is spliced is present in a copy of the original array', () => {
            const permutationIncluded = decTestSet.includes(splicedPermutation);
            expect(permutationIncluded).toBe(false);
          });

          it('should check that the random set that is spliced is present in a copy of the original array', () => {
            const randomValIncluded = decRefTestSet.includes(decSplicedPermutation)
            expect(randomValIncluded).toBe(true);
          });
        });

        describe('meetsUnknownVariableSpecification', () => {

          describe('Non-decimal Cases', () => {
            it('should Verify that a non-decimal value meets parameters of a Variable', () => {
              expect(meetsUnknownVariableSpecification(6, varObjA)).toBe(true);
            });
            it('should Verify that a non-decimal value meets parameters of a Variable', () => {
              expect(meetsUnknownVariableSpecification(21, varObjA)).toBe(false);
            });
          });

          describe('Decimal Cases', () => {
            it('should check if a non-decimal value does not meet parameters of a Variable', () => {
              expect(meetsUnknownVariableSpecification(6.5, decVarObjH)).toBe(true);
            });
            it('should check if a Decimal value does not meet parameters of a Variable', () => {
              expect(meetsUnknownVariableSpecification(26.5, decVarObjH)).toBe(false);
            });
          });
        });
      });
    });
  });
});
