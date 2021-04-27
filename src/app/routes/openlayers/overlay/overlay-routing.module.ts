import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OverlayComponent } from './overlay.component';

const routes: Routes = [
  {
    path: '',
    component: OverlayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OverlayRoutingModule { }
