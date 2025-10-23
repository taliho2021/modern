import { computed, inject } from '@angular/core';
import {
  patchState,
  signalMethod,
  signalStore,
  withComputed,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { FlightFilter } from './flight-filter';

import { withResource } from '@angular-architects/ngrx-toolkit';
import { FlightService } from './flight-search/flight.service';
import { toFlightsWithDelays } from './to-flights-with-delay';

// withResource

export const BookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    from: 'Graz',
    to: 'Hamburg',
    basket: {} as Record<number, boolean>,
    delayInMsec: 0,
  }),
  withComputed((store) => ({
    flightRoute: computed(() => store.from() + ' to ' + store.to()),
    criteria: computed(() => ({
      from: store.from(),
      to: store.to(),
    })),
  })),
  withProps((store) => ({
    _flightService: inject(FlightService),
  })),
  withResource((store) => ({
    flights: store._flightService.findResource(store.criteria),
  })),
  withComputed((store) => ({
    flightsWithDelay: computed(() =>
      toFlightsWithDelays(store.flightsValue(), store.delayInMsec())
    ),
  })),
  withMethods((store) => ({
    
    updateFilter: signalMethod((filter: FlightFilter) => {
      patchState(store, filter);
    }),

    updateBasket(flightId: number, selected: boolean) {
      patchState(store, (state) => ({
        basket: {
          ...state.basket,
          [flightId]: selected,
        },
      }));
    },

    delay() {
      patchState(store, (state) => ({
        delayInMsec: state.delayInMsec + 15,
      }));
    },
  }))
);
