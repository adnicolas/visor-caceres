import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'unescapeHtml',
})
export class UnescapeHtmlPipe implements PipeTransform {

  public transform(value: string, args: any[] = []) {

    value = decodeURI(value);

    while (value.indexOf('&amp;') > 0) {
      value = value.replace('&amp;', '&');
    }

    return value;
  }

}
