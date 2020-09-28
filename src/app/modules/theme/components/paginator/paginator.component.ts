import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


/**
 * Componente que permite mostrar contenido en un formato "paginado"
 *
 * @export
 * @class PaginatorComponent
 * @implements {OnInit}
 */
@Component({
  selector: 'the-paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {

  @Input() first: number;
  /**
   * Filas a mostrar por página
   * @type {number}
   * @memberOf PaginatorComponent
   */
  @Input() rows: number;
  /**
   * Número total de registros
   * @type {number}
   * @memberOf PaginatorComponent
   */
  @Input() totalRecords: number;
  /**
   * Arreglo de valores enteros para mostrar dentro de las filas por página desplegable.
   * @type {number[]}
   * @memberOf PaginatorComponent
   */
  @Input() rowsPerPageOptions: number[];
  /**
   * Mostrar paginación incluso si sólo hay una página
   * @type {boolean}
   * @memberOf PaginatorComponent
   */
  @Input() alwaysShow: boolean = true;
  /**
   * Evento que se emite al cambio de página.
   *  event.first: índice del primer registro.
   *  event.rows: Número de filas para mostrar en la nueva página.
   *  event.page: índice de la nueva página.
   *  event.pageCount: Número total de páginas.
   * @memberOf PaginatorComponent
   */
  @Output() changePage = new EventEmitter<{
    first: number
    rows: number
    page: number
    pageCount: number
  }>();
  constructor() { }

  ngOnInit() {
  }

  /**
   *
   *
   * @author Centro de Observación y Teledetección Espacial, S.L.U.
   * @param {*} event
   * @memberof PaginatorComponent
   */
  public handlePageChange(event) {
    this.changePage.emit(event);
  }

}
