import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ApiResponse } from '../models/api-response';
import { Flight, FlightResponse } from '../models/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  dataBaseUrl = '../data/';
  constructor(private httpClient: HttpClient) {}

  getFlights() {
    return this.httpClient
      .get<ApiResponse<FlightResponse[]>>(`${this.dataBaseUrl}flights`)
      .pipe(
        map<ApiResponse<FlightResponse[]>, Flight[]>((flightsFromApi) =>
          flightsFromApi.response
            .filter((flightFromApi) => flightFromApi.status == 'en-route')
            .map<Flight>((flightFromApi) => ({
              latitude: flightFromApi.lat,
              longitude: flightFromApi.lng,
              direction: flightFromApi.dir,
            }))
        )
      );
  }
}
