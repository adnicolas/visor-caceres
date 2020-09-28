import { NgModule } from '@angular/core';
import { DragScrollDirective } from './ngx-drag-scroll';

const DIRECTIVES = [DragScrollDirective];
@NgModule({
  declarations: [...DIRECTIVES],
  exports: [...DIRECTIVES],
})

export class DirectivesModule { }
