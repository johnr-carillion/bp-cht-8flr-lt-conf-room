import { Component, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { ThemeService } from '../../services/theme.service';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-pinpad',
  imports: [CommonModule],
  templateUrl: './pinpad.html',
  styleUrl: './pinpad.css',
})
export class Pinpad {
  pincode = signal('');
  pinCorrect = signal(false);
  pinIncorrect = signal(false);

  constructor(
    private dataService: DataService,
    public themeService: ThemeService,
    private router: Router,
  ) {
    // Watch for pinCorrect to become true
    effect(() => {
      if (this.pinCorrect()) {
        // Hide pinpad and navigate to lower-ground-floor
        this.dataService.isPinpadVisible.set(false);
        this.router.navigate(['/main-page/routing/lower-ground-floor'], {
          skipLocationChange: true,
        });
      }
    });
  }

  pinpadNumberPressed(number: number) {
    // Handle number press
    number = number + 60; // Map 0-9 to 60-69
    CrComLib.pulseDigital(number.toString());
  }

  pinpadClearPressed() {
    // Handle backspace press
    CrComLib.pulseDigital('71');
  }

  pinpadEnterPressed() {
    // Handle enter press
    CrComLib.pulseDigital('70');
  }

  clearPinpad() {
    this.dataService.isPinpadVisible.set(false);
  }

  pinCodeSubscription!: string;

  ngOnInit() {
    this.pinCodeSubscription = CrComLib.subscribeState('s', '3', (pinCode: string) => {
      this.pincode.set(pinCode);
    });
    this.pinCodeSubscription = CrComLib.subscribeState('b', '72', (isPinCorrect: boolean) => {
      this.pinCorrect.set(isPinCorrect);
    });
    this.pinCodeSubscription = CrComLib.subscribeState('b', '73', (isPinIncorrect: boolean) => {
      this.pinIncorrect.set(isPinIncorrect);
    });
  }
  ngOnDestroy() {
    CrComLib.unsubscribeState('s', '3', this.pinCodeSubscription);
    CrComLib.unsubscribeState('b', '72', this.pinCodeSubscription);
    CrComLib.unsubscribeState('b', '73', this.pinCodeSubscription);
  }
}
