import { Component } from '@angular/core';
import { of } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { VsLayer } from '@cotvisor/models/vs-layer';
import { VsMap } from '@cotvisor/models/vs-map';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { VsMapUserMap } from '@cotvisor/models/vs-map-user-map';

@Component({
  selector: 'cot-map-gallery',
  templateUrl: './map-gallery.component.html',
  styleUrls: ['./map-gallery.component.scss']
})
export class MapGalleryComponent extends ParentComponent {
  public baseLayers: VsLayer[] = [];
  protected containerOpen: boolean = true;
  protected activeMap: VsMap | VsMapUserMap;

  public private;
  constructor(
    private mapService: VsMapService,
  ) {
    super();
    this.mapService.activeMapChanged$
      .pipe(
        takeUntil(this.unSubscribe),
        switchMap((map: VsMap) => {
          if (map) {
            this.activeMap = map;
            return map.observableBaseLayersMapLoaded$;
          } else {
            return of(null);
          }
        })
      )

      .subscribe((loaded) => {
        if (loaded) {
          this.baseLayers = this.activeMap.getBaseLayers();

        }
      });
  }

  public setActiveBaseLayer(baseLayer: VsLayer) {
    let baseLayerId: number;
    for (const bl of this.baseLayers) {
      if (bl === baseLayer) {
        bl.setVisible(true);
        baseLayerId = bl.id;
      } else {
        bl.setVisible(false);
      }
    }
    if (this.activeMap instanceof VsMapUserMap) {
      this.activeMap.userMapSource.baseLayerId = baseLayerId;
    }

  }

  public toggleContainer() {
    this.containerOpen = !this.containerOpen;
  }
}
