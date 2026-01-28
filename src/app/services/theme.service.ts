// src/app/theme.service.ts
import { Injectable, signal, effect, OnDestroy } from '@angular/core';

declare var CrComLib: CrComLib;

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements OnDestroy {
  // Use a signal to track the dark mode state, initialized to false (light mode)
  isDarkMode = signal<boolean>(false);

  darkModeSubscription!: string;

  constructor() {
    // This effect will run whenever `isDarkMode` changes
    effect(() => {
      if (typeof document !== 'undefined') {
        // Toggle the 'dark' class on the HTML element based on the signal's value
        document.documentElement.classList.toggle('dark', this.isDarkMode());
      }
      // Update Crestron SIMPL program
      if (this.isDarkMode()) {
        CrComLib.setAnalog('5', 1)
      }
      else if (!this.isDarkMode()) {
        CrComLib.setAnalog('5', 0)
      }
    });

    this.darkModeSubscription = CrComLib.subscribeState(
      'n',
      '5',
      (darkModeValue: number) => {
        if (darkModeValue == 1) {
          this.isDarkMode.set(true)
        }
        else {
          this.isDarkMode.set(false)
        }
      }
    )
  }

  // Method to toggle the theme
  toggleTheme() {
    this.isDarkMode.update(current => !current);
    console.log(this.isDarkMode());
  }

  // Method to set the theme from the outside (e.g., from the Crestron system)
  setDarkMode(darkMode: boolean) {
    this.isDarkMode.set(darkMode);
  }

  ngOnDestroy(): void {
    CrComLib.unsubscribeState('n','5', this.darkModeSubscription);
  }
}