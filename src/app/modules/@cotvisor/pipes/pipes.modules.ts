import { NgModule } from '@angular/core';
import { SafeHtmlPipe } from './safeHtml.pipe';
import { TruncatePipe } from './truncate.pipe';
import { UnescapeHtmlPipe } from './unescapeHtml.pipe';

@NgModule({
  imports: [],
  declarations: [TruncatePipe, UnescapeHtmlPipe, SafeHtmlPipe],
  exports: [TruncatePipe, UnescapeHtmlPipe, SafeHtmlPipe],
})
export class PipesModule { }
