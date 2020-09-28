import { TestBed } from '@angular/core/testing';

import { PanelsManagerService } from './panels-manager.service';

describe('SidebarsManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PanelsManagerService = TestBed.get(PanelsManagerService);
    expect(service).toBeTruthy();
  });
});
