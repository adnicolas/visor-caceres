import { Component, OnInit, Input } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'the-visor-layout',
  templateUrl: './visor-layout.component.html',
  styleUrls: ['./visor-layout.component.scss']
})
export class VisorLayoutComponent implements OnInit {

  toastPosition = environment.toast.position;
  @Input() contentStyleClass: string = '';

  constructor() {
  }

  ngOnInit() {
  }

}
