import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'table-content',
    pathMatch: 'full'
  },
  {
    path: 'table-content',
    loadChildren: () => import('./routes/table-content/table-content.module').then(m => m.TableContentModule)
  },
  {
    path: 'openlayers',
    children: [
      {
        path: 'overlay',
        loadChildren: () => import('./routes/openlayers/overlay/overlay.module').then(m => m.OverlayModule)
      },
      {
        path: 'dem-point-query',
        loadChildren: () => import('./routes/openlayers/dem-point-query/dem-point-query.module').then(m => m.DemPointQueryModule)
      },
      {
        path: 'polygon-shadow-effect',
        loadChildren: () => import('./routes/openlayers/polygon-shadow-effect/polygon-shadow-effect.module').then(m => m.PolygonShadowEffectModule)
      },
      {
        path: 'highlight-tile',
        loadChildren: () => import('./routes/openlayers/highlight-tile/highlight-tile.module').then(m => m.HighlightTileModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
