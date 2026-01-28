import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  roomOffPopUpVisible = signal(false);
  // Expose the signal from the service to the template
  isDarkMode = computed(() => this.themeService.isDarkMode());
  constructor(
    public themeService: ThemeService,
    private router: Router,
  ) {}

  navMenuFb = 0;

  routingPressed() {
    this.navMenuFb = 1;
    console.log(this.navMenuFb);
  }
  camerasPressed() {
    this.navMenuFb = 2;
    console.log(this.navMenuFb);
  }
  toggleRoomOffPopUp() {
    this.roomOffPopUpVisible.set(!this.roomOffPopUpVisible());
  }

  roomOffPressed() {
    CrComLib.setAnalog('10', 0); // Clear Audio Source
    CrComLib.setAnalog('21', 0); // Clear Videowall-1 Source
    CrComLib.setAnalog('22', 0); // Clear Videowall-2 Source
    this.roomOffPopUpVisible.set(false);
    this.router.navigate(['/start-page'], {
      skipLocationChange: true,
    });
  }
}
