import { Component } from '@angular/core';
import { AreaSelectionService } from '@cotvisor/services/area-selection.service';
import { takeUntil, take } from 'rxjs/operators';
import { ThemeService } from '@theme/services/theme.service';
import { AoiService } from '@geospatial/components/aoi-panel/services/aoi.service';
import { ToastService } from '@theme/services/toast.service';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { TranslateService } from '@ngx-translate/core';
import { GeospatialParentComponent } from '@geospatial/classes/geospatial-parent-component.class';
import { AOIModel } from '@geospatial/classes/aoi.model';

/**
 *
 * Componente que muestra una ventana al realizarse una seleccion de área
 * para ofrecer su guardado como AOI
 *
 * @export
 * @class AoiNewComponent
 * @extends {GeospatialParentComponent}
 */
@Component({
  selector: 'gss-aoi-new',
  templateUrl: './aoi-new.component.html',
  styleUrls: ['./aoi-new.component.scss']
})
// TODO no podemos importar del parent del visor para tener los literales en tierra3, debemos tener la funcionalidad en el parent de tierra3
export class AoiNewComponent extends GeospatialParentComponent {
  active: boolean;
  displaced: boolean;
  aoiName: string;
  currentAreas: ol.Feature[];
  showSpinner: boolean = false;

  constructor(private toastService: ToastService, private areaSelectionService: AreaSelectionService, private themeService: ThemeService, private aoiService: AoiService, private translateService: TranslateService) {
    super();
    this.active = false;
    this.areaSelectionService.getArea()
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((areas) => {
        this.active = areas.length > 0;
        this.currentAreas = areas;
      });
    this.themeService.panelOpen$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe((panelOpen) => {
        this.displaced = panelOpen;
      });


  }

  saveAOI() {
    this.showSpinner = true;
    const aoi = new AOIModel();
    aoi.name = this.aoiName;
    aoi.areasWKT = Utilities.writeWKTFeatures(this.currentAreas);
    this.aoiService.add(aoi)
      .pipe(
        take(1)
      )
      .subscribe(
        (savedAoi) => {
          this.showSpinner = false;
          this.toastService.showSuccess({ summary: this.translateService.instant('GLOBAL.SAVED'), detail: ` ${this.translateService.instant('AOI.AOI')} ${savedAoi.name} ${this.translateService.instant('GLOBAL.SAVED').toLowerCase()} ` });
          this.aoiName = '';
        },
        (error) => {
          this.showSpinner = false;
          this.toastService.showError({ summary: error.title, detail: error.message });
        }
      );

  }

}
