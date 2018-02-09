import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Variable } from '../variable';
import * as nerdamer from 'nerdamer';
import * as _ from 'lodash';

declare var Guppy: any;

@Component({
  selector: 'guppy-input',
  templateUrl: './guppy-input.component.html',
  styleUrls: ['./guppy-input.component.css']
})
export class GuppyInputComponent implements AfterViewChecked {
  error: string;
  guppyParameterDiv = false;
  guppyVariables: Variable[] = [];
  equationIds: string[];
  guppyEquation: string[];

  constructor() {
    this.equationIds = [];
    console.log(this.equationIds.length);
    Guppy.init_symbols(['/assets/symbols.json']);
    this.addGuppyBox();
  }

  ngAfterViewChecked() {
    console.log(this.equationIds);
    this.equationIds.forEach(id => {
      if (!Guppy.instances[id]) {
        const guppy = new Guppy(id, {
          events: {
            ready: () => {
              // workaround for Guppy bug
              Guppy.ready = true;
            }
          }
        });
      }
    });
  }

  /* this is to get the content of the guppy box*/
  output() {
    try {
      this.error = '';
      this.guppyEquation = [];
      this.guppyVariables = this.equationIds.reduce((acc, id) => {
        const guppyEquation = Guppy.instances[id].backend.get_content('text');
        this.guppyEquation.push(guppyEquation);
        const extractedVars = nerdamer(guppyEquation).variables();
        /* creating variable instance and pushing each variable instance into the variables array*/
        for (let i = 0; i < extractedVars.length; i++) {
          const varName: string = extractedVars[i];
          const newVar = new Variable(varName);
          const alreadyInArray = acc.some(({ name }) => name === varName);
          if (!alreadyInArray) {
            acc.push(newVar);
          }
        }

        return acc;
      }, []);

      this.guppyParameterDiv = true;
    } catch (e) {
      this.error =
        'Unable to handle that equation at this time. Sorry for the inconvenience.';
    }
  }

  addGuppyBox() {
    const guppy = _.uniqueId('equationBox_');
    this.equationIds.push(guppy);
  }

  removeGuppyBox(equation: string) {
    _.pull(this.equationIds, equation);
  }
}
