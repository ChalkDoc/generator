import { Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import { FormsModule } from '@angular/forms';

import { Variable } from './variable';
import { GeneratorService } from './services/generator.service';

declare var GuppyOSK: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GeneratorService]
})

export class AppComponent implements OnInit {
  title = 'app';
  constructor(private _generatorService: GeneratorService) {}

  ngOnInit() {
    // let valuesArray = this._generatorService.findValues('x^3 + x^2 + 5=-25', 'x', 2);
    // console.log(valuesArray);
    let parameters = [
      {name: 'a'},
      {name: 'b'},
      {name: 'c'},
      {name: 'd'},
      {name: 'e'}
    ];

    let test = [1, 2, 3, 4, 5];

    let equation = 'a + b + c + d + e';

    // let newValue = calculateLastVariable(parameters, test, equation);
    // console.log(newValue);
  }

}
