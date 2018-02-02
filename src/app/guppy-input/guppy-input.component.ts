import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Variable } from "../variable";
import * as nerdamer from "nerdamer";

// import 'nerdamer/Solve';
// import 'nerdamer/Algebra';
// import 'nerdamer/Calculus';
// import 'nerdamer/Extra';

declare var Guppy: any;

@Component({
  selector: "guppy-input",
  templateUrl: "./guppy-input.component.html",
  styleUrls: ["./guppy-input.component.css"]
})
export class GuppyInputComponent implements OnInit {
  error: string;
  parameterDiv = false;
  variables: Variable[] = [];
  equation: string;

  constructor() {}

  ngOnInit() {
    Guppy.init_symbols(["/assets/symbols.json"]);
    const guppy = new Guppy("equationBox");
  }

  /* this is to get the content of the guppy box,
    it also converts the mathematical equation/expression into the desired format type(latex, asciimath, text, ast, eqns, function, xml)*/
  output() {
    try {
      this.error = "";
      this.equation = Guppy.instances["equationBox"].backend.get_content(
        "text"
      );
      const extractedVars = nerdamer(this.equation).variables();
      /* creating variable instance and pushing each variable instance into the variables array*/
      for (let i = 0; i < extractedVars.length; i++) {
        const varName: string = extractedVars[i];
        const newVar = new Variable(varName);
        this.variables.push(newVar);
      }
      console.log(this.variables);
      this.parameterDiv = true;
    } catch (e) {
      this.error = "Parsing error!" + e;
    }
  }
}
