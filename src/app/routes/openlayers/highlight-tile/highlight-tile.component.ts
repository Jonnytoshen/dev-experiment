import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Map, View, Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Style, Stroke, Fill } from 'ol/style';
import { defaults } from 'ol/interaction';
import { GeoJSON } from 'ol/format';
import { getVectorContext } from 'ol/render';
import { Extent } from 'ol/extent';
import { fromEvent, Observable } from 'rxjs';
import { map, pluck, startWith } from 'rxjs/operators';
import * as Pbf from 'pbf';
import * as geobuf from 'geobuf';

@Component({
  selector: 'dev-highlight-tile',
  templateUrl: './highlight-tile.component.html',
  styleUrls: ['./highlight-tile.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HighlightTileComponent implements OnInit {

  private instance!: Map;
  private tileLayer!: TileLayer;
  private shadowEffectLayer!: VectorLayer;
  private highlightTileLayer!: TileLayer;
  private outlineLayer!: VectorLayer;

  constructor(
    private elementRef: ElementRef<HTMLDivElement>,
    private http: HttpClient
  ) {
    this.elementRef.nativeElement.classList.add('dev-highlight-tile');
  }

  ngOnInit(): void {
    this.createMapInstance();
    this.createTileLayer();
    this.createShadowEffectLayer();
    this.createHighlightTileLayer();
    this.cerateOutlineLayer();

    this.getGeoData()
      .subscribe((feature: Feature) => {
        this.shadowEffectLayer.getSource().addFeature(feature);
        this.outlineLayer.getSource().addFeature(feature);
      });
  }

  private createMapInstance(): void {
    this.instance = new Map({
      view: new View({
        center: fromLonLat([105, 36]),
        zoom: 4.2,
        maxZoom: 18
      }),
      controls: [],
      layers: [],
      interactions: defaults().extend([]),
      target: this.elementRef.nativeElement
    });
  }

  private createTileLayer(): void {
    this.tileLayer = new TileLayer({
      source: new OSM()
    });

    this.tileLayer.on('prerender', ({ context }) => {
      context.filter = 'grayscale(1)';
    });

    this.tileLayer.on('postrender', ({ context }) => {
      context.filter = 'grayscale(0)';
    });

    this.instance.addLayer(this.tileLayer);
  }

  private createShadowEffectLayer(): void {
    this.shadowEffectLayer = new VectorLayer({
      // A distinct className is required to use another canvas for the background
      className: 'dev-highlight-tile-outlie',
      source: new VectorSource(),
      style: new Style({
        fill: new Fill({
          // color: [63, 81, 181, 1]
          color: [255, 255, 255, 1]
        })
      })
    });

    this.shadowEffectLayer.on('prerender', event => {
      event.context.shadowBlur = 45;
      event.context.shadowColor = 'rgba(0, 0, 0, .45)';
    });

    this.shadowEffectLayer.on('postrender', event => {
      event.context.shadowBlur = 0;
      event.context.shadowColor = '#000000';
    });

    this.instance.addLayer(this.shadowEffectLayer);
  }

  private createHighlightTileLayer(): void {
    const style = new Style({
      fill: new Fill({
        color: 'black',
      }),
    });

    this.highlightTileLayer = new TileLayer({
      source: new OSM()
    });

    fromEvent(this.shadowEffectLayer.getSource() as any, 'addfeature')
      .pipe(
        pluck<unknown, VectorSource>('target'),
        startWith(this.shadowEffectLayer.getSource()),
        map((source: VectorSource) => source.getExtent())
      )
      .subscribe((extent: Extent) => {
        //Giving the clipped layer an extent is necessary to avoid rendering when the feature is outside the viewport
        this.highlightTileLayer.setExtent(extent);
      });

    this.highlightTileLayer.on('postrender', event => {
      const vectorContext = getVectorContext(event);
      event.context.globalCompositeOperation = 'destination-in';
      this.shadowEffectLayer.getSource().forEachFeature((feature: Feature) => {
        vectorContext.drawFeature(feature, style);
      });
      event.context.globalCompositeOperation = 'source-over';
    });

    this.instance.addLayer(this.highlightTileLayer);
  }

  private cerateOutlineLayer(): void {
    this.outlineLayer = new VectorLayer({
      source: new VectorSource(),
      style: new Style({
        stroke: new Stroke({
          // lineDash:[1, 2, 3, 4, 5, 6],
          // lineDashOffset: 5,
          color: [106, 116, 133, 1],
          width: 1
        })
      })
    });
    this.instance.addLayer(this.outlineLayer);
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
