import { inject, ElementRef, NgZone } from '@angular/core';

// Dirty Hack used to visualize the change detector
export function injectBlink() {
  const element = inject(ElementRef);
  const zone = inject(NgZone);

  return () => {
    element.nativeElement.firstChild.style.backgroundColor = 'crimson';

    zone.runOutsideAngular(() => {
      setTimeout(() => {
        element.nativeElement.firstChild.style.backgroundColor = 'white';
      }, 1000);
    });

    return null;
  };
}
