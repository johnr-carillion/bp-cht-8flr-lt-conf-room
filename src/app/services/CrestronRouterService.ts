// This is a project specific service that subscribes to the MainPageVisibilityJoin and StartPageVisibilityJoin and manages the page routing.
// This would be replaced with your own service that manages the routing of your application in a more complex scenario.
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

// Declare the Crestron Communication Library
declare var CrComLib: CrComLib;

@Injectable({
  providedIn: 'root',
})
export class CrestronRouterService {
  constructor(
    private router: Router,
    private ngZone: NgZone,
  ) {
    // This ensures that a page will be displayed even if the control system is offline.
    // Navigate to the home page when the application starts.
    this.navigate('main-page/routing/videowall');
  }

  // The navigate function is used to navigate to a specific route.
  public navigate(path: string) {
    // Use the ngZone to run the navigation inside of the Angular zone.
    this.ngZone.run(() =>
      // Navigate to the route.
      this.router.navigate([path], { skipLocationChange: true }),
    );
  }
}
