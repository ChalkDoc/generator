import { Variable } from './../variable';
import { variable } from '@angular/compiler/src/output/output_ast';
import * as _ from 'lodash';
import * as nerdamer from 'nerdamer';



let inequalitySymbols: string[] = [">", ">=", "<", "<="];

export function createInequalityHash(equation :string){
	let hash: any = {};
	let rand = Math.floor(Math.random() * inequalitySymbols.length);
   	hash["equation"] = equation;
   	hash["inEqSymbol"] = inequalitySymbols[rand];
   	return hash;
}

export function solveInequalityEquation(hash :any, variableToSolve: string): string {
  let result =  (nerdamer as any).solveEquations(hash["equation"], variableToSolve).toString();
 let  inEqResult = variableToSolve + " " + hash["inEqSymbol"] + " " + result;
  return inEqResult;
}

export function flipSign() 






  