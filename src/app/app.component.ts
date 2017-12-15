import { Component, OnInit, AfterViewChecked} from '@angular/core';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormsModule } from '@angular/forms';

import { Variable } from './variable';

import './../../node_modules/nerdamer/Solve.js';
import './../../node_modules/nerdamer/Algebra.js';
import './../../node_modules/nerdamer/Calculus.js';
import './../../node_modules/nerdamer/Extra.js';


// declare var $: any;    //declaring jQuery
 declare var Guppy: any;   //declaring Guppy
 declare var GuppyOSK: any;
 declare var nerdamer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewChecked {
  title = 'app';
  guppyBox: any;
  parameterDiv: any;
  variables: Variable[] = [];
  userInputInJsonFormat: any;

  constructor(private http: Http) {
         // // Make the HTTP request:
         // this.http.get('http://localhost:4200/assets/symbols.json')
         //          .subscribe((data) => {
         //            console.log(data)
         //           });
                   // with map
           // this.http.get("http://localhost:4200/assets/symbols.json")
           //     .map((data) => {
           //       return data.json();
           //     })
           //     .subscribe((success) => {
           //       this.symbols = success;
           //       console.log(this.symbols);
           //     });
                 }

  ngOnInit() {
    Guppy.init_symbols(['/assets/symbols.json']);
    let valuesArray = this.findValues('x^3 + x^2 + 5=-25', 'x', 2);
    console.log(valuesArray);
  }

  formatComplex(input) {

  }

  findValues(equation, variable, decimalPlaces) {
    let result = nerdamer.solve(equation, variable).toString();
    let answerValues = nerdamer(result);
    console.log(answerValues);
    let answerArray = [];
    let expressionValue;

    for (let i = 0; i < answerValues.symbol.elements.length; i++) {
      let expressionValue = answerValues.symbol.elements[i].value;
      console.log(expressionValue);
      if (expressionValue === '#'|| expressionValue === 'i') {
        let numerator = answerValues.symbol.elements[i].multiplier.num.value; 
        let denominator = answerValues.symbol.elements[i].multiplier.den.value;
        expressionValue = numerator/denominator;
        expressionValue = expressionValue.toFixed(decimalPlaces);
      }
      else {
        expressionValue = nerdamer(expressionValue).text('decimals');
      }
      answerArray.push(expressionValue);
    }
    return answerArray;
  }

  // extractAnswer(input) {
  //   let output = nerdamer(input);
  //   console.log(output);
  //   //output = output.symbol.elements[1].value;
  //   let numerator = output.symbol.elements[0].multiplier.num.value;
  //   let denominator = output.symbol.elements[0].multiplier.den.value;
  //   output = numerator/denominator;
  //   console.log(output.toFixed(2));
  //   output = nerdamer(output).text('decimals');

  //   return output;
  // }

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
      let content = Guppy.instances['equationBox'].backend.get_content(type);
        let stringifiedUserInput = content.toString();
        let extractedVars = this.extractVariables(content.toString());
        extractedVars = extractedVars.sort();
        console.log(extractedVars);
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

  /*this method turns the individual string element into a number */
  // convertToNumber(input, figsAfterDecimal) {
  //   let output = parseInt(input);
  //   let calculation = input.split('/');
  //   if (calculation.length > 1) {
  //     calculation[0] = parseInt(calculation[0]);
  //     calculation[1] = parseInt(calculation[1]);
  //     output = calculation[0]/calculation[1];
  //   }

  //   /*find the final number of digit numbers in answer */
  //   let stringoutput = output.toString();
    
  //   let totaldigits = stringoutput.split('.')[0].length;
  //   if (stringoutput[0] == '-') {  
  //     totaldigits += figsAfterDecimal - 1;  //for a negative number.
  //   }
  //   else {
  //     totaldigits += figsAfterDecimal;  //for a positive number.
  //   }
  
  //   return output.toPrecision(totaldigits);
  // }

  // /*this method takes a nerdamer answer string and returns an array of numbers.*/
  // extractAnswer(answer) {
  //   let result = answer.split('[');

  //   if (result[0] == '') {
  //     result = result[1].split(']');
  //     result = result[0].split(',');
  //   }

  //   for (let i = 0; i < result.length; i++) {
  //     result[i] = this.convertToNumber(result[i], 2);
  //   }

  //   return result;
  // }

  /*this method extracts out the variables from the string input */
  extractVariables(input) {
    let variableArr = [];
    let inputArr = input.split(',');
    for (let i = 0; i < inputArr.length - 1; i++) {
      if (inputArr[i] === 'var') {
        if (variableArr.includes(inputArr[i + 1]) === false) {
         variableArr.push(inputArr[i + 1]);
        }
      }
    }
    return variableArr;
  }

  onSubmit(formValue) {
    $('.col-md-7').html('<h1> We are generating your questions!...</h1> <img src="../assets/img/calculatorLoading.gif">')
    /* this logic updates the variables array using the data obtained from the form*/
    let formVariables = this.toArray(formValue.variables);
    for (let i = 0, j = 0; i < this.variables.length; i++) {
     this.variables[i].dataType = formVariables[j][1];
     this.variables[i].decPoint = formVariables[j+1][1];
     this.variables[i].min = formVariables[j+2][1];
     this.variables[i].max = formVariables[j+3][1];
    j+= 4;
    }
    console.log(formVariables)
    console.log(this.variables)
  }
  /* this method converts object into an array of object*/
  toArray(obj){
    let formVariables = Object.keys(obj).map(function(key){
      return [String(key),obj[key]]
    });
    return formVariables;
  }
 
}
