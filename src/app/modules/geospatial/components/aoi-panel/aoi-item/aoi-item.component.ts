import { Component, OnInit, Input } from '@angular/core';
import { AoiService } from '@geospatial/components/aoi-panel/services/aoi.service';
import { AreaSelectionService } from '@cotvisor/services/area-selection.service';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { AOIModel } from '@geospatial/classes/aoi.model';

/**
 * Componente que muestra un AOI recibido por parámetro
 *
 * @export
 * @class AoiItemComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'gss-aoi-item',
  templateUrl: './aoi-item.component.html',
  styleUrls: ['./aoi-item.component.scss'],
})
// TODO Implementar lógica de literales en el tema mediante interfaces
export class AoiItemComponent extends ParentComponent implements OnInit {
  @Input() aoi: AOIModel;

  constructor(
    private aoiService: AoiService,
    private areaSelectionService: AreaSelectionService,
    private confirmDialogService: ConfirmDialogService,
  ) {
    super();
  }

  ngOnInit() {
    // recoge traducciones
    this.useLiterals(['GLOBAL.DELETE_CONFIRM', 'AOI.DELETE']);
  }

  deleteAOI() {
    this.confirmDialogService.open({
      message: this.componentLiterals['GLOBAL.DELETE_CONFIRM'],
      header: this.componentLiterals['AOI.DELETE_QUESTION'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.aoiService.delete(this.aoi.id);
      },
      reject: () => { },
    });
  }

  setAOI() {
    const aoiFeatures = Utilities.readWKTFeatures(this.aoi.areasWKT);
    if (aoiFeatures) this.areaSelectionService.setAreaToActiveMap(aoiFeatures);
  }
}
