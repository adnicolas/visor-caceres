import { VsMap } from './vs-map';
import { UserMapModel } from '@cotvisor-admin/models/user-map.model';
import { Observable } from 'rxjs/Observable';
import { Utilities } from '@cotvisor/classes/utils/utilities.class';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

export class VsMapUserMap extends VsMap {
  /**
   *  Objeto Mapa de usuario leído de BBDD a partir del que se ha generado el vsMap
   */
  public userMapSource: UserMapModel;

  constructor(options: any, userMap: UserMapModel) {
    super(options);
    this.userMapSource = userMap;
  }

  public setAttributesBeforeSave() {
    const view = this.getView();
    const extent = view.calculateExtent();
    this.userMapSource.bboxMinX = extent[0];
    this.userMapSource.bboxMinY = extent[1];
    this.userMapSource.bboxMaxX = extent[2];
    this.userMapSource.bboxMaxY = extent[3];
    this.userMapSource.projection = view.getProjection().getCode();
  }

  public generateMapThumbnail(): Observable<string> {

    return new Observable(observer => {


      this.once('postcompose', (event: ol.render.Event) => {
        try {
          const canvas = event.context.canvas;
          const imgBase64 = canvas.toDataURL();
          // https://developer.mozilla.org/es/docs/Web/HTML/Imagen_con_CORS_habilitado
          Utilities.resizeBase64Image(imgBase64, canvas.width * environment.default_visor_map_thumbnail_factor_size, canvas.height * environment.default_visor_map_thumbnail_factor_size)
            .pipe(take(1))
            .subscribe(
              (resizedImgBase64) => {
                observer.next(resizedImgBase64);
                observer.complete();
              },
              error => observer.error(error)

            );
        } catch (error) {
          observer.error(error);
        }
      });
      this.renderSync();



    });


  }

}
