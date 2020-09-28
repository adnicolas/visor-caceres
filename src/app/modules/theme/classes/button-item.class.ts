
/**
 * Clase que gestiona las propiedades de los botones dentro de un button-split-tools
 *
 * @export
 * @class ButtonItem
 */
export class ButtonItem {
    label?: string;
    icon?: string;
    // Permite pasar una función a ejecutar al clicar sobre el botón
    command?: (event?: any) => void;
    tooltip?: string;
    styleClass?: string;

    // Indica si el botón es de tipo toggle o de activación simple
    toggleButton?: boolean = false;

    // Indica si el botón será visible
    visible?: boolean = true;

    // Indica si el botón estará deshabilitado
    disabled?: boolean = false;

    constructor(options: {
        label?: string, icon?: string, command?: (event?: any) => void,
        tooltip?: string, styleClass?: string, toggleButton?: boolean,
        visible?: boolean, disabled?: boolean
    }) {
        this.label = options.label;
        this.icon = options.icon;
        this.command = options.command;
        this.tooltip = options.tooltip;
        this.styleClass = options.styleClass;
        this.toggleButton = options.toggleButton === undefined ? false : options.toggleButton;
        this.visible = options.visible === undefined ? true : options.visible;
        this.disabled = options.disabled === undefined ? false : options.disabled;
    }
}
