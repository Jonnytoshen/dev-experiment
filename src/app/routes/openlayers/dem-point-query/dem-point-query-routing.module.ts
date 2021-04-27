import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DemPointQueryComponent } from './dem-point-query.component';

const routes: Routes = [
  {
    path: '',
    component: DemPointQueryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DemPointQueryRoutingModule { }
