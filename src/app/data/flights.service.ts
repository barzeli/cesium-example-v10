import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { ApiResponse, flightsApiBaseURL } from './flights-api';
import { Flight, FlightResponse, FlightResponseFields } from '../models/flight';

@Injectable({
  providedIn: 'root',
})
export class FlightsService {
  constructor(private httpClient: HttpClient) {}

  getFlights() {
    const responseFields: FlightResponseFields[] = [
      'lat',
      'lng',
      'alt',
      'dir',
      'status',
    ];

    return this.httpClient
      .get<ApiResponse<FlightResponse[]>>(
        `${flightsApiBaseURL}flights?_fields=${responseFields.join()}`
      )
      .pipe(
        map<ApiResponse<FlightResponse[]>, Flight[]>((flightsFromApi) =>
          flightsFromApi.response
            .filter((flightFromApi) => flightFromApi.status == 'en-route')
            .map<Flight>((flightFromApi) => ({
              latitude: flightFromApi.lat,
              longitude: flightFromApi.lng,
              altitude: flightFromApi.alt,
              direction: flightFromApi.dir,
            }))
        )
      );
  }
}
