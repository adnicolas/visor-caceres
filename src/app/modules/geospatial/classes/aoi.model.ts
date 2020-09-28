export class AOIModel {

    id: number;
    areasWKT: string;
    name: string;
    timeStamp: Date;

    constructor() {
        this.id = null;
        this.areasWKT = null;
        this.name = null;
        this.timeStamp = new Date();
    }
}
