/**
 * Clase que almacena un panel de la aplicación gestionado desde el servicio de paneles
 *
 * @export
 * @class PanelItem
 */
export class PanelItem {
  name: string;
  visible: boolean;
  inlineStyle: object;
  styleClass: string;
  showCloseIcon: boolean = true;
  pageUrl: string; // Identifica en qué página se ha cargado
}
