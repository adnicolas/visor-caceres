import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CatalogComponent } from './catalog.component';
import { CatalogSearchComponent } from './catalog-search/catalog-search.component';
import { CatalogResultsComponent } from './catalog-results/catalog-results.component';
import { CatalogResultsItemComponent } from './catalog-results/catalog-results-item/catalog-results-item.component';
import { CatalogService } from './services/catalog.service';
import { ThemeModule } from '@theme/theme.module';
import { CatalogFilterService } from './services/catalog-filter.service';
import { CatalogPaginatorComponent } from './catalog-results/catalog-paginator/catalog-paginator.component';


@NgModule({
  declarations: [
    CatalogComponent,
    CatalogSearchComponent,
    CatalogResultsComponent,
    CatalogResultsItemComponent,
    CatalogPaginatorComponent,
  ],
  exports: [
    CatalogComponent
  ],
  providers: [
    CatalogService,
    CatalogFilterService
  ],
  imports: [
    CommonModule,
    ThemeModule
  ]
})
export class CatalogModule { }
