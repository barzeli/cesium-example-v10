import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ApiResponse, EntityName } from '../models/api-response';
import { Flight } from '../models/flight';
import { Airport } from '../models/airport';
import { Math as CesiumMath } from 'cesium';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataSourceBaseUrl = (entityName: EntityName) =>
    `./assets/data/${entityName}.json`;

  constructor(private httpClient: HttpClient) {}

  getFlights(index: number) {
    return this.httpClient
      .get<ApiResponse<Flight[]>>(this.dataSourceBaseUrl('flights'))
      .pipe(
        map((response) =>
          response.response
            .filter((flight) => flight.status == 'en-route')
            .map((flight) => ({
              ...flight,
              lat:
                flight.lat +
                (index *
                  Math.sin(CesiumMath.toRadians(flight.dir + 90)) *
                  flight.speed) /
                  5000,
              lng:
                flight.lng +
                (index *
                  Math.cos(CesiumMath.toRadians(flight.dir + 90)) *
                  flight.speed) /
                  5000,
            }))
        )
      );
  }

  getAirports() {
    return this.httpClient.get<ApiResponse<Airport[]>>(
      this.dataSourceBaseUrl('airports')
    );
  }
}
