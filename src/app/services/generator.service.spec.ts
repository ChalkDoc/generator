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

  it('the return value should contain [1,1,1,1] when calling generatePermutations(variables)', () => {
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

  it('the return value should contain [1,1,1,1] when calling generatePermutations(variables)', () => {
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

  it('the return value should contain [1,1] when calling generatePermutations(variables)', () => {
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

  it('the return value should contain [1] when calling generatePermutations(variables)', () => {
    let a = new Variable("a", 0, 1, 5);
    let b = new Variable("b", 0, 1, 5);
    let variables: Variable[] = [a];

    let generatedCombinations = _generatorService.generatePermutations(variables);
    expect(generatedCombinations).toContain([1]);
  });
});
