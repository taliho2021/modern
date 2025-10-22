import { signalStore, withState } from "@ngrx/signals";

export const BookingStore = signalStore(
    { providedIn: 'root' },
    withState({
        from: 'Graz',
        to: 'Hamburg',
        basket: {} as Record<number, boolean>,
        delayInMin: 0
    })
)