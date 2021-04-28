import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, ElementRef, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Map, View, Feature } from 'ol';
import { defaults } from 'ol/interaction';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, XYZ, TileWMS, Vector as VectorSource } from 'ol/source';
import { Coordinate, toStringHDMS } from 'ol/coordinate';
import { Style, Circle, Fill, Stroke } from 'ol/style';
import { Point } from 'ol/geom';
import { fromEvent } from 'rxjs';
import { filter, map, pluck, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'dev-dem-point-query',
  templateUrl: './dem-point-query.component.html',
  styleUrls: ['./dem-point-query.component.less'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemPointQueryComponent implements OnInit {

  instance!: Map;
  ghiSource!: TileWMS;
  coordinateSource!: VectorSource;
  coordinateDMS!: string;
  renderData!: any;
  isLoading: boolean = false;

  constructor(
    private elmentRef: ElementRef<HTMLDivElement>,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {
    this.elmentRef.nativeElement.classList.add('dev-dem-point-query');
  }

  ngOnInit(): void {
    this.ghiSource = new TileWMS({
      url: '/geoserver/wms',
      params: {'LAYERS': 'shanxi_project:GHI_year_3857_u16', 'TILED': true},
      serverType: 'geoserver',
      crossOrigin: 'anonymous',
    });
    this.coordinateSource = new VectorSource();
    this.instance = new Map({
      view: new View({
        center: fromLonLat([105, 36]),
        zoom: 4.5,
        maxZoom: 18
      }),
      controls: [],
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new TileLayer({
          source: new XYZ({
            url: '/geoserver/gwc/service/tms/1.0.0/shanxi_project%3AGHI_year_3857_u16@EPSG%3A900913@png/{z}/{x}/{-y}.png'
          }),
          extent: [8126322.8279, 2037548.5448000003, 15028131.2571, 7170156.294]
        }),
        new VectorLayer({
          source: this.coordinateSource,
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
      interactions: defaults().extend([]),
      target: this.elmentRef.nativeElement
    });
    fromEvent(this.instance as any, 'singleclick')
      .pipe(
        pluck<unknown, Coordinate>('coordinate'),
        tap((coordinate: Coordinate) => this.updateCoordinate(coordinate)),
        map((coordinate: Coordinate) => this.getFeatureInfoUrl(coordinate)!),
        tap(() => this.setLoading(true)),
        switchMap((url: string) => this.http.get(url)),
        tap(() => this.setLoading(false)),
        filter(res => res['features'][0]),
        map((res: any) => this.formatResponse(res)),
      )
      .subscribe(data => {
        this.renderData = data;
        this.cdr.markForCheck();
      });
  }

  private getFeatureInfoUrl(coordinate: Coordinate): string|undefined {
    const viewResolution = this.instance.getView().getResolution();
    return this.ghiSource.getFeatureInfoUrl(coordinate, viewResolution!, 'EPSG:3857', {'INFO_FORMAT': 'application/json'});
  }

  private updateCoordinate(coordinate: Coordinate): void {
    const feature: Feature = new Feature({
      geometry: new Point(coordinate)
    });
    this.coordinateSource.clear();
    this.coordinateSource.addFeature(feature);
    this.coordinateDMS = toStringHDMS(toLonLat(coordinate));
  }

  private formatResponse(data: any): object {
    const { timeStamp, features } = data;
    const { properties } = features[0];
    return { ...properties, timeStamp };
  }

  private setLoading(isLoading: boolean): void {
    this.isLoading = isLoading;
    this.cdr.markForCheck();
  }

}
