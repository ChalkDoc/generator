import { Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/map';
import { FormsModule } from '@angular/forms';

import { Variable } from './variable';
import { GenertorService } from './services/genertor.service';

declare var GuppyOSK: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [GenertorService]
})

export class AppComponent implements OnInit {
  title = 'app';
  constructor(private _generatorServic: GenertorService) {}

  ngOnInit() {
    // let valuesArray = this._generatorServic.findValues('x^3 + x^2 + 5=-25', 'x', 2);
    // console.log(valuesArray);
  }
}
