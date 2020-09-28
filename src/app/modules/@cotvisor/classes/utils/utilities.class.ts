import * as FileSaver from 'file-saver';
import * as ol from 'openlayers';
import { environment } from 'src/environments/environment';
import { ErrorVisor } from '@cotvisor/classes/error-visor.class';
import { Observable } from 'rxjs/Observable';
// import * as MimeTypes from "mime-types";

export class Utilities {

  public static EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  public static proxyfyURL(url: string): string {
    if (environment.proxy_config.use_proxy) {
      return environment.proxy_config.proxy_address + (environment.proxy_config.use_encode_uri ? encodeURIComponent(url) : url);
    } else {
      return url;
    }
  }

  public static objectClone(obj: object): object {
    return Object.assign({}, obj);
  }

  /**
   * [imgToData description]
   * @param  {string}          url [description]
   * @return {Promise<object>}     [description]
   */
  // tslint:disable:only-arrow-functions
  public static imgToData(url: string): Promise<object> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // tslint:disable:space-before-function-paren
      xhr.onload = function () {
        const reader = new FileReader();
        reader.onloadend = function () {
          const image = new Image();
          image.src = reader.result as string;
          image.crossOrigin = 'Anonymous';
          image.onload = function () {
            resolve({ data: reader.result, imgHeight: image.height, imgWidth: image.width });
          };
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open('GET', url);
      xhr.responseType = 'blob';
      xhr.send();
    });
  }

  /**
   * [goFullScreen description]
   * @param  {any}    element [description]
   * @return {[type]}         [description]
   */
  public static goFullScreen(element: any) {

    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }

  }

  /**
   * [exitFullScreen description]
   * @param  {any}    element [description]
   * @return {[type]}         [description]
   */
  public static exitFullScreen(element: any) {

    const doc = document as any;
    if (doc.exitFullscreen) {
      doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen as any) {
      doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      doc.msExitFullscreen();
    }
  }

  public static isUrlValid(url: string) {
    const res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null) {
      return false;
    } else {
      return true;
    }
  }

  public static getLocation(href: string) {
    const l = document.createElement('a');
    l.href = href;
    return l;
  }

  public static getParameterByName(name, url) {
    if (!url) { url = window.location.href; }
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) { return null; }
    if (!results[2]) { return ''; }
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }

  public static removeAccents(s) {
    let r = s.toLowerCase();
    r = r.replace(new RegExp(/\s/g), '');
    r = r.replace(new RegExp(/[àáâãäå]/g), 'a');
    r = r.replace(new RegExp(/[èéêë]/g), 'e');
    r = r.replace(new RegExp(/[ìíîï]/g), 'i');
    r = r.replace(new RegExp(/[òóôõö]/g), 'o');
    r = r.replace(new RegExp(/[ùúûü]/g), 'u');

    r = r.replace(new RegExp(/[ÀÁÂÄ]/g), 'A');
    r = r.replace(new RegExp(/[ÈÉÊË]/g), 'E');
    r = r.replace(new RegExp(/[ÌÍÎÏ]/g), 'I');
    r = r.replace(new RegExp(/[ÓÒÓÔÖ]/g), 'O');
    r = r.replace(new RegExp(/[ÙÚÛÜ]/g), 'U');

    return r;
  }

  public static removeFromArray(e: any, array: any[]) {

    const index = array.indexOf(e);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  public static substractArrayAfromB(a: any[], b: any[], key: string) {

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < b.length; i++) {
      const element = b[i];
      Utilities.removeElementByKeyFromArray(a, key, element[key]);
    }
  }

  public static removeElementByKeyFromArray(array: any[], key: string, value: any) {
    const index = array.findIndex((obj) => obj[key] === value);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  // https://stackoverflow.com/questions/7313395/case-insensitive-replace-all
  public static removeSubstringRegardlessOfCase(str, strReplace, strWith) {
    const esc = strReplace.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const reg = new RegExp(esc, 'ig');
    return str.replace(reg, strWith);
  }

  /**
   * Guarda un blob en un archivo
   *
   * @static
   * @param {*} blob
   * @param {*} fileName
   * @memberof Utilities
   */
  public static saveBlobToFile(blob, fileName) {
    FileSaver.saveAs(blob, fileName);
  }

  /**
   * Obtiene la extensión de archivo a partir del mimetype
   *
   * @static
   * @param {string} mimeType
   * @returns {string}
   * @memberof Utilities
   */
  public static getMimeTypeExtension(mimeType: string): string {
    // return MimeTypes.extension(mimeType)
    return '';
  }

  /**
   * Obntiene el mimetype a partir de una extensión o nombre de archivo
   *
   * @static
   * @param {string} extension
   * @returns {string}
   * @memberof Utilities
   */
  public static getMimeType(extension: string): string {
    // return MimeTypes.lookup(extension)
    return '';
  }

  public static isOnlyNumbers(cad: string) {

    return (/^([0-9][0-9]+|[1-9])$/.test(cad));
  }

  /**
   * Calculates ideal resolution to use from the source in order to achieve
   * pixel mapping as close as possible to 1:1 during reprojection.
   * The resolution is calculated regardless of what resolutions
   * are actually available in the dataset (TileGrid, Image, ...).
   *
   * @param {ol.proj.Projection} sourceProj Source projection.
   * @param {ol.proj.Projection} targetProj Target projection.
   * @param {ol.Coordinate} targetCenter Target center.
   * @param {number} targetResolution Target resolution.
   * @return {number} The best resolution to use. Can be +-Infinity, NaN or 0.
   */
  public static calculateSourceResolution(sourceProj, targetProj, targetCenter, targetResolution) {
    // parseFloat(x.toFixed(number))
    const sourceCenter = ol.proj.transform(targetCenter, targetProj, sourceProj);

    // calculate the ideal resolution of the source data
    let sourceResolution =
      ol.proj.getPointResolution(targetProj, targetResolution, targetCenter);

    const targetMetersPerUnit = targetProj.getMetersPerUnit();
    if (targetMetersPerUnit !== undefined) {
      sourceResolution *= targetMetersPerUnit;
    }
    const sourceMetersPerUnit = sourceProj.getMetersPerUnit();
    if (sourceMetersPerUnit !== undefined) {
      sourceResolution /= sourceMetersPerUnit;
    }

    // Based on the projection properties, the point resolution at the specified
    // coordinates may be slightly different. We need to reverse-compensate this
    // in order to achieve optimal results.

    const sourceExtent = sourceProj.getExtent();
    if (!sourceExtent || ol.extent.containsCoordinate(sourceExtent, sourceCenter)) {
      const compensationFactor =
        ol.proj.getPointResolution(sourceProj, sourceResolution, sourceCenter) /
        sourceResolution;
      if (isFinite(compensationFactor) && compensationFactor > 0) {
        sourceResolution /= compensationFactor;
      }
    }
    return sourceResolution;
  }

  public static writeWKTFeatures(features: ol.Feature[]): string {

    const wktWriter = new ol.format.WKT();
    try {
      return wktWriter.writeFeatures(features);
    } catch (error) {
      throw new ErrorVisor('Utilities.writeWKTFeatures', 'Error al convertir a WKt', error.stack);
    }

  }

  public static readWKTFeatures(wktFeatures: string): ol.Feature[] {

    const wktReader = new ol.format.WKT();
    try {
      return wktReader.readFeatures(wktFeatures);
    } catch (error) {
      throw new ErrorVisor('Utilities.writeWKT', 'Error al convertir a WKT', error.stack);
    }

  }

  public static resizeBase64Image(imageBase64: string, width: number, height: number): Observable<string> {

    return new Observable(observer => {

      const myImage = new Image();
      myImage.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(myImage, 0, 0, width, height);
          const resizedBase64Img = canvas.toDataURL();
          observer.next(resizedBase64Img);
          observer.complete();
        } catch (error) {
          observer.error(error);
        }
      };
      myImage.src = imageBase64;

    });
  }

  public static isSQLDate(value): boolean {

    const sqlDateRegExp = /(?:199[0-9]|20[0-9][0-9])-(?:0[1-9]|1[0-2])-(?:[0-2][0-9]|3[0-1])/; // Valida formatos del tipo aaaa-mm-dd
    return sqlDateRegExp.test(value);
  }

}
