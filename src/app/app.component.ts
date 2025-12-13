import { Component, inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { FlightSearchComponent } from './flight-booking/flight-search/flight-search.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NextFlightsModule } from './next-flights/next-flights.module';
import { ConfigService } from './shared/config.service';
import { SidebarComponent } from './sidebar/sidebar.component';
import { filter } from 'rxjs/operators';

@Component({
  imports: [SidebarComponent, NavbarComponent, NextFlightsModule, RouterOutlet],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'Hello World!';

  configService = inject(ConfigService);
  router = inject(Router);
  renderer = inject(Renderer2);
  document = inject(DOCUMENT);
  currentTheme = 'light';

  constructor() {
    // TODO: In a later lab, we will assure that
    //  loading did happen _before_ we use the config!
    this.configService.loadConfig();

    // Set initial theme immediately
    setTimeout(() => {
      this.setThemeForRoute(this.router.url);
    }, 0);

    // Set theme based on route
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.setThemeForRoute(event.urlAfterRedirects);
      });
  }

  setTheme(theme: string) {
    this.currentTheme = theme;
    const htmlElement = this.document.documentElement;
    this.renderer.setAttribute(htmlElement, 'data-theme', theme);
  }

  setThemeForRoute(url: string) {
    if (url.includes('/home')) {
      this.setTheme('dark');
    } else if (url.includes('/about')) {
      this.setTheme('cupcake');
    } else if (url.includes('/flight-booking')) {
      this.setTheme('emerald');
    } else if (url.includes('/next-flights/checkin')) {
      this.setTheme('forest');
    } else if (url.includes('/next-flights')) {
      this.setTheme('luxury');
    } else if (url.includes('/not-found') || url === '**') {
      this.setTheme('halloween');
    } else {
      this.setTheme('light');
    }
  }
}
