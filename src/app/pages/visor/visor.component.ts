import { Component, OnDestroy } from '@angular/core';
import { VsMapService } from '@cotvisor/services/vs-map.service';
import { VsMap } from '@cotvisor/models/vs-map';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { takeWhile } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoggerService } from '@theme/services/logger.service';
import { ErrorBase } from '@theme/classes/error-base.class';
import { Message } from 'primeng/components/common/api';
import { UserMapsService } from '@cotvisor-admin/services';
import { UserMapModel } from '@cotvisor-admin/models';

@Component({
  selector: 'gss-visor',
  templateUrl: './visor.component.html',
  styleUrls: ['./visor.component.scss']
})
export class VisorComponent implements OnDestroy {

  private alive = true;
  mapLoadError = false;
  map: VsMap = null;
  mapErrors: Message[] = [];

  // ¡¡¡¡¡¡OJO !!!!!! , si guardamos el estado del componente, este no se destruye
  ngOnDestroy(): void {
    this.alive = false;
  }



  constructor(private vsMapService: VsMapService, private userMapsService: UserMapsService, private activatedRoute: ActivatedRoute, private logger: LoggerService) {



    // Cuando no es nuevo mapa, en parametros get nos llega el mapa a cargar
    this.activatedRoute.queryParamMap
      .pipe(takeWhile(_ => this.alive))
      .subscribe(
        (params: ParamMap) => {
          const mapQueryParam = params.get('map');
          switch (mapQueryParam) {
            case 'new':
              this.generateMapFromTemplate();
              break;
            case null:
              this.generateUserMap(environment.default_visor_map_id);
              break;
            default:
              const mapId = parseInt(params.get('map'), 10);
              this.generateUserMap(mapId);
              break;
          }
        }
      );


    // // Crea mapa demo sin usermap
    // this.vsMapService.newMap().then(
    //   map => {
    //     this.map = map;
    //   }
    // );
  }

  /**
   * establece this.map al mapa recibido por aprametor
   *
   * @private
   * @param {number} mapId
   *
   * @memberOf VisorComponent
   */
  private generateUserMap(mapId: number) {

    // Antes de generar un nuevo mapa eliminamos el actual
    if (this.map) {
      this.vsMapService.removeMap(this.map);
      this.map = null;
    }

    this.userMapsService.get(mapId)
      .pipe(takeWhile(_ => this.alive))
      .subscribe(
        (userMap: UserMapModel) => {
          this.vsMapService.newMap(undefined, userMap).then(
            (newMap) => {
              setTimeout(
                () => { this.map = newMap; }, 0);
            }
          );
        },
        (error: ErrorBase) => {
          this.mapLoadError = true;
          this.mapErrors.push({ severity: 'error', summary: 'Error al cargar el mapa', detail: `No se ha podido cargar el mapa ${mapId}. ${error.title} ` });
          this.logger.error(JSON.stringify(this.mapErrors[0]));
        }
      );
  }

  /**
   * establece this.map al mapa recibido por aprametor
   *
   * @private
   * @param {number} mapId
   *
   * @memberOf VisorComponent
   */
  private generateMapFromTemplate() {

    // Antes de generar un nuevo mapa eliminamos el actual
    if (this.map) {
      this.vsMapService.removeMap(this.map);
      this.map = null;
    }

    this.userMapsService.getMapTemplate()
      .pipe(takeWhile(_ => this.alive))
      .subscribe(
        (userMap: UserMapModel) => {
          this.vsMapService.newMap(undefined, userMap).then(
            (newMap) => {
              setTimeout(
                () => { this.map = newMap; }, 0);
            }
          );
        },
        (error: ErrorBase) => {
          this.mapLoadError = true;
          this.mapErrors.push({ severity: 'error', summary: 'Error al generar nuevo mapa', detail: `No se ha podido cargar la plantilla. ${error.title} ` });
          this.logger.error(JSON.stringify(this.mapErrors[0]));
        }
      );
  }
}

