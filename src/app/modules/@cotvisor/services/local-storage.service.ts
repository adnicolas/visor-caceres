import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private _availableStorage: boolean = true;
  private _localStorage: any;

  constructor() {
    if (typeof (Storage) === 'undefined') {
      this._availableStorage = false;
      console.error('Error: El navegador no soporta el almacenamiento local');
    } else { this._localStorage = window.localStorage; }
  }

  public saveItem(uniqueId: string, item: object) {
    if (this._availableStorage) { this._localStorage.setItem(uniqueId, JSON.stringify(item)); }
  }

  public getItem(uniqueId: string): any {
    if (this._availableStorage) { return JSON.parse(this._localStorage.getItem(uniqueId)); }
  }

}
