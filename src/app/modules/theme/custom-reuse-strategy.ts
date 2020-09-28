import { ActivatedRouteSnapshot, RouteReuseStrategy, DetachedRouteHandle } from '@angular/router';
import { Utilities } from './classes/utilities.class';
import { ComponentRef } from '@angular/core';


/* Interfaz para objeto que puede almacenar tanto:
 * Un ActivatedRouteSnapshot, que es útil para determinar si se debe o no adjuntar una ruta(vea this.shouldAttach)
 * Un DetachedRouteHandle, ofrecido por this.retrieve, en el caso de que desee adjuntar la ruta almacenada
 */

interface RouteStorageObject {
    snapshot: ActivatedRouteSnapshot;
    handle: DetachedRouteHandle;
}
/**
 * Implementa la estrategia de reutilizacion del router
 * Espera que en el router llegue en el objeto data, la propiedad  storeState a true para guardar el estado de una ruta,
 * si no se omite el guardado de esa ruta
 *
 * @export
 * @class CustomReuseStrategy
 * @implements {RouteReuseStrategy}
 */
export class CustomReuseStrategy implements RouteReuseStrategy {



    // tslint:disable:no-console

    /**
     * Objeto que almacenará RouteStorageObjects indexados por claves
     * Las claves serán todas una ruta (como en route.routeConfig.path)
     * Esto nos permite ver si tenemos una ruta almacenada para la ruta solicitada
     * @type {{ [key: string]: RouteStorageObject }}
     * @memberof CustomReuseStrategy
     */
    storedRoutes: { [key: string]: RouteStorageObject } = {};

    /** 
     * Determines if this route (and its subtree) should be detached to be reused later
     * Si la ruta se debe almacenar, creo que el booleano está indicando a un controlador si o no disparar this.store
     * cuando se llama aunque no importa particularmente, solo sé que esto determina si almacenamos o no la ruta.
     * verificamos route.routeConfig.path para ver si es una ruta que le gustaría almacenar
     * 
     * @param route This is, at least as I understand it, the route that the user is currently on, and we would like
     *  to know if we want to store it
     * @returns boolean indicating that we want to (true) or do not want to (false) store that route
     */
    shouldDetach(route: ActivatedRouteSnapshot): boolean {
        // para indicar si un estado del router se almacena para restaurar al volver, se debe
        // pasar la propiedad storeState en el objeto Data de la ruta
        return route.data.storeState;

    }

    /**
     * Construye un objeto de tipo `RouteStorageObject` para almacenar, 
     * y luego lo almacena para adjuntarlo posteriormente
     * 
     * @param route This is stored for later comparison to requested routes, see `this.shouldAttach`
     * @param handle Later to be retrieved by this.retrieve, and offered up to whatever controller is using this class
     */
    store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
        const storedRoute: RouteStorageObject = {
            snapshot: route,
            handle
        };


        // las rutas se almacenan por ruta 
        //    - la clave es el nombre de la ruta,
        //     - El identificador se almacena debajo de ella para que solo pueda
        // alguna vez tiene un objeto almacenado para una sola ruta
        const ruta = this.getResolvedUrl(route);
        this.storedRoutes[ruta] = storedRoute;
        // console.log(`Almacenada la ruta ${ruta} en el store`);
    }

    /**
     *
     * Determina si hay o no una ruta almacenada y, si la hay, si debería ser renderizada en lugar
     * de la ruta solicitada
     * @param route The route the user requested
     * @returns boolean indicating whether or not to render the stored route
     */
    shouldAttach(route: ActivatedRouteSnapshot): boolean {

        // si la ruta contiene el parametro de limpiar storage, se eliminan las rutas almacenadas
        if (route.data.clearStoreState) this.deactivateAllHandles();

        // Debería ser true si la ruta se ha almacenado previamente
        const ruta = this.getResolvedUrl(route);
        const canAttach: boolean = !!route.routeConfig && !!this.storedRoutes[ruta];

        // Esto decide si la ruta ya almacenada debe renderizarse en lugar de la ruta solicitada, y es el 
        // valor de retorno en este punto, ya sabemos que las rutas coinciden porque la clave de los resultados
        //  almacenados es route.routeConfig.path, si la ruta .params y route.queryParams también coinciden, 
        //  entonces debemos reutilizar el componente
        //
        if (canAttach) {

            const paramsMatch: boolean = Utilities.isSameObject(
                route.params, this.storedRoutes[ruta].snapshot.params
            );
            const queryParamsMatch: boolean = Utilities.isSameObject(
                route.queryParams, this.storedRoutes[ruta].snapshot.queryParams
            );

            // console.log(`La ruta destino y la almacenada en ${ruta} coinciden? : ` + paramsMatch && queryParamsMatch);
            return paramsMatch && queryParamsMatch;
        } else {
            // console.log(`No tenemos la ruta ${ruta} almacenada en el store `);
            return false;
        }
    }

    /** 
     * Encuentra la instancia almacenada localmente de la ruta solicitada, si existe, y la devuelve
     * @param route Nueva ruta que el usuario ha solicitado.
     * @returns DetachedRouteHandle objeto que puede ser usado para renderizar el componente.
     */
    retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {

        // devuelve nulo si la ruta no tiene un routerConfig O si no hay una ruta almacenada para ese routerConfig
        if (!route.routeConfig || !this.storedRoutes[this.getResolvedUrl(route)]) return null;
        /** returns handle when the route.routeConfig.path is already stored */
        const ruta = this.getResolvedUrl(route);
        return this.storedRoutes[ruta].handle;
    }

    /** 
     * Determina si la ruta actual debe reutilizarse o no.
     * 
     * @param future La ruta a la que va a ir el usuario, como lo activa el router
     * @param curr La ruta en la que está el usuario actualmente
     * @returns boolean básicamente indicando si el usuario tiene la intención de abandonar la ruta actual
     */
    shouldReuseRoute(curr: ActivatedRouteSnapshot, future: ActivatedRouteSnapshot): boolean {

        return future.routeConfig === curr.routeConfig;
    }

    private getResolvedUrl(route: ActivatedRouteSnapshot): string {
        return route.pathFromRoot
            .map(v => v.url.map(segment => segment.toString()).join('/'))
            .join('/');
    }


    /**
     * Desactiva los handles guardados de cada componente llamando al método destroy de cada uno
     * Esto evita que se quedan almacenados en memoria
     * 
     * @private
     * 
     * @memberOf CustomReuseStrategy
     */
    private deactivateAllHandles() {
        // tslint:disable-next-line forin
        for (const key in this.storedRoutes) {
            this.deactivateOutlet(this.storedRoutes[key].handle);
        }
        this.storedRoutes = {};
    }

    /**
     * Destruímos el componente con el método destroy
     * 
     * @private
     * @param {DetachedRouteHandle} handle 
     * 
     * @memberOf CustomReuseStrategy
     */
    private deactivateOutlet(handle: DetachedRouteHandle): void {
        // tslint:disable-next-line:no-string-literal
        const componentRef: ComponentRef<any> = handle['componentRef'];
        if (componentRef) componentRef.destroy();
    }


}
