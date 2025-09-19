import { JsonPipe } from '@angular/common';
import { Component, input } from '@angular/core';
import { Control, Field } from '@angular/forms/signals';
import { Aircraft } from 'src/app/model/aircraft';

@Component({
  selector: 'app-aircraft',
  imports: [Control, JsonPipe],
  templateUrl: './aircraft.component.html',
  styleUrl: './aircraft.component.css',
})
export class AircraftComponent {
  aircraft = input.required<Field<Aircraft>>();
}
