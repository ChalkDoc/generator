import { TestBed, inject } from '@angular/core/testing';

import { GenertorService } from './genertor.service';

describe('GenertorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenertorService]
    });
  });

  it('should be created', inject([GenertorService], (service: GenertorService) => {
    expect(service).toBeTruthy();
  }));
});
