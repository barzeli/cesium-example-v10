import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ApiResponse, EntityName } from '../models/api-response';
import { Flight } from '../models/flight';
import { Airport } from '../models/airport';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  dataSourceBaseUrl = (entityName: EntityName) =>
    `./assets/data/${entityName}.json`;

  constructor(private httpClient: HttpClient) {}

  getFlights() {
    return this.httpClient
      .get<ApiResponse<Flight[]>>(this.dataSourceBaseUrl('flights'))
      .pipe(
        map((response) =>
          response.response.filter((flight) => flight.status == 'en-route')
        )
      );
  }

  getAirports() {
    return this.httpClient.get<ApiResponse<Airport[]>>(
      this.dataSourceBaseUrl('airports')
    );
  }
}
