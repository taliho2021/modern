import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Flight } from '../model/flight';
import { initAircraft } from '../model/aircraft';
import { Price } from '../model/price';

@Injectable()
export class NextFlightsService {
  load(): Observable<Flight[]> {
    const date = new Date().toISOString();
    const aircraft = initAircraft;
    const prices: Price[] = [];
    
    return of([
      { id: 7, from: 'Paris', to: 'London', date, delayed: false, prices, aircraft },
      { id: 8, from: 'London', to: 'Paris', date, delayed: false, prices, aircraft },
      { id: 9, from: 'Paris', to: 'Berlin', date, delayed: false, prices, aircraft },
    ]);
  }
}
