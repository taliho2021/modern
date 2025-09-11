import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable, Signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Flight, initFlight } from '../../model/flight';
import { ConfigService } from '../../shared/config.service';
import {
  concatOp,
  httpMutation,
  HttpMutationOptions,
} from '@angular-architects/ngrx-toolkit';
import { rxResource } from '@angular/core/rxjs-interop';

export type MutationSettings<Params, Result> = Omit<
  HttpMutationOptions<Params, Result>,
  'request'
>;

@Injectable({
  providedIn: 'root',
})
export class FlightService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  find(from: string, to: string): Observable<Flight[]> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { from, to };

    return this.http.get<Flight[]>(url, { headers, params });
  }

  findById(id: string): Observable<Flight> {
    const url = `${this.configService.config.baseUrl}/flight`;

    const headers = {
      Accept: 'application/json',
    };

    const params = { id };

    return this.http.get<Flight>(url, { headers, params });
  }

  findResource(from: Signal<string>, to: Signal<string>) {
    return httpResource<Flight[]>(
      () => ({
        url: 'https://demo.angulararchitects.io/api/flight',
        params: {
          from: from(),
          to: to(),
        },
      }),
      { defaultValue: [] }
    );
  }

  debug = true;

  findResourceById(id: Signal<number>) {

    if (this.debug) {
      return rxResource({
        params: () => ({
          id: id()
        }),
        stream: (p) => {
          const id = p.params.id;
          return of({
            id,
            from: 'here',
            to: 'there',
            date: new Date().toISOString(),
            delayed: true
          } as Flight);
        },
        defaultValue: initFlight,
      })
    }

    return httpResource<Flight>(
      () =>
        !id()
          ? undefined
          : {
              url: 'https://demo.angulararchitects.io/api/flight',
              params: {
                id: id(),
              },
            },
      {
        defaultValue: initFlight,
      }
    );
  }

  createSaveMutation(options: Partial<HttpMutationOptions<Flight, Flight>>) {
    return httpMutation({
      ...options,
      request: (flight) => ({
        url: 'https://demo.angulararchitects.io/api/flight',
        method: 'POST',
        body: flight,
      }),
      operator: concatOp
    });
  }
}
