import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { UserMapModel } from '@cotvisor-admin/models';
import { UserMapsService } from '@cotvisor-admin/services';
import { ParentComponent } from '@cotvisor/classes/parent/parent-component.class';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { takeUntil } from 'rxjs/operators';
import { ConfirmDialogService } from '@theme/services/confirm-dialog.service';

@Component({
  selector: 'cot-user-maps-list',
  templateUrl: './user-maps-list.component.html',
  styleUrls: ['./user-maps-list.component.scss'],
})
export class UserMapsListComponent extends ParentComponent implements OnInit {

  // @Input() private user: UserModel;
  @Output() selectedMap: EventEmitter<UserMapModel> = new EventEmitter();
  @Output() goToMap: EventEmitter<number> = new EventEmitter();
  public userMaps: UserMapModel[] = [];
  public mapsCols = [
    { field: 'img', header: 'imagen', format: 'img', hideFilter: true },
    { field: 'name', header: 'Nombre', format: 'text' },
    { field: 'description', header: 'Descripción', format: 'text' },
    { field: 'stampCreation', header: 'Creado', format: 'date' }
  ];

  constructor(
    public userMapsService: UserMapsService,
    private router: Router,
    private confirmDialogService: ConfirmDialogService) {
    super();
    this.useLiterals(['MAPMANAGER.DELETE_MAP', 'MAPMANAGER.DELETE_MAP_CONFIRM']);
  }

  public ngOnInit(): void {

    this.userMapsService.userMaps$
      .pipe(takeUntil(this.unSubscribe))
      .subscribe(
        (userMaps) => {
          this.userMaps = userMaps;
        }
      );
    this.userMapsService.getReadableMaps();
    // TODO @ADR: Solicitar endpoint en backend que devuelva todos los mapas?
    /*for (const rol of this.user.roles) {
      if (rol.name === 'USUARIO') {
        this.userMapsService.getForUser(this.user.id);
      } else if (rol.name === 'ADMINISTRADOR') {
        this.userMapsService.getAll();
      }
    }*/
  }

  public gotoUserMap(userMap: UserMapModel) {

    this.router.navigate([environment.pages.visor], { queryParams: { map: userMap.id } });
  }

  public emitGoToMap(userMap: UserMapModel) {

    this.goToMap.emit(userMap.id);
  }


  public deleteMap($event: { row: UserMapModel, deleteConfirm: () => void }) {

    this.confirmDialogService.open({
      message: this.componentLiterals['MAPMANAGER.DELETE_MAP_CONFIRM'],
      header: this.componentLiterals['MAPMANAGER.DELETE_MAP'],
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userMapsService.delete($event.row.id)
          .pipe(takeUntil(this.unSubscribe))
          .subscribe(() => $event.deleteConfirm());

      },
      reject: () => { }
    });

  }

  public emitSelectedMap(mapSelected: UserMapModel) {
    this.selectedMap.emit(mapSelected);
  }

}
