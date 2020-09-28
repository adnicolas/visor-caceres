import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'gss-ejemplos-panel',
  templateUrl: './ejemplos-panel.component.html',
  styleUrls: ['./ejemplos-panel.component.scss']
})
export class EjemplosPanelComponent implements OnInit {

  panelName = 'Ejemplos';
  selectedCity: any = null;
  cities: any[];
  name: string;
  cars: { carID: string; brand: string; year: number; color: string; price: number; }[];
  carCols: { field: string; header: string; }[];

  constructor() {
    this.cities = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];

    this.cars = [
      { carID: 'a1653d4d', brand: 'VW', year: 1998, color: 'White', price: 10000 },
      { carID: 'ddeb9b10', brand: 'Mercedes', year: 1985, color: 'Green', price: 25000 },
      { carID: 'd8ebe413', brand: 'Jaguar', year: 1979, color: 'Silver', price: 30000 },
      { carID: 'aab227b7', brand: 'Audi', year: 1970, color: 'Black', price: 12000 },
      { carID: '631f7412', brand: 'Volvo', year: 1992, color: 'Red', price: 15500 },
      { carID: '7d2d22b0', brand: 'VW', year: 1993, color: 'Maroon', price: 40000 },
      { carID: '50e900ca', brand: 'Fiat', year: 1964, color: 'Blue', price: 25000 },
      { carID: '4bbcd603', brand: 'Renault', year: 1983, color: 'Maroon', price: 22000 },
      { carID: '70214c7e', brand: 'Renault', year: 1961, color: 'Black', price: 19000 },
      { carID: 'ec229a92', brand: 'Audi', year: 1984, color: 'Brown', price: 36000 },
      { carID: '1083ee40', brand: 'VW', year: 1984, color: 'Silver', price: 215000 },
      { carID: '6e0da3ab', brand: 'Volvo', year: 1987, color: 'Silver', price: 32000 },
      { carID: '5aee636b', brand: 'Jaguar', year: 1995, color: 'Maroon', price: 20000 },
      { carID: '7cc43997', brand: 'Jaguar', year: 1984, color: 'Orange', price: 14000 },
      { carID: '88ec9f66', brand: 'Honda', year: 1989, color: 'Maroon', price: 36000 },
      { carID: 'f5a4a5f5', brand: 'BMW', year: 1986, color: 'Blue', price: 28000 },
      { carID: '15b9a5c9', brand: 'Mercedes', year: 1986, color: 'Orange', price: 14000 },
      { carID: 'f7e18d01', brand: 'Mercedes', year: 1991, color: 'White', price: 25000 },
      { carID: 'cec593d7', brand: 'VW', year: 1992, color: 'Blue', price: 36000 },
      { carID: 'd5bac4f0', brand: 'Renault', year: 2001, color: 'Blue', price: 25000 },
      { carID: '56b527c8', brand: 'Jaguar', year: 1990, color: 'Yellow', price: 52000 },
      { carID: '1ac011ff', brand: 'Audi', year: 1966, color: 'Maroon', price: 45000 },
      { carID: 'fc074185', brand: 'BMW', year: 1962, color: 'Blue', price: 54000 },
      { carID: '606ba663', brand: 'Honda', year: 1982, color: 'Blue', price: 22000 },
      { carID: 'd05060b8', brand: 'Mercedes', year: 2003, color: 'Silver', price: 15000 },
      { carID: '46e4bbe8', brand: 'Mercedes', year: 1986, color: 'White', price: 18000 },
      { carID: 'c29da0d7', brand: 'BMW', year: 1983, color: 'Brown', price: 32000 },
      { carID: '24622f70', brand: 'VW', year: 1973, color: 'Maroon', price: 36000 },
      { carID: '7f573d2c', brand: 'Mercedes', year: 1991, color: 'Red', price: 21000 },
      { carID: 'b69e6f5c', brand: 'Jaguar', year: 1993, color: 'Yellow', price: 16000 },
      { carID: 'ead9bf1d', brand: 'Fiat', year: 1968, color: 'Maroon', price: 43000 },
      { carID: 'bc58113e', brand: 'Renault', year: 1981, color: 'Silver', price: 36000 },
      { carID: '2989d5b1', brand: 'Honda', year: 2006, color: 'Blue', price: 240000 },
      { carID: 'c243e3a0', brand: 'Fiat', year: 1990, color: 'Maroon', price: 15000 },
      { carID: 'e3d3ebf3', brand: 'Audi', year: 1996, color: 'White', price: 28000 },
      { carID: '45337e7a', brand: 'Mercedes', year: 1982, color: 'Blue', price: 14000 },
      { carID: '36e9cf7e', brand: 'Fiat', year: 2000, color: 'Orange', price: 26000 },
      { carID: '036bf135', brand: 'Mercedes', year: 1973, color: 'Black', price: 22000 },
      { carID: 'ad612e9f', brand: 'Mercedes', year: 1975, color: 'Red', price: 45000 },
      { carID: '97c6e1e9', brand: 'Volvo', year: 1967, color: 'Green', price: 42000 },
      { carID: 'ae962274', brand: 'Volvo', year: 1982, color: 'Red', price: 36000 },
      { carID: '81f8972a', brand: 'BMW', year: 2007, color: 'Black', price: 56000 },
      { carID: 'f8506743', brand: 'Audi', year: 1975, color: 'Blue', price: 42000 },
      { carID: '596859d1', brand: 'Fiat', year: 2002, color: 'Green', price: 48000 },
      { carID: 'd83c1d9a', brand: 'Volvo', year: 1972, color: 'Black', price: 29000 },
      { carID: '32f41550', brand: 'Mercedes', year: 1978, color: 'Brown', price: 17000 },
      { carID: 'c28cd2e4', brand: 'Volvo', year: 1982, color: 'Silver', price: 24000 },
      { carID: '80890dcc', brand: 'Audi', year: 1962, color: 'White', price: 36000 },
      { carID: '4bf1aeb5', brand: 'VW', year: 2000, color: 'Silver', price: 24000 },
      { carID: '45ca4786', brand: 'BMW', year: 1995, color: 'Maroon', price: 50000 }
    ];

    this.carCols = [
      { field: 'carID', header: 'ID' },
      { field: 'year', header: 'AÑO' },
      { field: 'brand', header: 'MARCA' },
      { field: 'color', header: 'COLOR' }
    ];

  }

  ngOnInit() {
  }

  logSave(row) {
    // tslint:disable-next-line:no-console
    console.log('Guardar:' + row);
  }
  logSelect(row) {
    // tslint:disable-next-line:no-console
    console.log('Seleccionado:' + row);
  }
  logDelete(row) {
    // tslint:disable-next-line:no-console
    console.log('Eliminar:' + row);
  }

  logDetail(row) {
    // tslint:disable-next-line:no-console
    console.log('Ir a detalle:' + row);
  }

  logAdd(row) {
    // tslint:disable-next-line:no-console
    console.log('ir a alta... ');
  }



}
