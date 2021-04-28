import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HighlightTileComponent } from './highlight-tile.component';

const routes: Routes = [
  {
    path: '',
    component: HighlightTileComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HighlightTileRoutingModule { }
