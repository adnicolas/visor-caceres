
/**
 * Clase base para el lanzamiento de errores que se muestran por toast
 *
 * @export
 * @class ErrorBase
 * @extends {Error}
 */
export class ErrorBase extends Error {


    // TODO ver cómo mejorar esto con clase e instanceof https://stackoverflow.com/questions/43912118/inherit-from-error-breaks-instanceof-check-in-typescript
    name: string; // Indica el tipo de error para poder diferenciarlos pues throw error siempre emite el tipo Error
    title: string;
    message: string;
    stack?: string; // Stack del error
    [x: string]: any;
    callback?: () => void;

    constructor(title: string, message: string, name: string, stack?: string, callback?: () => void) {
        super();
        this.name = name;
        this.title = title;
        this.message = message;
        if (stack) this.stack = stack;
        if (callback) this.callback = callback;
    }

}
