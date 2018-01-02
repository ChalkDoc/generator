import { Component, OnInit } from '@angular/core';
import { Variable } from '../variable';
import { GeneratorService } from '../services/generator.service';

import './../../../node_modules/nerdamer/Solve.js';
import './../../../node_modules/nerdamer/Algebra.js';
import './../../../node_modules/nerdamer/Calculus.js';
import './../../../node_modules/nerdamer/Extra.js';

declare var nerdamer: any;

import * as $ from 'jquery';
declare var Guppy: any;   //declaring Guppy

@Component({
  selector: 'app-equation',
  templateUrl: './equation.component.html',
  styleUrls: ['./equation.component.css']
})
export class EquationComponent implements OnInit {
  guppyBox: any;
  parameterDiv: any;
  equation: string;
  variables: Variable[] = [];
  generatedCombinations: any[] = [];
  generatedValidCombinations: any[] = [];
  numberOfProblems: number;
  userInputInJsonFormat: any;
  // randomImgLink = "http://lorempixel.com/400/200";
  // color = 'red';

  constructor(private _generatorService: GeneratorService) { }

  ngOnInit() {
    Guppy.init_symbols(['/assets/symbols.json']);
  }
  ngAfterViewChecked() {
    // To create the guppy box
    //new Guppy("equationBox");
    this.guppyBox = $('.equation-container');
    if (!this.guppyBox.data('has-guppy')) {
    let guppy = new Guppy('equationBox');
      $(this.guppyBox).data('has-guppy', true);
    }
  }
  /* this is to get the content of the guppy box,
    it also converts the mathematical equation/expression into the desired format type(latex, asciimath, text, ast, eqns, function, xml)*/
  output (type){
    try {
      this.equation = Guppy.instances['equationBox'].backend.get_content('text');
      let extractedVars = nerdamer(this.equation).variables().sort();
      console.log("extractedVars: " + extractedVars);
      /* creating variable instance and pushing each variable instance into the variables array*/
      for (let i = 0; i < extractedVars.length; i++) {
        let varName:string = extractedVars[i];
        let newVar = new Variable(varName);
        this.variables.push(newVar);
      }
      console.log(this.variables);
      this.parameterDiv = $('.parameter-condition');
      this.parameterDiv.show();
    } catch (e) {
      alert('Parsing error!' + e);
    }
  }

  onSubmit(formValue) {
    // $('.col-md-8').html('<h1> We are generating your questions!...</h1> <img src="../assets/img/calculatorLoading.gif">')
    /* this logic updates the variables array value using the data obtained from the form */
    $('.col-md-8').show();
    this.numberOfProblems = formValue.numberOfProblems;
    let formVariables = this.toArray(formValue.variables); //converting object into array
    for (let i = 0, j = 0; i < this.variables.length; i++) {
      this.variables[i].decPoint = formVariables[j][1];
      this.variables[i].min = formVariables[j+1][1];
      this.variables[i].max = formVariables[j+2][1];
      j+= 3;
    }

    console.log(this.variables);
    let result = this._generatorService.generatePermutations(this.variables);
    console.log(result);
    this.generatedCombinations = result;

    // let result = this._generatorService.generateValidVariableCombination(this.variables, this.numberOfProblems, this.equation);
  }
  /* this method converts object into an array of object*/
  toArray(obj) {
    let formVariables = Object.keys(obj).map(function(key){
      return [String(key),obj[key]]
    });
    return formVariables;
  }

}
