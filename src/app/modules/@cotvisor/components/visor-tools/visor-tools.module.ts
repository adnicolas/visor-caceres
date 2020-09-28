import { NgModule } from '@angular/core';
import { ThemeModule } from '@theme/theme.module';
import { ToolMeasureComponent } from './tool-measure/tool-measure.component';
import { ToolZoomComponent } from './tool-zoom/tool-zoom.component';
import { CommonModule } from '@angular/common';
import { ToolHomeComponent } from './tool-home/tool-home.component';
import { ToolAreaSelectorComponent } from './tool-area-selector/tool-area-selector.component';
import { TranslateModule } from '@ngx-translate/core';
import { ToolNavigationHistoryComponent } from './tool-navigation-history/tool-navigation-history.component';
import { ToolWindowZoomComponent } from './tool-window-zoom/tool-window-zoom.component';
import { ToolGeographicInfoComponent } from './tool-geographic-info/tool-geographic-info.component';
import { IdentifyComponent } from './identify/identify.component';
import { PipesModule } from '@cotvisor/pipes/pipes.modules';
import { ToolUserLocationComponent } from './tool-user-location/tool-user-location.component';

/**
 * Módulo que exporta las funcionalidades que forman las herramientas del visor
 *
 * @export
 * @class CotVisorToolsModule
 */

@NgModule({
  imports: [CommonModule, ThemeModule, TranslateModule, PipesModule],
  declarations: [
    ToolZoomComponent,
    ToolHomeComponent,
    ToolMeasureComponent,
    ToolAreaSelectorComponent,
    ToolNavigationHistoryComponent,
    ToolWindowZoomComponent,
    ToolGeographicInfoComponent,
    ToolUserLocationComponent,
    IdentifyComponent,
  ],
  exports: [
    ToolZoomComponent,
    ToolHomeComponent,
    ToolMeasureComponent,
    ToolAreaSelectorComponent,
    ToolNavigationHistoryComponent,
    ToolWindowZoomComponent,
    ToolGeographicInfoComponent,
    ToolUserLocationComponent,
    IdentifyComponent
  ],
})

export class VisorToolsModule {
}
