import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Flight } from '../../model/flight';
import { FlightService } from './flight.service';
import { Price } from 'src/app/model/price';
import { initAircraft } from 'src/app/model/aircraft';

@Injectable()
export class DummyFlightService implements FlightService {
  find(from: string, to: string): Observable<Flight[]> {
    const date = new Date().toISOString();
    const prices: Price[] = [];
    const aircraft = initAircraft;

    return of([
      { id: 7, from: 'here', to: 'there', date, delayed: false, aircraft, prices },
      { id: 8, from: 'here', to: 'there', date, delayed: false, aircraft, prices },
      { id: 9, from: 'here', to: 'there', date, delayed: false, aircraft, prices },
    ]);
  }
}
