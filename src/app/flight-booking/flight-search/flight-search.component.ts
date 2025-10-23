import { Component, computed, effect, inject, linkedSignal, Signal, signal, untracked } from '@angular/core';
import { rxResource, toObservable, toSignal } from '@angular/core/rxjs-interop';

import { CommonModule, JsonPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightService } from './flight.service';
import { Flight } from 'src/app/model/flight';
import { toFlightsWithDelays } from '../to-flights-with-delay';
import { debounceTime } from 'rxjs';
import { httpResource } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingStore } from '../booking.store';
import { customError, Field, FieldPath, form, minLength, required, validate } from '@angular/forms/signals';

function debounceSignal<T>(source: Signal<T>, msec: number): Signal<T> {
  return toSignal(toObservable(source).pipe(debounceTime(msec)), {
    initialValue: source(),
  });
}

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent, JsonPipe, Field],
})
export class FlightSearchComponent {

  store = inject(BookingStore);
  snackBar = inject(MatSnackBar);

  from = this.store.from;
  to = this.store.to;

  criteria = linkedSignal(() => ({
    from: this.from(),
    to: this.to(),
  }));

  searchForm = form(this.criteria, (path) => {
    required(path.from);
    minLength(path.from, 3);
    const allowed = ['Graz', 'Berlin', 'Bern'];
    validateCity(path.from, allowed);
  });

  debouncedCriteria = debounceSignal(this.criteria, 300);

  flights = this.store.flightsValue;
  error = this.store.flightsError;
  isLoading = this.store.flightsIsLoading;

  flightRoute = this.store.flightRoute;

  flightsWithDelay = this.store.flightsWithDelay;

  basket = this.store.basket;

  constructor() {

    this.store.updateFilter(this.debouncedCriteria);

    effect(() => {
      // auto-tracking
      this.logStuff();
    });

    effect(() => {
      this.snackBar.open(this.flights().length + ' flights loaded');
    });
  }

  private logStuff() {
    console.log('from', this.from());
    console.log('to', this.to());
  }

  search(): void {
    
  }

  delay(): void {
    this.store.delay();
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.store.updateBasket(flightId, selected);
  }
}

function validateCity(path: FieldPath<string>, allowed: string[]) {
  validate(path, (ctx) => {
    const value = ctx.value();
    if (allowed.includes(value)) {
      return null;
    }

    return customError({
      kind: 'not_supported_city',
      allowed,
      actual: value,
      tryAgain: 2037
    });

  });
}

