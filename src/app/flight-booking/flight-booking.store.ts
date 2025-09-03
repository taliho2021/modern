import {
  patchState,
  signalMethod,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import { inject } from '@angular/core';
import { FlightService } from './flight-search/flight.service';
import { withResource, withDevtools } from '@angular-architects/ngrx-toolkit';

export type FlightFilter = {
  from: string;
  to: string;
};

export const FlightBookingStore = signalStore(
  { providedIn: 'root' },
  withState({
    filter: {
      from: 'Graz',
      to: 'Hamburg',
    },
    basket: {} as Record<number, boolean>,
  }),
  withProps((store) => ({
    _flightService: inject(FlightService),
  })),
  withResource((store) => ({
    flights: store._flightService.findResource(
      store.filter.from,
      store.filter.to
    ),
  })),
  withMethods((store) => ({
    reload() {
      store._flightsReload();
    },
    updateFilter: signalMethod((filter: FlightFilter) => {
      const { from, to } = store.filter();
      if (filter.from !== from || filter.to !== to) {
        patchState(store, { filter });
      }
    }),
    updateBasket(id: number, selected: boolean) {
      patchState(store, (state) => ({
        basket: {
          ...state.basket,
          [id]: selected,
        },
      }));
    },
  })),
  withDevtools('flightBookingStore')
);
