import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { LoggerModule } from 'ngx-logger';

import { ConfirmationService, DialogService, MessageService } from 'primeng/api';
import { CardModule } from 'primeng/card';
import { DynamicDialogModule } from 'primeng/components/dynamicdialog/dynamicdialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { FileUploadModule } from 'primeng/fileupload';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ListboxModule } from 'primeng/listbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenuModule } from 'primeng/menu';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { PaginatorModule } from 'primeng/paginator';

import {
    CalendarModule,
    ProgressSpinnerModule,
    SliderModule,
    TabMenuModule,
    TabViewModule,
    AutoCompleteModule,
    MultiSelectModule,
    MessagesModule,
    MessageModule,
    PanelModule,
    BlockUIModule,
    SelectButtonModule,
} from 'primeng/primeng';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { SidebarModule } from 'primeng/sidebar';
import { SplitButtonModule } from 'primeng/splitbutton';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
// Módulos de PrimeNg para construir nuestro tema
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { environment } from 'src/environments/environment';
import { ButtonSplitToolsComponent } from './components/button-split-tools/button-split-tools.component';
import { ButtonSplitComponent } from './components/button-split/button-split.component';
import { ButtonToggleComponent } from './components/button-toggle/button-toggle.component';
import { ButtonComponent } from './components/button/button.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CardComponent } from './components/card/card.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { FieldsetComponent } from './components/fieldset/fieldset.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FloatToolbarComponent } from './components/float-toolbar/float-toolbar.component';
import { FullPanelComponent } from './components/full-panel/full-panel.component';
import { HeaderComponent } from './components/header/header.component';
import { InputGroupComponent } from './components/input-group/input-group.component';
import { InputSwitchComponent } from './components/input-switch/input-switch.component';
import { InputTextComponent } from './components/input-text/input-text.component';
import { InputTextAreaComponent } from './components/input-text-area/input-text-area.component';
import { ListBoxComponent } from './components/list-box/list-box.component';
import { MenuComponent } from './components/menu/menu.component';
import { MultipanelComponent } from './components/multipanel/multipanel.component';
import { OverlayPanelComponent } from './components/overlay-panel/overlay-panel.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { DataViewModule } from 'primeng/dataview';
// Componentes de nuestro tema a exportar
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { SliderComponent } from './components/slider/slider.component';
import { TabMenuComponent } from './components/tab-menu/tab-menu.component';
import { VisorLayoutComponent } from './layouts/visor-layout/visor-layout.component';
import { ConfirmDialogService } from './services/confirm-dialog.service';
import { DataViewComponent } from './components/data-view/data-view.component';
import { WindowComponent } from './components/window/window.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AutoCompleteComponent } from './components/auto-complete/auto-complete.component';
import { DropdownComponent } from './components/dropdown/dropdown.component';
import { MultiSelectComponent } from './components/multi-select/multi-select.component';
import { DatatableComponent } from './components/datatable/datatable.component';
import { BoxPanelComponent } from './components/box-panel/box-panel.component';
import { OverviewBoxComponent } from './components/overview-box/overview-box.component';
import { OverviewUserBoxComponent } from './components/overview-user-box/overview-user-box.component';
import { ToolbarContainerComponent } from './components/toolbar-container/toolbar-container.component';
import { ItemComponent } from './components/item/item.component';
import { InputFileComponent } from './components/input-file/input-file.component';
import { TruncatePipe } from './pipes/truncate.pipe';
import { ChipComponent } from './components/chip/chip.component';
import { BlockLoadingComponent } from './components/block-loading/block-loading.component';
import { BoxContainerComponent } from './components/box-container/box-container.component';
import { PasswordModule } from 'primeng/password';
import { DataItemComponent } from './components/data-item/data-item.component';
import { BoxTitleComponent } from './components/box-title/box-title.component';
import { MessagesComponent } from './components/messages/messages.component';
// import { ReactiveFormsModule } from '@angular/forms';

/**
 *
 *
 * @export
 * @class ThemeModule
 */
