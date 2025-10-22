import { Component, computed, effect, inject, Signal, signal, untracked } from '@angular/core';
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
  imports: [CommonModule, FormsModule, FlightCardComponent, JsonPipe],
})
export class FlightSearchComponent {
  private flightService = inject(FlightService);

  snackBar = inject(MatSnackBar);

  from = signal('Paris');
  to = signal('London');

  debouncedCritiera = debounceSignal(
    computed(() => ({
      from: this.from(),
      to: this.to(),
    })),
    300
  );

  flightResource = this.flightService.findResource(this.debouncedCritiera)

  flights = this.flightResource.value;
  error = this.flightResource.error;
  isLoading = this.flightResource.isLoading;

  delayInMesc = signal(0);

  flightRoute = computed(() => this.from() + ' to ' + this.to());

  debouncedRoute = debounceSignal(this.flightRoute, 300);

  flightsWithDelay = computed(() =>
    toFlightsWithDelays(this.flights(), this.delayInMesc())
  );

  basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });

  constructor() {
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
    this.flightService.find(this.from(), this.to()).subscribe({
      next: (flights) => {
        this.flights.set(flights);
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
    });
  }

  delay(): void {
    this.delayInMesc.update((m) => m + 15);
  }

  updateBasket(flightId: number, selected: boolean): void {
    this.basket.update((basket) => ({
      ...basket,
      [flightId]: selected,
    }));
  }
}
