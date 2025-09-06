import {
  Component,
  inject,
  input,
  linkedSignal,
  numberAttribute,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import { Control, form } from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceSignal } from '../../shared/debounce-signal';
import { Flight } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';

@Component({
  selector: 'app-flight-edit',
  imports: [
    Control,
    MatDatepickerModule,
    MatInputModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './flight-edit.component.html',
  styleUrls: ['./flight-edit.component.css'],
})
export class FlightEditComponent {
  private store = inject(FlightDetailStore);

  id = input.required({
    transform: numberAttribute,
  });

  // TODO: Get from store
  isPending = debounceSignal(this.store.saveFlightIsPending, 300);
  error = this.store.saveFlightError;

  flight = linkedSignal(() => normalize(this.store.flightValue()));
  flightForm = form(this.flight);

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    const current = this.flightForm().value();
    this.store.saveFlight(current);
  }
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date)
  }
}
