import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Feature, Map, View } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { defaults } from 'ol/interaction';
import { fromLonLat } from 'ol/proj';
import { Style, Fill } from 'ol/style';
import { GeoJSON } from 'ol/format';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Pbf from 'pbf';
import * as geobuf from 'geobuf';

// https://www.programmersought.com/article/59244179117/

@Component({
  selector: 'dev-polygon-shadow-effect',
  templateUrl: './polygon-shadow-effect.component.html',
  styleUrls: ['./polygon-shadow-effect.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PolygonShadowEffectComponent implements OnInit {

  instance!: Map;
  shadowEffectLayer!: VectorLayer;

  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    private http: HttpClient
  ) {
    this.elementRef.nativeElement.classList.add('dev-polygon-shadow-effect');
  }

  ngOnInit(): void {
    this.instance = this.mapInstanceBuilder();
    this.shadowEffectLayer = this.shadowEffectLayerBuilder();


    this.getGeoData()
      .subscribe((feature: Feature) => {
        this.shadowEffectLayer.getSource().addFeature(feature);
      });
  }

  private mapInstanceBuilder(): Map {
    return new Map({
      view: new View({
        center: fromLonLat([105, 36]),
        zoom: 4.2,
        maxZoom: 18
      }),
      controls: [],
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      interactions: defaults().extend([]),
      target: this.elementRef.nativeElement
    });
  }

  private shadowEffectLayerBuilder(): VectorLayer {
    const shadowEffectLayer = new VectorLayer({
      source: new VectorSource(),
      visible: true,
      style: new Style({
        fill: new Fill({
          color: '#aaa'
        })
      })
    });

    shadowEffectLayer.on('prerender', event => {
      event.context.shadowBlur = 25;
      event.context.shadowColor = '#000000';
    });

    shadowEffectLayer.on('postrender', event => {
      event.context.shadowBlur = 0;
      event.context.shadowColor = '#000000';
    });

    this.instance.addLayer(shadowEffectLayer);
    return shadowEffectLayer;
  }

  private getGeoData(): Observable<Feature> {
    const format: GeoJSON = new GeoJSON({
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });

    return this.http.get('/assets/geo_china.txt', { responseType: 'arraybuffer' })
      .pipe(
        map(res => geobuf.decode(new Pbf(res))),
        map(geojson => format.readFeatures(geojson)),
        map(features => features[0])
      );
  }

}
