import { Variable } from './variable';

declare var nerdamer: any;

export function findRange({ min, max, decPoint }: Variable): number {
  return (max - min) * 10 ** decPoint + 1;
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
  const answerArray: any[] = [];

  const variablesObject = createVariableObject(randomSet, variables);

  const answer: string = nerdamer(simplifiedEquation, variablesObject);
  // console.log('answer: ' + answer.toString());
  console.log(answer);

  const decimalAnswer: string = nerdamer(answer).text('decimal');

  const decimalAnswerArray: string[] = decimalAnswer.split(/[\[,\]]/);

  for (let i = 0; i < decimalAnswerArray.length; i++) {
    if (decimalAnswerArray[i] !== '') {
      console.log(decimalAnswerArray[i]);
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

export function getRangeValues({ min, max, decPoint }) {
  const rangeValues = [];
  const increment = Math.pow(10, -decPoint);
  let num = min;
  while (num <= max) {
    rangeValues.push(num);
    num += increment;
  }
  return rangeValues;
}
/* This method takes an object as an argument and converts into an array. */
export function toArray(obj: object) {
  const objArr = Object.keys(obj).map(function (key) {
    return [String(key), obj[key]];
  });
  return objArr;
}
