import {
  Directive,
  Input,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  ComponentFactoryResolver
} from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { takeUntil, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { GlobalAuthService, UserGroupsService, PermissionsService, ShareService } from '@cotvisor-admin/services';
import { PermissionModel, PermissionResourceModel, UserModel } from '@cotvisor-admin/models';
import { SubjectTypes } from '@cotvisor-admin/classes/subject-types.enum';
import { ToastService } from '@theme/services/toast.service';
import { ResourceActions } from '@cotvisor-admin/classes/resource-actions.enum';
import { MessagesComponent } from '@theme/components/messages/messages.component';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[loggedUserCan]'
})
export class LoggedUserCanDirective implements OnInit, OnDestroy {
  // the role the user must have
  @Input() loggedUserCan: { action: string, resourceId: string, resourceType: string, resourceOwner: UserModel };

  stop$ = new Subject();

  isVisible = false;


  /**
   * Creates an instance of LoggedUserCanDirective.
   * @param {ViewContainerRef} viewContainerRef la ubicacion donde renderizar el templateRef
   * @param {TemplateRef<any>} templateRef  el templateRef a renderizar
   * @param {GlobalAuthService} globalAuthService - Servicio de autenticacion para obtener roles y permisos
   *
   * @memberOf LoggedUserCanDirective
   */
  constructor(
    private viewContainerRef: ViewContainerRef,
    private templateRef: TemplateRef<any>,
    private globalAuthService: GlobalAuthService,
    private userGroupsService: UserGroupsService,
    private permissionsService: PermissionsService,
    private toastService: ToastService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private shareService: ShareService
  ) { }

  ngOnInit() {
    this.permissionsService.getAll();
    this.shareService.getPermissionsResourcesByResourceId(this.loggedUserCan.resourceId);
    //  Nos subscribimos al estado para conocer los permisos del usuario
    this.globalAuthService.authState$.pipe(takeUntil(this.stop$)).subscribe(user => {
      // TODO @ADR: Otra alternativa sería verificar todo esto a partir del ROLE (a priori mucho más sencillo)
      // this.usersService.getUserGroups(user.id);
      if (this.loggedUserCan.resourceOwner.id === user.id && (
        this.loggedUserCan.action === ResourceActions.READ ||
        this.loggedUserCan.action === ResourceActions.WRITE ||
        this.loggedUserCan.action === ResourceActions.ADMIN)
      ) {
        this.renderComponent();
      } else {
        this.userGroupsService.getForUser(user.id);
        combineLatest(
          this.permissionsService.permissions$,
          this.shareService.permissionsResources$,
          this.userGroupsService.userGroups$
        ).pipe(
          take(1),
        ).subscribe(([permissions, permissionsResources, userGroups]) => {
          const permission: PermissionModel = permissions.find(permiso =>
            permiso.name === this.loggedUserCan.action
          );
          const resourcePermissionFilter: PermissionResourceModel[] = permissionsResources.filter(permissionResource =>
            permissionResource.resourceType === this.loggedUserCan.resourceType &&
            permissionResource.keyId.permissionId === permission.id
          );
          const userFilter: PermissionResourceModel[] = resourcePermissionFilter.filter(permissionResource =>
            permissionResource.keyId.subjectId === user.id && permissionResource.subjectType === SubjectTypes.USER
          );
          const groupFilter: PermissionResourceModel[] = [];
          userGroups.forEach(userGroup => {
            resourcePermissionFilter.forEach(permissionResource => {
              if (permissionResource.subjectType === SubjectTypes.GROUP && permissionResource.keyId.subjectId === userGroup.id) {
                groupFilter.push(permissionResource);
              }
            });
          });
          let filteredPermissionsResources: PermissionResourceModel[] = [...userFilter, ...groupFilter];
          filteredPermissionsResources = filteredPermissionsResources.filter((permiso, index, self) =>
            index === self.findIndex((t) => (
              t.keyId.permissionId === permiso.keyId.permissionId &&
              t.keyId.resourceId === permiso.keyId.resourceId &&
              t.resourceType === permiso.resourceType &&
              t.keyId.subjectId === permiso.keyId.subjectId &&
              t.subjectType === permiso.subjectType
            ))
          );
          if (filteredPermissionsResources.length > 0) {
            this.renderComponent();
          } else {
            // si el usuario no tiene el rol actualizamos visible y eliminamos contenido del viewContainerRef
            this.isVisible = false;
            this.viewContainerRef.clear();
            switch (this.loggedUserCan.action) {
              case ResourceActions.ADMIN:
                const cmpFactory = this.componentFactoryResolver.resolveComponentFactory(MessagesComponent);
                const messageComponentRef = this.viewContainerRef.createComponent(cmpFactory);
                messageComponentRef.instance.severity = 'info';
                messageComponentRef.instance.text = 'No cuenta con permisos de administración para este recurso';
            }
          }
        }, error => {
          this.toastService.showError({ summary: 'Error', detail: 'Error al filtrar los permisos otorgados a recursos' + error });

        });
      }
    });
  }

  renderComponent() {
    // si ya está visible no tenemos que añadirlo de nuevo
    if (!this.isVisible) {
      // activamos el check visible
      // y añadimos el templateRef a la vista con 'createEmbeddedView' de viewContainerRef
      this.isVisible = true;
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  // Clear the subscription on destroy
  ngOnDestroy() {
    this.stop$.next();
  }
}
