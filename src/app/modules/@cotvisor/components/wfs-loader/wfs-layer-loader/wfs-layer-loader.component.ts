import { Component, OnInit, Input } from '@angular/core';
import { VsLayerWFS } from '@cotvisor/models/vs-layer-wfs';
import { VsMapService } from '@cotvisor/services/vs-map.service';

@Component({
  selector: 'cot-wfs-layer-loader',
  templateUrl: './wfs-layer-loader.component.html',
  styleUrls: ['./wfs-layer-loader.component.scss']
})
export class WfsLayerLoaderComponent implements OnInit {

  @Input() layerToLoad: {
    vsLayer: VsLayerWFS;
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
