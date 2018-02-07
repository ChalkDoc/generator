import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Variable } from '../variable';
import * as nerdamer from 'nerdamer';
import * as _ from 'lodash';

// import 'nerdamer/Solve';
// import 'nerdamer/Algebra';
// import 'nerdamer/Calculus';
// import 'nerdamer/Extra';

declare var Guppy: any;

@Component({
  selector: 'guppy-input',
  templateUrl: './guppy-input.component.html',
  styleUrls: ['./guppy-input.component.css']
})
export class GuppyInputComponent implements OnInit {
  error: string;
  guppyParameterDiv = false;
  guppyVariables: Variable[] = [];
  guppyEquation: string;
  equations: string[];

  constructor() {}

  ngOnInit() {
    this.equations = [];
    Guppy.init_symbols(['/assets/symbols.json']);
    this.addGuppyBox();

    // const guppy2 = new Guppy('equationBox2');
  }

  /* this is to get the content of the guppy box,
    it also converts the mathematical equation/expression into the desired format type(latex, asciimath, text, ast, eqns, function, xml)*/
  output() {
    try {
      this.error = '';
      this.guppyEquation = Guppy.instances['equationBox2'].backend.get_content(
        'text'
      );
      const extractedVars = nerdamer(this.guppyEquation).variables();
      /* creating variable instance and pushing each variable instance into the variables array*/
      for (let i = 0; i < extractedVars.length; i++) {
        const varName: string = extractedVars[i];
        const newVar = new Variable(varName);
        this.guppyVariables.push(newVar);
      }
      console.log(this.guppyVariables, 'guppy');
      this.guppyParameterDiv = true;
    } catch (e) {
      this.error = 'Parsing error!' + e;
    }
  }

  addGuppyBox() {
    const guppy = new Guppy(_.uniqueId('equationBox_'));
    this.equations.push(guppy);
  }
}
