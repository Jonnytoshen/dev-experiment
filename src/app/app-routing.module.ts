import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'openlayers',
    children: [
      {
        path: 'overlay',
        loadChildren: () => import('./routes/openlayers/overlay/overlay.module').then(m => m.OverlayModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
