import { ActivatedRouteSnapshot, DetachedRouteHandle } from '@angular/router';
/*
 Interfaz para objeto que puede almacenar tanto:
 Un ActivatedRouteSnapshot, que es útil para determinar si se debe o no adjuntar una ruta(vea this.shouldAttach)
 Un DetachedRouteHandle, ofrecido por this.retrieve, en el caso de que desee adjuntar la ruta almacenada
 
*/
export interface RouteStorageObject {
    snapshot: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle;
}
