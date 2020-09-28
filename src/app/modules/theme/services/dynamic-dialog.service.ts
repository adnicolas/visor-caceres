import { Injectable } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/api';

/**
 * Servicio de dialogs
 *
 *
 * @export
 * @class DynamicDialogService
 */
@Injectable()
// tslint:disable:no-string-literal
export class DynamicDialogService {

  constructor(private dialogService: DialogService,
    // private themeService: ThemeService
  ) {
  }

  public open(component: any, title: string, data?: any): DynamicDialogRef {
    const dialogConfig = new DynamicDialogConfig();
    // FIXME no funciona el método del servicio
    // const letdoubleheaderHeight = parseInt(this.themeService.getCssVar('headerHeight'), 10) * 2;
    // dialogConfig.contentStyle = { width: '100%', 'max-height': `calc(100vh - ${letdoubleheaderHeight}px)`, overflow: 'auto' };
    dialogConfig.contentStyle = { width: '100%', 'max-height': `calc(100vh - 100px)`, overflow: 'auto' };

    dialogConfig.header = title;
    // dialogConfig.transitionOptions = '0ms';
    dialogConfig.data = data;

    return this.dialogService.open(component, dialogConfig);

  }

}


