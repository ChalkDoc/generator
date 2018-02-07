import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Variable } from '../variable';
import { GeneratorService } from '../services/generator.service';
import * as _ from 'lodash';
import * as nerdamer from 'nerdamer';

import 'nerdamer/Solve';
import 'nerdamer/Algebra';
import 'nerdamer/Calculus';
import 'nerdamer/Extra';

declare var Guppy: any; // declaring Guppy
declare var GuppyOSK: any;

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css']
})
export class EquationComponent implements OnInit {
  @Input() childEquation: string;
  @Input() childParameterDiv: boolean;
  @Input() childVariables: Variable[];
  generatedView = false;
  isLoading = false;
  variableToSolve: Variable = null;
  canContainImaginary = false;
  generatedCombinations: any[] = [];
  numberOfProblems: number;
  errorsView = false;
  meetParameterCondition = false;

  constructor(private _generatorService: GeneratorService) {}

  ngOnInit() {}

  onSubmit(formValue) {
    // this logic updates the variables array value using the data obtained from the form
    this.generatedView = false;
    this.isLoading = true;
    _.delay(() => {
      for (let i = 0; i < this.childVariables.length - 1; i++) {
        if (this.childVariables[i].min >= this.childVariables[i].max) {
          this.isLoading = false;
          return (this.errorsView = true);
        }
      }
      this.numberOfProblems = formValue.value.numberOfProblems;
      if (this.variableToSolve) {
        for (let i = 0; i < this.childVariables.length; i++) {
          const currentVarObj = this.childVariables[i];
          if (currentVarObj.name === this.variableToSolve.name) {
            this.childVariables[i].solveForThisVariable = true;
            this.childVariables[i].containsImaginary = this.canContainImaginary;
            this.childVariables[
              i
            ].answerMeetsAllSpecification = this.meetParameterCondition;
          }
        }
        // this moves the variable to solve to the end of the array.
        this.switchParameterToSolve(this.childVariables, this.variableToSolve);
      }
      const result = this._generatorService.solverDecisionTree(
        this.childVariables,
        this.numberOfProblems,
        this.childEquation
      );
      this.generatedCombinations = result;
      console.log(this.generatedCombinations);
      console.log(formValue);
      this.isLoading = false;
      this.generatedView = true;
    }, 100);
  }

  switchParameterToSolve(
    variables: Variable[],
    variableToSolve: Variable
  ): void {
    const lastVariable = variables[variables.length - 1];
    for (let i = 0; i < variables.length; i++) {
      const currentVar = variables[i];
      if (currentVar.solveForThisVariable === true) {
        variables[variables.length - 1] = currentVar;
        variables[i] = lastVariable;
        break;
      }
    }
  }
}
