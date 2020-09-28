import { Component } from '@angular/core';

/**
 * Componente que muestra las escenas seleccionadas mediante el fitro proporcionado por el selector de area y el filtro de escenas
 *
 * @export
 * @class ScenesPanelComponent
 */
@Component({
    selector: 'gss-scenes-panel',
    templateUrl: './scenes-panel.component.html',
    styleUrls: ['./scenes-panel.component.scss']
})
export class ScenesPanelComponent {
    public panelName = 'Escenas';

    constructor() {
    }



}
