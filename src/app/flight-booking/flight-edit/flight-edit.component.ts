import {
  Component,
  inject,
  input,
  linkedSignal,
  numberAttribute,
  resource,
} from '@angular/core';

import { FlightDetailStore } from '../flight-detail.store';
import { Control, FieldPath, form, minLength, PathKind, required, submit, validate, ValidationError, ValidationSuccess, FieldValidator, validateAsync, validateTree, customError } from '@angular/forms/signals';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { debounceSignal } from '../../shared/debounce-signal';
import { Flight } from '../../model/flight';
import { toLocalDateTimeString } from '../../utils/date';
import { JsonPipe } from '@angular/common';
import { min } from 'rxjs';

function validateCity<T extends PathKind.Root>(path: FieldPath<string, T>, allowed: string[]) {
  return validate(path, ((ctx) => {
    const value = ctx.value();
    if (allowed.includes(value)) {
      return null as ValidationSuccess;
    }

    return customError({
      kind: 'city',
      value,
      allowed,
    }); 
  }) )
  // TODO: Remove this ^^^
}

@Component({
  selector: 'app-flight-edit',
  imports: [
    Control,
    JsonPipe,
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
  flightForm = form(this.flight, (schema) => { 
    required(schema.from);
    required(schema.to);
    required(schema.date);

    minLength(schema.from, 3);

    // validateCity(schema.from, ['Graz', 'Hamburg', 'Zürich']);

    validateRemoteCity(schema);

    // validateTree(schema, (ctx) => {
    //   ctx.field.from
    // })

    validate(schema, ((ctx) => {
      const from = ctx.field.from().value();
      const to = ctx.field.to().value();

      if (from === to) {
        return {
          kind: 'roundtrip',
          target: ctx.field.from,
          from,
          to
        }
      }
      return null;
    }) as FieldValidator<Flight, PathKind.Root>);

    validateTree(schema, ((ctx) => {
      const from = ctx.field.from().value();
      const to = ctx.field.to().value();

      if (from === to) {
        return {
          kind: 'roundtrip_tree',
          field: ctx.field.from,
          from,
          to
        }
      }
      return null;
    }) as FieldValidator<Flight, PathKind.Root>)


  });

  constructor() {
    this.store.updateFilter(this.id);
  }

  save(): void {
    submit(this.flightForm, async (form) => {
      const result = await this.store.saveFlight(form().value());

      if (result.status === 'error') {
        return {
          kind: 'processing_error',
            // ^^^ try to be more specfic
          error: result.error,
        }
      }
      return null;
    });
  }
}

function validateRemoteCity(schema: FieldPath<Flight, PathKind.Root>) {
  validateAsync(schema.from, {
    params: (ctx) => ({
      value: ctx.value()
    }),
    factory: (params) => {
      return resource({
        params,
        loader: (p) => {
          return Promise.resolve(0);
        },
      });
    },
    errors: (result, ctx) => {
      if (result === 0) {
        return {
          kind: 'async_demo'
        };
      }
      return null;
    }
  });
}

function normalize(flight: Flight): Flight {
  return {
    ...flight,
    date: toLocalDateTimeString(flight.date)
  }
}
