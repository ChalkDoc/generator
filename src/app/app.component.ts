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
    // let valuesArray = this.findValues('x^3 + x^2 + 5=-25', 'x', 2);
    // console.log(valuesArray);

    let object = [];
    let parametersArray = [
      {name: 'a', min: 1, max: 5},
      {name: 'b', min: 1, max: 5},
      {name: 'c', min: 1, max: 5},
      {name: 'x', min: 1, max: 5},
      {name: 'y', min: 2, max: 7}
    ];

    let testSet = [1, 1, 1, 1, 1];

    // for (let i = 0; i < parametersArray.length; i++) {
    //   object[i].name = testSet[i];
    // }
    for (let i = 0; i < parametersArray.length; i++) {
      var fantastic = parametersArray[i].name + ': ' + '\'' + testSet[i] + '\'';
      object.push(fantastic);
    }
      console.log(object);
      var finalString = object.join(", ");
      console.log(finalString);
      //object.push(parametersArray[i].name + ': ' + '\"' + testSet[i] + '\"');

      var hola = {'a': 1, 'b': 2, 'c': 3, 'x': 4, 'y': 5};
    var x = nerdamer('5*x+(x^2+2*x)*x+(x+2)');
    console.log(x.toString());
    var x = nerdamer('a + b + c + x + y', hola)
    //the substitutions was called but the functions weren't called
    console.log(x.toString());
    // var x = nerdamer('(x^2+2*x)*x+1+x+cos(y)',
    //   for (var i = 0; i < parametersArray.length; i++) { object[i] }, ['expand', 'numer']);
    // console.log(x.toString());
    // var x = nerdamer('(x^2+2*x)*x+1+x+cos(y)', {y: '7'}, ['expand', 'numer']);
    // console.log(x.text('decimals'));
  }

}
