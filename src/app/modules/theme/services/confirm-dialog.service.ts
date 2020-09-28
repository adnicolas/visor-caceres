import { Injectable } from '@angular/core';
import { ConfirmationService, Confirmation } from 'primeng/primeng';

@Injectable()
export class ConfirmDialogService {

  constructor(private confirmationService: ConfirmationService) { }
  public open(config: Confirmation) {
    this.confirmationService.confirm(config);
  }
}
