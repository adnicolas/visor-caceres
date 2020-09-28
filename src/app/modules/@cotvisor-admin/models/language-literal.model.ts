
import { ComponentModel } from './component.model';
import { LanguageModel } from './language.model';
/**
 * Modelo de literal de la aplicación
 * Contiene como atributos el idioma del literal y el componente al que pertenece
 *
 * @export
 * @class LanguageLiteralModel
 */
export class LanguageLiteralModel {
    public id: number;
    public language: LanguageModel;
    public component: ComponentModel;
    public key: string;
    public literalObject: string;

    constructor() {
        this.id = null;
        this.language = null;
        this.component = null;
        this.key = '';
        this.literalObject = '';
    }
}
