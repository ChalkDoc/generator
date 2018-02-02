import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { routing } from './app.routing';

import { AppComponent } from './app.component';

import { HttpModule } from '@angular/http';
import { EquationComponent } from './equation/equation.component';
import { GuppyInputComponent } from './guppy-input/guppy-input.component';

@NgModule({
  declarations: [
    AppComponent,
    EquationComponent,
    GuppyInputComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
