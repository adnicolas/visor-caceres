import { Component, OnInit, Input } from '@angular/core';
import { VsLayerWMS } from '@cotvisor/models/vs-layer-wms';
import { VsMapService } from '@cotvisor/services/vs-map.service';

@Component({
  selector: 'cot-wms-layer-loader',
  templateUrl: './wms-layer-loader.component.html',
  styleUrls: ['./wms-layer-loader.component.scss']
})
export class WmsLayerLoaderComponent implements OnInit {

  @Input() layerToLoad: {
    vsLayer: VsLayerWMS;
    loaded: boolean;
  };
  constructor(private mapService: VsMapService) { }

  ngOnInit() {
  }


  public loadLayer() {
    if (!this.layerToLoad.loaded) {
      this.mapService.addVsLayer(this.layerToLoad.vsLayer);
      this.layerToLoad.loaded = true;
    }
  }

}
