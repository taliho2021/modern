import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Control, Field } from '@angular/forms/signals';
import { Flight } from 'src/app/model/flight';
import { ValidationErrorsComponent } from 'src/app/shared/validation-errors/validation-errors.component';

@Component({
  selector: 'app-flight',
  imports: [Control, ValidationErrorsComponent],
  templateUrl: './flight.component.html',
  styleUrl: './flight.component.css'
})
export class FlightComponent {
  flight = input.required<Field<Flight>>();
}
