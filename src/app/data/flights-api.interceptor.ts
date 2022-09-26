import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { flightsApiKey } from './flights-api';

@Injectable()
export class FlightsApiInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const newRequest = request.clone({
      params: request.params.append('api_key', flightsApiKey),
    });
    return next.handle(newRequest);
  }
}
