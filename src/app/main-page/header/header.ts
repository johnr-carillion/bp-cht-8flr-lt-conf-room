import { Component, computed, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { DataService } from '../../services/data.service';

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
    private dataService: DataService,
  ) {}

  navMenuFb = 0;

  teamsPressed() {
    CrComLib.pulseDigital('18504'); // Hide the UI Project and go back to Teams
  }
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
    CrComLib.setAnalog('11', 0); // Clear Videowall Source
    CrComLib.setAnalog('12', 0); // Clear Side Display Source
    CrComLib.setAnalog('13', 0); // Clear LGF Feed Source
    this.dataService.selectedSourceValue.set(0);
    this.roomOffPopUpVisible.set(false);
    this.router.navigate(['main-page/routing/videowall'], {
      skipLocationChange: true,
    });
    CrComLib.pulseDigital('18504'); // Hide the UI Project and go back to Teams
  }
}
