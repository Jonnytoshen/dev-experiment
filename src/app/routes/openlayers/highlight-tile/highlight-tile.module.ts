import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HighlightTileRoutingModule } from './highlight-tile-routing.module';
import { HighlightTileComponent } from './highlight-tile.component';


@NgModule({
  declarations: [
    HighlightTileComponent
  ],
  imports: [
    CommonModule,
    HighlightTileRoutingModule
  ]
})
export class HighlightTileModule { }
