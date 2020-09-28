import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { EditableRow, Table } from 'primeng/table';
import { ToastService } from '@theme/services/toast.service';
import { LazyLoadEvent } from 'primeng/components/common/api';
import { environment } from 'src/environments/environment';
import { ErrorTheme } from '@theme/classes/error-theme.class';
import { FilterModes } from './filter.modes.enum';
import { DatatableColParams } from './datatable-col-params.interface';
import { DatatableDeleteEvent } from './datatable-delete-event.interface';

/**
 * Componente que muestra un array de elementos de forma tabulada con funciones de edición mediante dialogo interno o mediente eventos
 *
 * @export
 * @class DatatableComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.scss'],
  providers: [EditableRow, ToastService],
})
export class DatatableComponent implements OnInit {
  @Input() title: string;
  /**
   * Valores a mostrar en la tabla
   *
   * @type {any[]}
   * @memberOf DatatableComponent
   */
  @Input() values: any[];
  /**
   * Campo identificador único de los valores
   *
   * @type {string}
   * @memberOf DatatableComponent
   */
  @Input() dataKey: string;
  /**
   * Columnas que definen la tabla
   *
   * @type {{ field: string, header: string }[]}
   * @memberOf DatatableComponent
   */
  @Input() cols: DatatableColParams[];
  /**
   * La table es de solo lectura y no se puede editar ni añadir
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */
  @Input() readonly?: boolean = false;

  /**
   * Indica si se usa la edición en linea de la tabla
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */
  @Input() editInline?: boolean = true;
  /**
   * Indica si se usa un dialogo del componente para la edicion de filas
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */

  @Input() showFilters: boolean = true;

  /**
   * La tabla no muestra el icono de borrado de fila
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */
  @Input() allowDeleteOffline?: boolean = true;

  /**
   * La tabla no muestra el icono de borrado de fila
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */
  @Input() allowDetail?: boolean = true;

  /**
   * Mostrar el botón de añadir
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */
  @Input() allowAdd?: boolean = true;

  /**
   * Mustra el paginador
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */
  @Input() usePaginator?: boolean = true;

  /**
   *  Establece que la tabla carga datos en lazy por lo que se emitirán los eventos de paginación
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */
  @Input() lazy?: boolean = false;

  /**
   * Flag de carga de para la tabla, cuando es true, muestra en la tabla un spinner de carga
   *
   * @type {boolean}
   * @memberOf DatatableComponent
   */
  @Input() loading?: boolean = false;

  /**
   * Numero total de registros, obligatorio para la paginación en lazy load
   *
   * @type {number}
   * @memberOf DatatableComponent
   */
  @Input() totalRecords: number = null;

  @Input() styleClass: string;

  /**
   * Evento emitido al seleccionar una fila
   *
   * @type {EventEmitter<any>}
   * @memberOf DatatableComponent
   */
  @Output() rowSelectEvent: EventEmitter<any> = new EventEmitter();


  /**
   * Evento emitido al cambiar la selección
   *
   * @type {EventEmitter<any>}
   * @memberOf DatatableComponent
   */
  @Output() rowChangeEvent: EventEmitter<any> = new EventEmitter();

  /**
   * Evento emitido al guardar una fila
   *
   * @type {EventEmitter<any>}
   * @memberOf DatatableComponent
   */
  @Output() rowDetailEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Evento emitido al guardar un elemento editado
   *
   * @type {EventEmitter<any>}
   * @memberOf DatatableComponent
   */
  @Output() rowSaveEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Evento emitido al eliminar una fila
   *
   * @type {EventEmitter<any>}
   * @memberOf DatatableComponent
   */
  @Output() rowDeleteEvent: EventEmitter<DatatableDeleteEvent> = new EventEmitter();
  /**
   * Evento emitido para al pulsar el botón para un nuevo elemento
   *
   * @type {EventEmitter<any>}
   * @memberOf DatatableComponent
   */
  @Output() rowAddEvent: EventEmitter<any> = new EventEmitter();
  /**
   * Evento de paginación, en LAzyload se emite al pulsar el paginador
   *
   * @type {EventEmitter<LazyLoadEvent>}
   * @memberOf DatatableComponent
   */
  @Output() paginationEvent: EventEmitter<LazyLoadEvent> = new EventEmitter();

  @ViewChild('dataTable') dataTable: Table;
  displayDialog: boolean;
  newRow: any = {};
  selectedRow: any;
  inNewRow: boolean;
  editValues: any[];
  clonedValues: {
    [s: string]: any;
  } = {};
  rowsNumber: number;
  currentFilter: any;
  dateFormat = environment.date_format;

  constructor() {
    // Establece el numero de resultados por página en base a la variable de entorno
    this.rowsNumber = environment.results_per_page;
  }

  ngOnInit() {
    // Si la carga no es lazy, establecemos el numero total de registros
    if (!this.lazy && this.values) this.totalRecords = this.values.length;
    else if (this.lazy && this.totalRecords === null) {
      throw new ErrorTheme(
        'DatatableComponent',
        'Se ha establecido la tabla como lazy pero no se ha indicado el numero total de registros'
      );
    }
    this.cols.forEach((col) => {
      col.filterMode = col.filterMode ? col.filterMode : FilterModes.CONTAINS;
    });
  }

  /**
   * Muestra el cuadro de dialogo para añadir un nuevo registro
   *
   *
   * @memberOf DatatableComponent
   */
  showDialogToAdd() {
    if (this.editInline) {
      this.inNewRow = true;
      this.newRow = {};
      this.displayDialog = true;
    } else {
      this.rowAddEvent.emit();
    }
  }

  /**
   * Mátodo para guardar una nueva fila, emite el evento rowSaveEvent
   *
   *
   * @memberOf DatatableComponent
   */
  rowSave() {
    const tableValues = [...this.values];
    if (this.inNewRow) {
      tableValues.push(this.newRow);
    } else {
      tableValues[this.values.indexOf(this.selectedRow)] = this.newRow;
    }
    this.rowSaveEvent.emit(this.newRow);
    this.values = tableValues;
    this.newRow = null;
    this.displayDialog = false;
  }
  /**
   *  Emite el evento de fila seleccionada
   *
   * @param {any} event
   *
   * @memberOf DatatableComponent
   */
  rowSelect(event) {
    this.rowSelectEvent.emit(event.data);
  }

  changeSelect(event) {
    this.rowChangeEvent.emit(event.data);
  }
  /**
   *  inicia la edición de una fila
   *
   * @param {*} row
   *
   * @memberOf DatatableComponent
   */
  rowEditInit(row: any) {
    this.clonedValues[row[this.dataKey]] = { ...row };
  }
  /**
   * Guarda una fila tras la edición
   *
   * @param {*} row
   *
   * @memberOf DatatableComponent
   */
  rowEditSave(row: any) {
    delete this.clonedValues[row[this.dataKey]];
    this.rowSaveEvent.emit(row);
  }

  rowNewSave(row: any) {
    this.rowSaveEvent.emit(row);
  }
  /**
   * Cancela la edición de una fila
   *
   * @param {*} row
   * @param {number} index
   *
   * @memberOf DatatableComponent
   */
  rowEditCancel(row: any, index: number) {
    this.values[index] = this.clonedValues[row[this.dataKey]];
    delete this.clonedValues[row[this.dataKey]];
  }

  /**
   * Elimina una fila
   *
   * @param {*} row
   *
   * @memberOf DatatableComponent
   */
  rowEditDelete(row: any) {
    const deleteConfirm = () => {
      const rowIndex = this.values.indexOf(row);
      this.values = this.values.filter((val, i) => i !== rowIndex);
      this.dataTable.cancelRowEdit(row);
    };

    this.rowDeleteEvent.emit({ row, deleteConfirm });
  }

  /**
   * Emite evento para ir al detalle de una fila
   *
   * @param {*} row
   *
   * @memberOf DatatableComponent
   */
  gotoDetail(row: any) {
    this.rowDetailEvent.emit(row);
  }

  /**
   * Emite evento de paginación en el lazy load
   *
   * @param {LazyLoadEvent} event
   *
   * @memberOf DatatableComponent
   */
  loadDataLazy(event: LazyLoadEvent) {
    this.paginationEvent.emit(event);
  }

  // FIXME al resetear la tabla no se elmina el contenido de los inputs de los filtros
  resetTable() {
    this.dataTable.reset();
  }

  newCancel() {
    this.displayDialog = false;
  }
}
