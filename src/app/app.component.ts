import { Component, OnInit, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'


// declare var $: any;    //declaring jQuery
 declare var Guppy: any;   //declaring Guppy
//
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewChecked {
  title = 'app';
  guppyBox: any;
  parameterDiv: any;
  variables: any[];
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
    // Hard coding the variables array untill the parsing problem is resolved(for quadratic equation)
    let jsonUserInput = ["=",[["+",[["+",[["*",[["var",["a"]],["exponential",[["var",["x"]],["val",[2]]]]]],["*",[["var",["b"]],["var",["x"]]]]]],["var",["c"]]]],["val",[0]]]];
    let stringifiedUserInput = jsonUserInput.toString();
    this.variables = this.extractVariables(stringifiedUserInput);
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

  // this is to get the content of the guppy box,
  // it also converts the mathematical equation/expression into the desired format type(latex, asciimath, text, ast, eqns, function, xml)
  output(type) {

    console.log(type);
    let content = Guppy.instances['equationBox'].backend.get_content('ast');
    content = JSON.stringify(content);
   	console.log(content);
    // try {
    //   let content = Guppy.instances['equationBox'].backend.get_content(type);
    //   content = JSON.stringify(content);
    // }catch (e) {
    //   alert('Parsing error!' + e);
    //   }


    // to display the variables
    this.parameterDiv = $('.parameter-condition');
      this.parameterDiv.show();
      this.parameterDiv.append(' <h6 style="color:#ccc; display: inline;">These are the variables: </h6> <h3> ' + this.variables.sort().join(',') + '</h3');

    }

// this method extracts out the variables from the string input
 extractVariables = function(input) {
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
  // extractVariables(input) {
  //   debugger;
  //   let variableArr: string[];
  //   let inputArr = input.split(',');
  //   for (let i = 0; i < inputArr.length - 1; i++) {
  //     if (inputArr[i] === 'var') {
  //       if(variableArr.length === 0) {
  //         variableArr.push(inputArr[i+1]);
  //       } else if (variableArr.includes(inputArr[i + 1]) === false) {
  //        variableArr.push(inputArr[i + 1]);
  //       }
  //     }
  //   }
  //   return variableArr;
  // }

}
