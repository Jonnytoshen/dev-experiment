import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TableContentComponent } from './table-content.component';

const routes: Routes = [
  {
    path: '',
    component: TableContentComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TableContentRoutingModule { }
