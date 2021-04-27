import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPortalComponent } from './overlay-portal.component';



@NgModule({
  declarations: [OverlayPortalComponent],
  imports: [
    CommonModule
  ],
  exports: [OverlayPortalComponent]
})
export class OverlayPortalModule { }
