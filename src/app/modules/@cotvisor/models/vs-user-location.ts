
/*
Ubicacion de usuario (marcadores)
*/
export class VsUserLocation {
    public id?: number;
    public name: string;
    public description: string;
    public wktPoint: string;
    public srs: string;
    public show: boolean;
    public zoom: number;

    constructor(name: string, description: string, wktPoint: string, srs: string, zoom: number, id?: number, show?: boolean) {
        this.name = name || '';
        this.description = description || '';
        this.wktPoint = wktPoint || '';
        this.srs = srs || '';
        this.zoom = zoom || 10;
        this.id = id || null;
        this.show = show || false;

    }


}
