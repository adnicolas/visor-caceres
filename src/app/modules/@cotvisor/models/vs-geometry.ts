import * as ol from 'openlayers';

/**
 * Encapsulación de la clase Geometry de OpenLayers
 *
 */

export class VsGeometry extends ol.geom.Geometry {

  constructor(options: any) {
    super();
  }

}

/**
 * Encapsulación de la clase Polígono de OpenLayers
 */

export class VsPolygon extends ol.geom.Polygon {

  constructor(options: any) {
    super(options);
  }

}
