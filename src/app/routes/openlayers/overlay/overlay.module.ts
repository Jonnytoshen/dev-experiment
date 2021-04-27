import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OverlayRoutingModule } from './overlay-routing.module';
import { OverlayComponent } from './overlay.component';
import { OverlayPortalModule } from './components/overlay-portal';


@NgModule({
  declarations: [
    OverlayComponent
  ],
  imports: [
    CommonModule,
    OverlayPortalModule,
    OverlayRoutingModule
  ]
})
export class OverlayModule { }
