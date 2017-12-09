import { Component, OnInit, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map'


// declare var $: any;    //declaring jQuery
 declare var Guppy: any;   //declaring Guppy

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
  output(type) {
    try {
      let content = Guppy.instances['equationBox'].backend.get_content(type);
        let stringifiedUserInput = content.toString();
        this.variables = this.extractVariables(content.toString());
        // to display the variables
        this.parameterDiv = $('.parameter-condition');
          this.parameterDiv.show();
          this.parameterDiv.html(' <h6 style="color:#ccc; display: inline;">These are the variables: </h6> <h3> ' + this.variables.sort().join(',') + '</h3');
    }catch (e) {
      alert('Parsing error!' + e);
      }
    }

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
}
