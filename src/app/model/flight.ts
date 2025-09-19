import { Aircraft, initAircraft } from "./aircraft";

export interface Flight {
  id: number;
  from: string;
  to: string;
  date: string;
  delayed: boolean;
  aircraft: Aircraft;
}

export const initFlight: Flight = {
  id: 0,
  from: '',
  to: '',
  date: '',
  delayed: false,
  aircraft: initAircraft,
};
