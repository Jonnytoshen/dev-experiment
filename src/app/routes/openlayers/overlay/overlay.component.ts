import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ComponentFactoryResolver, Injector, ApplicationRef, ComponentRef } from '@angular/core';
import { ComponentPortal, DomPortalOutlet } from '@angular/cdk/portal';
import { Map, View, Overlay, Feature } from 'ol';
import { Tile, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { fromLonLat } from 'ol/proj';
import { defaults } from 'ol/interaction';
import { Coordinate, toStringHDMS } from 'ol/coordinate';
import { Point } from 'ol/geom';
import OverlayPositioning from 'ol/OverlayPositioning';
import { OverlayPortalComponent, OverlayPortalPlacement } from './components/overlay-portal';
import { Style, Stroke, Fill, Circle } from 'ol/style';

const PLACEMENTS: OverlayPortalPlacement[] = [
  OverlayPortalPlacement.BOTTOM,
  OverlayPortalPlacement.BOTTOM_LEFT,
  OverlayPortalPlacement.BOTTOM_RIGHT,
  OverlayPortalPlacement.LEFT,
  OverlayPortalPlacement.LEFT_BOTTOM,
  OverlayPortalPlacement.LEFT_TOP,
  OverlayPortalPlacement.RIGHT,
  OverlayPortalPlacement.RIGHT_BOTTOM,
  OverlayPortalPlacement.RIGHT_TOP,
  OverlayPortalPlacement.TOP,
  OverlayPortalPlacement.TOP_LEFT,
  OverlayPortalPlacement.TOP_RIGHT
];

@Component({
  selector: 'dev-overlay',
  templateUrl: './overlay.component.html',
  styleUrls: ['./overlay.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OverlayComponent implements OnInit {

  instance!: Map;

  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private appRef: ApplicationRef,
  ) {
    this.elementRef.nativeElement.classList.add('dev-overlay');
  }

  ngOnInit(): void {
    const positions: Coordinate[] = this.randomPositions();
    const features: Feature[] = positions.map(coordinates => new Feature({
      geometry: new Point(fromLonLat(coordinates))
    }));
    const overlays: Overlay[] = positions.map(position => this.overlayBuilder(position));

    this.instance = new Map({
      view: new View({
        center: fromLonLat([105, 35]),
        zoom: 5,
        maxZoom: 18
      }),
      layers: [
        new Tile({
          source: new OSM()
        }),
        new VectorLayer({
          source: new VectorSource({
            features
          }),
          style: [
            new Style({
              image: new Circle({
                fill: new Fill({
                  color: [63, 81, 181, 1]
                }),
                stroke: new Stroke({
                  color: [63, 81, 181, .45],
                  width: 8
                }),
                radius: 4
              })
            })
          ]
        })
      ],
      overlays,
      interactions: defaults().extend([]),
      target: this.elementRef.nativeElement
    });
  }

  private randomPositions(): Coordinate[] {
    return new Array(10)
      .fill(null)
      .map(() => [this.randomLongitude(), this.randomLatitude()]);
  }

  private randomLatitude(): number {
    return Math.round((Math.random() * (42 - 25 + 1) + 25) * 1000000) / 1000000;
  }

  private randomLongitude(): number {
    return Math.round((Math.random() * (120 - 80 + 1) + 80) * 1000000) / 1000000;
  }

  private randomPlacement(): OverlayPortalPlacement {
    const max: number = PLACEMENTS.length - 1;
    const min: number = 0;
    const index: number = Math.floor(Math.random() * (max - min + 1) + min);
    return PLACEMENTS[index];
  }

  private overlayBuilder(position: Coordinate): Overlay {
    const element: HTMLDivElement = document.createElement('div');
    const domPortalOutlet: DomPortalOutlet = new DomPortalOutlet(element, this.componentFactoryResolver, this.appRef, this.injector);
    const portal: ComponentPortal<OverlayPortalComponent> = new ComponentPortal(OverlayPortalComponent);
    const instance: Overlay = new Overlay({
      element,
      position: fromLonLat(position),
      positioning: OverlayPositioning.CENTER_CENTER,
      className: 'dev-overlay-container'
    });
    const componentRef: ComponentRef<OverlayPortalComponent> = domPortalOutlet.attachComponentPortal(portal);
    const placement: OverlayPortalPlacement = this.randomPlacement();
    componentRef.instance.innerContent = toStringHDMS(position);
    componentRef.instance.placement = placement;
    return instance;
  }

}
