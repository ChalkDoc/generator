import { TestBed, inject } from '@angular/core/testing';

import { GeneratorService } from './generator.service';
import { Variable } from '../variable';

describe('GenertorService and all of its methods', () => {
  let _generatorService: GeneratorService;

  beforeEach(() => {
    _generatorService = new GeneratorService();
    TestBed.configureTestingModule({
      providers: [GeneratorService]
    });
  });

  it('should be created', inject([GeneratorService], (_generatorService: GeneratorService) => {
    expect(_generatorService).toBeTruthy();
  }));

  it('should return 625 when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let c = new Variable("c", 0, 1, 5);
    let x = new Variable("x", 0, 1, 5);
    let variables: Variable[] = [a, b, c, x];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations.length).toBe(625);
  });

  it('should contain [1,1,1,1] when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let c = new Variable("c", 0, 1, 5);
    let x = new Variable("x", 0, 1, 5);
    let variables: Variable[] = [a, b, c, x];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations).toContain([1,1,1,1]);
  });

  it('should return 125 when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let c = new Variable("c", 0, 1, 5);
    let variables: Variable[] = [a, b, c];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations.length).toBe(125);
  });

  it('should contain [1,1,1,1] when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let c = new Variable("c", 0, 1, 5);
    let variables: Variable[] = [a, b, c];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations).toContain([1,1,1]);
  });

  it('should return 25 when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let variables: Variable[] = [a, b];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations.length).toBe(25);
  });

  it('should contain [1,1] when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let variables: Variable[] = [a, b];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations).toContain([1,1]);
  });

  it('should return 5 when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let variables: Variable[] = [a];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations.length).toBe(5);
  });

  it('should contain [1] when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let variables: Variable[] = [a];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations).toContain([1]);
  });

  it('should return "[-a]" when calling simplifyEquation(equation, variableToSolve)', () => {
    let equation = "x + a = 0";
    let variableToSolve = new Variable("x",  0, 0, 0);

    let simplifiedEquation = _generatorService.simplifyEquation(equation, variableToSolve.name);
    expect(simplifiedEquation.toString()).toBe('[-a]');
  });

  it('should return "[sqrt(-a), -sqrt(-a)]" when calling simplifyEquation(equation, variableToSolve)', () => {
    let equation = "x^2 + a = 0";
    let variableToSolve = new Variable("x",  0, 0, 0);

    let simplifiedEquation = _generatorService.simplifyEquation(equation, variableToSolve.name);
    expect(simplifiedEquation.toString()).toBe('[sqrt(-a),-sqrt(-a)]');
  });

  it('should return "[(-220328269/832788672)*(27*a+27*abs(a))^(1/3),(220328269/1665577344)*((138907099/80198051)*i+1)*(27*a+27*abs(a))^(1/3),(220328269/1665577344)*((-138907099/80198051)*i+1)*(27*a+27*abs(a))^(1/3)]" when calling simplifyEquation(equation, variableToSolve)', () => {
    let equation = "x^3 + a = 0";
    let variableToSolve = new Variable("x",  0, 0, 0);

    let simplifiedEquation = _generatorService.simplifyEquation(equation, variableToSolve.name);
    expect(simplifiedEquation.toString()).toBe('[(-220328269/832788672)*(27*a+27*abs(a))^(1/3),(220328269/1665577344)*((138907099/80198051)*i+1)*(27*a+27*abs(a))^(1/3),(220328269/1665577344)*((-138907099/80198051)*i+1)*(27*a+27*abs(a))^(1/3)]');
  });

  it('should return "[(1/2)*(-b+sqrt(-4*a*c+b^2))*a^(-1),(1/2)*(-b-sqrt(-4*a*c+b^2))*a^(-1)]" when calling simplifyEquation(equation, variableToSolve)', () => {
    let equation = "a*x^2 + b*x + c = 0";
    let variableToSolve = new Variable("x",  0, 0, 0);

    let simplifiedEquation = _generatorService.simplifyEquation(equation, variableToSolve.name);
    expect(simplifiedEquation.toString()).toBe('[(1/2)*(-b+sqrt(-4*a*c+b^2))*a^(-1),(1/2)*(-b-sqrt(-4*a*c+b^2))*a^(-1)]');
  });
});
