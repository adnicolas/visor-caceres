import * as ol from 'openlayers';
export class MeasureFeature {

  public overlays: ol.Overlay[];
  public feature: ol.Feature;
  public id: number;

  constructor(options: any) {
    this.feature = options.feature;
    this.overlays = [];
  }

  public getOverlays(): ol.Overlay[] {
    return this.overlays;
  }

  public getId(): number {
    return this.id;
  }

  public setId(id: number): void {
    this.id = id;
    this.feature.setId(id);
  }

  public setOverlays(overlays: ol.Overlay[]): void {
    this.overlays = overlays;
  }

  public addOverlay(overlay: ol.Overlay): void {
    this.overlays.push(overlay);
  }

  public removeOverlays(): void {
    for (const overlay of this.overlays) {
      const map = overlay.getMap();
      map.removeOverlay(overlay);
    }
  }

  public removeFeature(source: ol.source.Vector): void {
    source.removeFeature(this.feature);
  }

  public reproyectFeatureAndOverlay(srcOrigin: string, srcdestiny: string): void {

    const geom = this.feature.getGeometry();
    geom.transform(srcOrigin, srcdestiny);
    for (const overlay of this.overlays) {
      // recolocar el overlay
      const overlayPosition: ol.Coordinate = overlay.getPosition();
      const reproyectedPosition = ol.proj.transform(overlayPosition, srcOrigin, srcdestiny);
      overlay.setPosition(reproyectedPosition);
    }

  }

}
