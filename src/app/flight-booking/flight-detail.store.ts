import {
  patchState,
  signalMethod,
  signalStore,
  withMethods,
  withProps,
  withState,
} from '@ngrx/signals';
import {
  withResource,
  withMutations,
  rxMutation,
  httpMutation,
  withDevtools,
  concatOp,
  mergeOp,
  switchOp,
  exhaustOp,
} from '@angular-architects/ngrx-toolkit';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FlightService } from './flight-search/flight.service';
import { Flight } from '../model/flight';

export const FlightDetailStore = signalStore(
  { providedIn: 'root' },
  
  withState({
    filter: {
      id: 0,
    },
  }),

  withProps(() => ({
    _flightService: inject(FlightService),
    _snackBar: inject(MatSnackBar),
  })),

  withResource((store) => ({
    flight: store._flightService.findResourceById(store.filter.id),
  })),

  withMutations((store) => ({
    saveFlight: httpMutation<Flight, Flight>({
      request: (flight: Flight) => ({
        url: 'https://demo.angulararchitects.io/api/flight/' + flight.id,
        method: 'PUT',
        body: flight,
      }),
      onSuccess(result, param) {
        console.log('result', result);
        store._snackBar.open('Successfully saved!', 'OK');
      },
      onError(error, param) {
        console.error('error', error);
        store._snackBar.open('Error saving flight!', 'OK');
      },
    })
  })),

  // TODO: Add Mutation

  withMethods((store) => ({
    updateFilter: signalMethod((id: number) => {
      if (id !== store.filter.id()) {
        patchState(store, {
          filter: {
            id,
          },
        });
      }
    }),
  }))
);
