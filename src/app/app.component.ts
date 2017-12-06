import { Component, OnInit, AfterViewChecked } from '@angular/core';
import * as $ from 'jquery';

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

  ngOnInit() {
    Guppy.init_symbols(['https://cdn.rawgit.com/daniel3735928559/guppy/24d744fd/sym/symbols.json']);
  }

  ngAfterViewChecked() {
    //new Guppy("equationBox");
    this.guppyBox = $('.equation-container');
    if (!this.guppyBox.data('g')) {
    let guppy = new Guppy('equationBox');
      $(this.guppyBox).data('g', true);
    }
  }

  // this is to get the content of the guppy box,
  // it also converts the mathematical equation/expression into the desired format type(latex, asciimath, text, ast, eqns, function, xml)
  output(type) {
    console.log(type);
    let content = Guppy.instances['equationBox'].backend.get_content(type);
   	console.log(content);
    // try {
    //   let content = Guppy.instances['equationBox'].backend.get_content(type);
    //   content = JSON.stringify(content);
    // }catch (e) {
    //   alert('Parsing error!' + e);
    //   }
    }
    
// this method extracts out the variables from the string input
  extractVariables(input) {
    let variableArr: string[];
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
