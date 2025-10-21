import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlightCardComponent } from '../flight-card/flight-card.component';
import { FlightService } from './flight.service';
import { Flight } from 'src/app/model/flight';
import { toFlightsWithDelays } from '../to-flights-with-delay';

@Component({
  selector: 'app-flight-search',
  standalone: true,
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css'],
  imports: [CommonModule, FormsModule, FlightCardComponent],
})
export class FlightSearchComponent {
  private flightService = inject(FlightService);

  from = 'Paris';
  to = 'London';
  flights: Array<Flight> = [];

  basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  search(): void {
    this.flightService.find(this.from, this.to).subscribe({
      next: (flights) => {
        this.flights = flights;
      },
      error: (errResp) => {
        console.error('Error loading flights', errResp);
      },
    });
  }

  delay(): void {
    this.flights = toFlightsWithDelays(this.flights, 15);
  }

}
