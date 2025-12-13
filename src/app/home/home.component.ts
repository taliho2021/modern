import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlightService } from '../flight-booking/flight-search/flight.service';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { mergeOp } from '@angular-architects/ngrx-toolkit';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    RouterLink,
    MatAutocompleteModule,
    MatOptionModule,
    MatInputModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  private flightService = inject(FlightService);

  private saveFlight = this.flightService.createSaveMutation({
    onSuccess: (result, params) => {
      console.log('Flight saved', { result, params });
    },
    onError: (error, params) => {
      console.error('Error saving flight', { error, params });
    },
    operator: mergeOp,
  });

  private saveFlightIsPending = this.saveFlight.isPending;
  private saveFlightError = this.saveFlight.error;
  private saveFlightValue = this.saveFlight.value;
  private saveFlightParams = this.saveFlight.isSuccess;

  consigneeOptions: Array<{ coName: string }> = [
    { coName: 'Option 1' },
    { coName: 'Option 2' },
    { coName: 'Option 3' },
  ];

  onConsigneeSelected(event: { option: { value: { coName: string } } }): void {
    console.log('Consignee selected:', event.option.value);
  }

  save(): void {
    this.saveFlight({
      id: 0,
      from: 'Graz',
      to: 'Hamburg',
      date: new Date().toISOString(),
      delayed: false,
    });
  }
}
