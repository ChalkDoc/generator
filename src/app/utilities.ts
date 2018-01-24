import { Variable } from './variable'

declare var nerdamer: any;

  export function findRange(max: number, min: number, decPoint: number): number {
    let range = (max - min) * (Math.pow(10, decPoint)) + 1;

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
        answerArray.push(decimalAnswerArray[i]);
      }
    }

    return answerArray;
  }
