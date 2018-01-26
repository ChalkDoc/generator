import { Variable } from './variable';
import { math } from 'mathjs';
//import './../../node_modules/mathjs/core.js';

declare var math: any;

declare var nerdamer: any;

  export function findRange(variable: Variable): number {
    const range = (variable.max - variable.min) * (Math.pow(10, variable.decPoint)) + 1;
    return range;
  }

  /* Takes array of numbers and Variable array and converts to a varialble object*/
  export function createVariableObject(randomSet: number[], variables: Variable[]): object {
    const variablesObject = {};
    for (let i = 0; i < variables.length - 1; i++) {
      const objectName = variables[i].name;
      variablesObject[objectName] = randomSet[i];
    }
    return variablesObject;
  }

  // tslint:disable-next-line:max-line-length
  /* Solves the equation/expression using the nerdamer math  library by taking array of numbers, the simplified algebric equation and the variable array */
  export function solveForVariable(randomSet: number[], simplifiedEquation: string, variables: Variable[]): any[] {
    let answerArray: any[] = [];

    let variablesObject = createVariableObject(randomSet, variables);

    let answer: string = nerdamer(simplifiedEquation, variablesObject);
    //console.log('answer: ' + answer.toString());
    console.log(answer);

    let decimalAnswer: string  = nerdamer(answer).text('decimal');

    let decimalAnswerArray: string[] = decimalAnswer.split(/[\[,\]]/);

    for (let i = 0; i < decimalAnswerArray.length; i++) {
      if (decimalAnswerArray[i] !== '') {
        console.log(decimalAnswerArray[i]);
        //console.log(math.eval('(5/357)*((1/5)*sqrt(168814)-206/5)'));
        //console.log(math.eval(decimalAnswerArray[i]));
        //decimalAnswerArray[i] = mathjs.complex(decimalAnswerArray[i]);
        answerArray.push(decimalAnswerArray[i]);
      }
    }

    return answerArray;
  }

  /* This method simplifies an algebric equation and returns an expression */
  export function simplifyEquation(equation: string, variableToSolve: string): string {
    const simplifiedEquation = nerdamer.solve(equation, variableToSolve);
    return simplifiedEquation.toString();
  }
