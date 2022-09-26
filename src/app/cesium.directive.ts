import { Directive, ElementRef, OnInit } from '@angular/core';
import { Cartesian3, Math, SceneMode, Viewer, CustomDataSource } from 'cesium';
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
      navigationHelpButton: false,
      sceneMode: SceneMode.SCENE2D,
      sceneModePicker: false,
      timeline: false,
    });

    const planesLayer = new CustomDataSource('planes');
    const airportsLayer = new CustomDataSource('airports');
    viewer.dataSources.add(planesLayer);
    viewer.dataSources.add(airportsLayer);

    timer(0, 10000)
      .pipe(switchMap(() => this.dataService.getFlights()))
      .subscribe((flights) => {
        planesLayer.entities.removeAll();
        flights.forEach((flight) => {
          planesLayer.entities.add({
            position: Cartesian3.fromDegrees(flight.lng, flight.lat),
            billboard: {
              image: '../assets/plane.svg',
              height: 20,
              width: 20,
              rotation: Math.toRadians(flight.dir),
            },
          });
        });
      });

    this.dataService.getAirports().subscribe((airports) => {
      airportsLayer.entities.removeAll();
      airports.response.forEach((airport) => {
        airportsLayer.entities.add({
          position: Cartesian3.fromDegrees(airport.lng, airport.lat),
          description: `${airport.name}, ${airport.country_code}`,
          billboard: {
            image: '../assets/airport.svg',
            height: 20,
            width: 20,
          },
        });
      });
    });
  }
}
