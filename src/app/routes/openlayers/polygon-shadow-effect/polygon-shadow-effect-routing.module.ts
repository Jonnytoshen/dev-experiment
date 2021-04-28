import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PolygonShadowEffectComponent } from './polygon-shadow-effect.component';

const routes: Routes = [
  {
    path: '',
    component: PolygonShadowEffectComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PolygonShadowEffectRoutingModule { }