@NgModule({
    declarations: [
        VisorLayoutComponent,
        ButtonComponent,
        ButtonToggleComponent,
        ButtonSplitComponent,
        SidePanelComponent,
        FullPanelComponent,
        MultipanelComponent,
        CardComponent,
        FieldsetComponent,
        FloatToolbarComponent,
        ProgressSpinnerComponent,
        OverlayPanelComponent,
        CalendarComponent,
        TabMenuComponent,
        InputGroupComponent,
        ButtonSplitToolsComponent,
        SliderComponent,
        HeaderComponent,
        FileUploadComponent,
        InputFileComponent,
        PaginatorComponent,
        ConfirmDialogComponent,
        InputSwitchComponent,
        InputTextComponent,
        InputTextAreaComponent,
        MenuComponent,
        DialogComponent,
        ListBoxComponent,
        DataViewComponent,
        WindowComponent,
        AutoCompleteComponent,
        DropdownComponent,
        MultiSelectComponent,
        DatatableComponent,
        BoxPanelComponent,
        BoxTitleComponent,
        OverviewBoxComponent,
        OverviewUserBoxComponent,
        ToolbarContainerComponent,
        ItemComponent,
        TruncatePipe,
        ChipComponent,
        BlockLoadingComponent,
        BoxContainerComponent,
        DataItemComponent,
        MessagesComponent,
    ],
    imports: [
        CommonModule,
        FormsModule,
        TooltipModule,
        InputSwitchModule,
        InputTextModule,
        InputTextareaModule,
        ListboxModule,
        MenuModule,
        SplitButtonModule,
        SidebarModule,
        OverlayPanelModule,
        SliderModule,
        CalendarModule,
        PaginatorModule,
        DropdownModule,
        ConfirmDialogModule,
        TableModule,
        DialogModule,
        CardModule,
        ToolbarModule,
        ScrollPanelModule,
        TranslateModule,
        ToggleButtonModule,
        ToastModule,
        ProgressSpinnerModule,
        DialogModule,
        DynamicDialogModule,
        TabMenuModule,
        FieldsetModule,
        FileUploadModule,
        TabViewModule,
        DataViewModule,
        AutoCompleteModule,
        MultiSelectModule,
        PanelModule,
        MessagesModule,
        MessageModule,
        BlockUIModule,
        RadioButtonModule,
        SelectButtonModule,
        DragDropModule,
        LoggerModule,
        TranslateModule,
        PasswordModule,
        // ReactiveFormsModule,
        LoggerModule.forRoot({
            serverLoggingUrl: environment.logging.serverLogUrl,
            level: environment.logging.consoleLogLevel,
            serverLogLevel: environment.logging.serverLogLevel,
        }),
    ],
    providers: [MessageService, ConfirmationService, ConfirmDialogService, DialogService],
    exports: [
        // Módulos de PrimeNG exportados para su uso directo
        FormsModule,
        TooltipModule,
        MessagesModule,
        MessageModule,
        // *********************
        DragDropModule,
        TranslateModule,
        LoggerModule,
        VisorLayoutComponent,
        ButtonComponent,
        ButtonToggleComponent,
        ButtonSplitComponent,
        SidePanelComponent,
        FullPanelComponent,
        MultipanelComponent,
        CardComponent,
        FieldsetComponent,
        FloatToolbarComponent,
        ProgressSpinnerComponent,
        OverlayPanelComponent,
        CalendarComponent,
        InputGroupComponent,
        ConfirmDialogComponent,
        TabMenuComponent,
        ButtonSplitToolsComponent,
        SliderComponent,
        FileUploadComponent,
        InputFileComponent,
        PaginatorComponent,
        InputSwitchComponent,
        InputTextComponent,
        InputTextAreaComponent,
        MenuComponent,
        DialogComponent,
        DataViewComponent,
        WindowComponent,
        AutoCompleteComponent,
        DropdownComponent,
        MultiSelectComponent,
        DatatableComponent,
        BoxPanelComponent,
        BoxTitleComponent,
        OverviewBoxComponent,
        OverviewUserBoxComponent,
        ToolbarContainerComponent,
        ItemComponent,
        ChipComponent,
        BlockLoadingComponent,
        BoxContainerComponent,
        // TODO crear componente del tema
        RadioButtonModule,
        SelectButtonModule,
        ToggleButtonModule,
        DataItemComponent,
        TruncatePipe,
        TableModule,
        ListBoxComponent,
        MessagesComponent
    ],
})
export class ThemeModule { }
