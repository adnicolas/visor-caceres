import { Component, Input, OnInit } from '@angular/core';
import { UserMapModel } from '@cotvisor-admin/models';
import { UserMapsService } from '@cotvisor-admin/services';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { DynamicDialogRef } from 'primeng/api';

@Component({
  selector: 'cot-user-maps-loader-list',
  templateUrl: './user-maps-loader-list.component.html',
  styleUrls: ['./user-maps-loader-list.component.scss'],
})
export class UserMapsLoaderListComponent extends ParentComponent implements OnInit {

  @Input() public userId: number;
  public userMaps: UserMapModel[] = [];
  public mapsCols = [
    // { field: 'img', header: 'imagen', format: 'img' },
    { field: 'name', header: 'Nombre', format: 'text' },
    { field: 'description', header: 'Descripción', format: 'text' },
    { field: 'stampCreation', header: 'Creado', format: 'date' }

  ];

  constructor(public userMapsService: UserMapsService, private router: Router, private dynamicDialogRef: DynamicDialogRef) {
    super();

  }

  public ngOnInit(): void {

    this.userMapsService.userMaps$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (userMaps) => {
          this.userMaps = userMaps;
        }
      );
    // TODO obtener todos los mapas realacionados con el usuario, propios y no propios con permisos
    this.userMapsService.getReadableMaps();
  }

  public gotoUserMap(userMap: UserMapModel) {

    this.router.navigate([environment.pages.visor], { queryParams: { map: userMap.id } })
      .then(_ => {
        // Si dynamicDialogRef no es nulo está cargado en una modal por lo que la cerramos
        if (this.dynamicDialogRef) this.dynamicDialogRef.close();
      });
  }





}
