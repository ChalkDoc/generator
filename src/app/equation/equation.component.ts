import { Component, OnInit } from '@angular/core';
import { Variable } from '../variable';
import { GeneratorService } from '../services/generator.service';

import './../../../node_modules/nerdamer/Solve.js';
import './../../../node_modules/nerdamer/Algebra.js';
import './../../../node_modules/nerdamer/Calculus.js';
import './../../../node_modules/nerdamer/Extra.js';

declare var nerdamer: any; // declaring nerdamer

// import * as $ from 'jquery';
// declaring jQuery
declare var Guppy: any;   // declaring Guppy
declare var GuppyOSK: any;

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css']
})
export class EquationComponent implements OnInit {
  guppyBox = false;
  parameterDiv = false;
  generatedView = false;
  isLoading = false;
  equation: string;
  variables: Variable[] = [];
  variableToSolve: Variable = null;
  canContainImaginary = false;
  meetParameterCondition = false;
  generatedCombinations: any[] = [];
  numberOfProblems: number;

  constructor(private _generatorService: GeneratorService) {}

  ngOnInit() {
    Guppy.init_symbols(['/assets/symbols.json']);
  }
  ngDoCheck() {
    if (this.variableToSolve) {
      for (let i = 0; i < this.variables.length; i++) {
        let currentVarObj = this.variables[i];
        if (currentVarObj.name === this.variableToSolve.name) {
          this.variables[i].solveForThisVariable = true;
          this.variables[i].containsImaginary = this.canContainImaginary;
          this.variables[i].answerMeetsAllSpecification = this.meetParameterCondition;
        }
      }
      // this takes the variable to solve to the end of the array.
      this.switchParameterToSolve(this.variables, this.variableToSolve);
    }
  }
  ngAfterViewChecked() {
    if (!this.guppyBox) {
      this.guppyBox = true;
    let guppy = new Guppy('equationBox');
    }
  }
  /* this is to get the content of the guppy box,
    it also converts the mathematical equation/expression into the desired format type(latex, asciimath, text, ast, eqns, function, xml)*/
  output (){
    try {
      this.equation = Guppy.instances['equationBox'].backend.get_content('text');
      let extractedVars = nerdamer(this.equation).variables().sort();
      /* creating variable instance and pushing each variable instance into the variables array*/
      for (let i = 0; i < extractedVars.length; i++) {
        let varName: string = extractedVars[i];
        let newVar = new Variable(varName);
        this.variables.push(newVar);
      }
      this.parameterDiv = true;
    } catch (e) {
      alert('Parsing error!' + e);
    }
  }

  onSubmit(formValue) {
    // this logic updates the variables array value using the data obtained from the form
    this.generatedView = true;
    this.isLoading = true;


    this.numberOfProblems = formValue.numberOfProblems;
    // converting object into array
    let formVariables = this._generatorService.toArray (formValue.variables);
    for (let i = 0, j = 0; i < this.variables.length; i++) {
      this.variables[i].decPoint = formVariables[j][1];
      this.variables[i].min = formVariables[j + 1][1];
      this.variables[i].max = formVariables[j + 2][1];
      j += 3;
    }

    let result = this._generatorService.solverDecisionTree(this.variables,this.numberOfProblems, this.equation);
    this.generatedCombinations = result;
    console.log(this.generatedCombinations);

    this.isLoading = false;
  }

  switchParameterToSolve(variables: Variable[], variableToSolve: Variable): void {
    let lastVariable = variables[variables.length-1];
    for (let i = 0; i < variables.length; i++) {
      let currentVar = variables[i];
      if (currentVar.solveForThisVariable === true) {
        variables[variables.length-1] = currentVar;
        variables[i] = lastVariable;
        break;
      }
    }
  }
}
