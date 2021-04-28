import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TableContentRoutingModule } from './table-content-routing.module';
import { TableContentComponent } from './table-content.component';


@NgModule({
  declarations: [
    TableContentComponent
  ],
  imports: [
    CommonModule,
    TableContentRoutingModule
  ]
})
export class TableContentModule { }
