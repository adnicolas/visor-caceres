import { TestBed } from '@angular/core/testing';
import { DynamicDialogService } from './dynamic-dialog.service';

describe('DialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DynamicDialogService = TestBed.get(DynamicDialogService);
    expect(service).toBeTruthy();
  });
});
