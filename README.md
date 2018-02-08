# Generator

Angular application that allows the user to enter an equation, set parameters for variables (decimal point, minimum value, maximum value), choose the variable to sovle for, number of problems desired and then displays a table of values for each variable.

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.0.

<img align="left" src="https://www.excitor.com/sites/default/files/Document-Icon-small_3.png" /><br><br><br>





### See the [Documentaion](https://github.com/ChalkDoc/generator/wiki)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running Unit Tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Installation and Setup
* Clone this repository
* Run `npm install`
* Run `bower install`
* Run `ng serve`
* If you get the error:

```
Versions of @angular/compiler-cli and typescript could not be determined.
The most common reason for this is a broken npm install.

Please make sure your package.json contains both @angular/compiler-cli and typescript in
devDependencies, then delete node_modules and package-lock.json (if you have one) and
run npm install again.
```

> run `npm install --dev` and `ng serve`

* If you get the error:
```
Your global Angular CLI version (1.6.0) is greater than your local
version (1.5.5). The local Angular CLI version is used.
```
> run
```
npm uninstall --save-dev angular-cli
```
followed by
```
npm install --save-dev @angular/cli@latest
```
## Technologies Used
* [Angular CLI](https://cli.angular.io/)
* [JavaScript](https://www.javascript.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [Jasmine](https://jasmine.github.io/)
* [Bower](https://bower.io/)
* [npm](https://www.npmjs.com/)
* [Node Js](https://nodejs.org/en/)
* [Karma](https://karma-runner.github.io/2.0/index.html)
* [Guppy](https://www.npmjs.com/package/guppymath)
* [Bootstrap 4](https://v4-alpha.getbootstrap.com/)
* [Nerdamer](http://nerdamer.com/)
* [Lodash](https://lodash.com/)

## Notes

* We used [hash collision probailities](http://preshing.com/20110504/hash-collision-probabilities/) in order to determine how the program should obtain possible variable values.
* Right now the guppy icons are commented out(assets/scripts/guppy.min.js line 1128). We are currently using version 1.1. May want to consider using newer version in the future.


## Future Work:
* Add integration tests.
* Taking in additional parameters.
* Supporting other inputs (ex. system of equations).
* Displaying output to user specification(LaTeX).
* Specify what the answer should look like (ex. pair, number, simplified equations)
* Include multiple choice functionality.

## Known Bugs

* User can enter negative number for number of problems.
* Can't take all equations (-x^2 = y)
* In generator.service.ts max invalid counter is set to a hard coded number, however needs to be dynamic or else the results are restrictive.
* Each variable varialble must require the same number of decimals, otherwise no solutions are generated. The program should be able to handle cases where the variables decPoint property varies. 

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/20192033?v=4" width="100px;"/><br /><sub><b>ElreyB</b></sub>](https://github.com/ElreyB)<br />[📖](https://github.com/chalkdoc/generator/commits?author=ElreyB "Documentation") [💻](https://github.com/chalkdoc/generator/commits?author=ElreyB "Code") [🐛](https://github.com/chalkdoc/generator/issues?q=author%3AElreyB "Bug reports") | [<img src="https://avatars2.githubusercontent.com/u/30602856?v=4" width="100px;"/><br /><sub><b>Mitch Long</b></sub>](https://github.com/mwlong23)<br />[⚠️](https://github.com/chalkdoc/generator/commits?author=mwlong23 "Tests") [💻](https://github.com/chalkdoc/generator/commits?author=mwlong23 "Code") [📖](https://github.com/chalkdoc/generator/commits?author=mwlong23 "Documentation") [🐛](https://github.com/chalkdoc/generator/issues?q=author%3Amwlong23 "Bug reports") | [<img src="https://avatars0.githubusercontent.com/u/15882954?v=4" width="100px;"/><br /><sub><b>Kristen Marie Kulha</b></sub>](https://github.com/kristenmarie)<br />[💻](https://github.com/chalkdoc/generator/commits?author=kristenmarie "Code") [📖](https://github.com/chalkdoc/generator/commits?author=kristenmarie "Documentation") [🐛](https://github.com/chalkdoc/generator/issues?q=author%3Akristenmarie "Bug reports") | [<img src="https://avatars1.githubusercontent.com/u/22184995?v=4" width="100px;"/><br /><sub><b>Kim Schulze</b></sub>](https://github.com/kayschulze)<br />[💻](https://github.com/chalkdoc/generator/commits?author=kayschulze "Code") [⚠️](https://github.com/chalkdoc/generator/commits?author=kayschulze "Tests") | [<img src="https://avatars0.githubusercontent.com/u/21222181?v=4" width="100px;"/><br /><sub><b>mwoldemedihin</b></sub>](https://github.com/mwoldemedihin)<br />[📖](https://github.com/chalkdoc/generator/commits?author=mwoldemedihin "Documentation") [💻](https://github.com/chalkdoc/generator/commits?author=mwoldemedihin "Code") [⚠️](https://github.com/chalkdoc/generator/commits?author=mwoldemedihin "Tests") [🎨](#design-mwoldemedihin "Design") |
| :---: | :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->
Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors) specification. Contributions of any kind welcome!