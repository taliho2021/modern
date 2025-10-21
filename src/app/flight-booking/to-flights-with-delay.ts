import { addMinutes } from 'date-fns';
import { Flight } from '../model/flight';

export function toFlightsWithDelays(
  flights: Flight[],
  delay: number
): Flight[] {
  if (flights.length === 0) {
    return [];
  }

  const oldFlights = flights;
  const oldFlight = oldFlights[0];
  const oldDate = new Date(oldFlight.date);
  const newDate = addMinutes(oldDate, delay);

  const newFlight = { ...oldFlight, date: newDate.toISOString() };

  return [newFlight, ...flights.slice(1)];
}
