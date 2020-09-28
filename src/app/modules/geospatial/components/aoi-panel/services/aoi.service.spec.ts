import { TestBed } from '@angular/core/testing';

import { AoiService } from './aoi.service';

describe('AoiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AoiService = TestBed.get(AoiService);
    expect(service).toBeTruthy();
  });
});
