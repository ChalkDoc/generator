/* tslint:disable:max-line-length */
import { TestBed, inject } from '@angular/core/testing';

import { GeneratorService } from './generator.service';

import { Variable } from '../variable';

describe('GeneratorService and all of its methods', () => {
  let _generatorService: GeneratorService;
  const a = new Variable('a', 0, 1, 5);
  const b = new Variable('b', 0, 1, 5);
  const c = new Variable('c', 0, 1, 5);
  const x = new Variable('x', 0, -100, 100);
  const variables: Variable[] = [a, b, c, x];

  beforeEach(() => {
    _generatorService = new GeneratorService();
    TestBed.configureTestingModule({
      providers: [GeneratorService]
    });
  });

  it('should be created', inject([GeneratorService], (_gs: GeneratorService) => {
    expect(_gs).toEqual(_generatorService);
  }));






});
