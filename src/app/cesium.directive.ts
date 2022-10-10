import { Directive, ElementRef, OnInit } from '@angular/core';
import {
  SceneMode,
  Viewer,
  CustomDataSource,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  VerticalOrigin,
  Math,
  Cartesian3,
  ArcType,
} from 'cesium';
import { timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { DataService } from './services/data.service';

@Directive({
  selector: '[appCesium]',
})
export class CesiumDirective implements OnInit {
  constructor(
    private elementRef: ElementRef,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    const viewer = new Viewer(this.elementRef.nativeElement, {
      animation: false,
      baseLayerPicker: false,
      fullscreenButton: false,
      geocoder: false,
      homeButton: false,
      infoBox: false,
      navigationHelpButton: false,
      sceneMode: SceneMode.SCENE2D,
      sceneModePicker: false,
      selectionIndicator: false,
      timeline: false,
    });

    const planesLayer = new CustomDataSource('planes');
    const airportsLayer = new CustomDataSource('airports');
    const pinpointLayer = new CustomDataSource('pinpoint');

    viewer.dataSources.add(planesLayer);
    viewer.dataSources.add(airportsLayer);
    viewer.dataSources.add(pinpointLayer);

    const screenSpaceEventHandler = new ScreenSpaceEventHandler(viewer.canvas);
    screenSpaceEventHandler.setInputAction(
      (event: ScreenSpaceEventHandler.PositionedEvent) => {
        const earthPosition = viewer.camera.pickEllipsoid(
          event.position,
          viewer.scene.globe.ellipsoid
        );

        const isMapPinpointed = !!pinpointLayer.entities.values.length;
        pinpointLayer.entities.removeAll();

        !viewer.selectedEntity &&
          !isMapPinpointed &&
          pinpointLayer.entities.add({
            position: earthPosition,
            billboard: {
              image: '../assets/icons/pin.svg',
              verticalOrigin: VerticalOrigin.BOTTOM,
            },
          });

        viewer.selectedEntity &&
          pinpointLayer.entities.add({
            position: viewer.selectedEntity.position,
            billboard: {
              image: '../assets/icons/selected.svg',
              height: 40,
              width: 40,
            },
          });
      },
      ScreenSpaceEventType.LEFT_CLICK
    );

    timer(0, 10000)
      .pipe(switchMap((index) => this.dataService.getFlights(index)))
      .subscribe((flights) => {
        planesLayer.entities.removeAll();
        flights.forEach((flight) => {
          planesLayer.entities.add({
            position: Cartesian3.fromDegrees(flight.lng, flight.lat),
            billboard: {
              image: '../assets/icons/plane.svg',
              height: 20,
              width: 20,
              rotation: Math.toRadians(flight.dir),
            },
          });

          this.dataService.getAirportsByFlight(flight).subscribe((airports) => {
            airports.depAirport &&
              airports.arrAirport &&
              planesLayer.entities.add({
                polyline: {
                  arcType: ArcType.GEODESIC,
                  positions: [
                    Cartesian3.fromDegrees(
                      airports?.depAirport.lng,
                      airports?.depAirport.lat
                    ),
                    Cartesian3.fromDegrees(flight.lng, flight.lat),
                    Cartesian3.fromDegrees(
                      airports?.arrAirport.lng,
                      airports?.arrAirport.lat
                    ),
                  ],
                },
              });
          });
        });
      });

    this.dataService.getAirports().subscribe((airports) => {
      airportsLayer.entities.removeAll();
      airports.forEach((airport) => {
        airportsLayer.entities.add({
          position: Cartesian3.fromDegrees(airport.lng, airport.lat),
          description: `${airport.name}, ${airport.country_code}`,
          billboard: {
            image: '../assets/icons/airport.svg',
            height: 20,
            width: 20,
          },
        });
      });
    });
  }
}
