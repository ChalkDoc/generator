import { Component, OnInit} from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FormsModule } from '@angular/forms';

import { Variable } from './variable';

declare var GuppyOSK: any;

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
  }

}
