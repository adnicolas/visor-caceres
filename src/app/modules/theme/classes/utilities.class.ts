export class Utilities {

    /** 
     *  Descubre si los objetos son tradicionalmente iguales entre sí, 
     * como puede suponer que alguien más ya habría puesto esta función en vanilla JS.
     * Una cosa a tener en cuenta es que utiliza una comparación coercitiva (==) en las propiedades que 
     * tienen ambos objetos, no una comparación estricta (===).
     * Otra nota importante es que el método solo te dice si `compare` tiene
     * todos los parámetros iguales a ` base`, no al revés
     * 
     * @param base El objeto base con el que le gustaría comparar otro objeto
     * @param compare El objeto a comparar con la base.
     * @returns boolean que indica si los objetos tienen o no las mismas propiedades y esas propiedades son ==
     */
    public static isSameObject(base: any, compare: any): boolean {

        if (!base && !compare) return true;
        if (!base || !compare) return false;

        // loop through all properties in base object
        for (const baseProperty in base) {

            // determine if comparrison object has that property, if not: return false
            if (compare.hasOwnProperty(baseProperty)) {
                switch (typeof base[baseProperty]) {
                    // if one is object and other is not: return false
                    // if they are both objects, recursively call this comparison function
                    case 'object':
                        if (compare[baseProperty] === null && base[baseProperty]) {
                            return true;
                        }
                        // tslint:disable-next-line:max-line-length
                        if (typeof compare[baseProperty] !== 'object' || !this.isSameObject(base[baseProperty], compare[
                            baseProperty])) {
                            return false;
                        }
                        break;
                    // if one is function and other is not: return false
                    // if both are functions, compare function.toString() results
                    case 'function':
                        // tslint:disable-next-line:max-line-length
                        if (typeof compare[baseProperty] !== 'function' || base[baseProperty].toString() !== compare[baseProperty]
                            .toString()) {
                            return false;
                        }
                        break;
                    // otherwise, see if they are equal using coercive comparison
                    default:
                        if (base[baseProperty] !== compare[baseProperty]) { return false; }
                }
            } else {
                return false;
            }
        }

        // returns true only after false HAS NOT BEEN returned through all loops
        return true;
    }

}
