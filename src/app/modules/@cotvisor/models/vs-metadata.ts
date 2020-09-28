/**
 * Definición de los metadatos de una capa
 * @type {String}
 */
export class VsMetadata {
    public url: string;
    public format: string;
    public type: string;
    public id?: number;
    constructor(url: string, format: string, type: string) {
        this.url = url || '';
        this.format = format || '';
        this.type = type || '';
    }

}
