import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { LoadingOutline } from '@ant-design/icons-angular/icons';

import { DemPointQueryRoutingModule } from './dem-point-query-routing.module';
import { DemPointQueryComponent } from './dem-point-query.component';


@NgModule({
  declarations: [
    DemPointQueryComponent
  ],
  imports: [
    CommonModule,
    NzEmptyModule,
    NzIconModule.forChild([LoadingOutline]),
    NzSpinModule,
    NzDescriptionsModule,
    DemPointQueryRoutingModule
  ]
})
export class DemPointQueryModule { }
