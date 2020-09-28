import { TestBed } from '@angular/core/testing';

import { FrontendErrorManagerService } from './frontend-error-manager.service';

describe('FrontendErrorManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FrontendErrorManagerService = TestBed.get(FrontendErrorManagerService);
    expect(service).toBeTruthy();
  });
});
