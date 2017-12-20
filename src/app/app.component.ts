import { Component, OnInit} from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormsModule } from '@angular/forms';

import { Variable } from './variable';

import './../../node_modules/nerdamer/Solve.js';
import './../../node_modules/nerdamer/Algebra.js';
import './../../node_modules/nerdamer/Calculus.js';
import './../../node_modules/nerdamer/Extra.js';

 declare var GuppyOSK: any;
 declare var nerdamer: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  title = 'app';
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
    let valuesArray = this.findValues('x^3 + x^2 + 5=-25', 'x', 2);
    console.log(valuesArray);
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
}
