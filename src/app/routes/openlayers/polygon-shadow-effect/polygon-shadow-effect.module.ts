import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PolygonShadowEffectRoutingModule } from './polygon-shadow-effect-routing.module';
import { PolygonShadowEffectComponent } from './polygon-shadow-effect.component';


@NgModule({
  declarations: [
    PolygonShadowEffectComponent
  ],
  imports: [
    CommonModule,
    PolygonShadowEffectRoutingModule
  ]
})
export class PolygonShadowEffectModule { }
