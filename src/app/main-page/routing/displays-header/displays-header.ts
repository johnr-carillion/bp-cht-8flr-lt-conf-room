import { Component, effect, computed, OnInit, OnDestroy, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-displays-header',
  imports: [CommonModule],
  templateUrl: './displays-header.html',
  styleUrl: './displays-header.css',
})
export class DisplaysHeader implements OnInit, OnDestroy {
  muteState = signal(false);
  volumeLevel = signal(0);

  gaugeHeight = computed(() => {
    const percentage = this.volumeLevel() / 655.35;
    return Math.round(percentage) + '%';
  });

  // 1. Data and State Properties
  items: string[] = ['Video Wall', 'LGF'];
  routeMap: { [key: string]: string } = {
    'Video Wall': 'videowall',
    LGF: 'lower-ground-floor',
  };
  reverseRouteMap: { [key: string]: number } = {
    videowall: 0,
    'lower-ground-floor': 1,
  };

  isOpen: boolean = false; // Controls the visibility of the list

  // Compute currentItem based on lastRoutingChild from DataService
  currentItem = computed(() => {
    const lastChild = this.dataService.lastRoutingChild();
    return this.reverseRouteMap[lastChild] ?? 0;
  });

  // Compute selectedItem based on current route
  selectedItem = computed(() => {
    const lastChild = this.dataService.lastRoutingChild();
    const index = this.reverseRouteMap[lastChild];
    const result = index !== undefined ? this.items[index] : 'Select Display Group';
    console.log(
      'selectedItem computed - lastChild:',
      lastChild,
      'index:',
      index,
      'result:',
      result,
    );
    return result;
  });

  // 2. Logic to Toggle the List
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    console.log(
      'Dropdown toggled - selectedItem:',
      this.selectedItem(),
      'lastRoutingChild:',
      this.dataService.lastRoutingChild(),
    );
  }

  // 3. Logic to Handle Item Selection
  selectItem(item: string): void {
    console.log('Current Item Index:', this.currentItem());
    console.log('Selected:', item);

    // If LGF is selected, show pinpad instead of navigating
    if (item === 'LGF') {
      this.isOpen = false; // Close the list
      this.dataService.isPinpadVisible.set(true);
      return;
    }

    this.isOpen = false; // Close the list after selection
    // Navigate to the selected routing child
    const route = this.routeMap[item];
    this.router.navigate(['/main-page/routing', route], {
      skipLocationChange: true,
    });
  }

  RampUp(state: boolean): void {
    CrComLib.setDigital('3', state);
  }
  RampDown(state: boolean): void {
    CrComLib.setDigital('4', state);
  }
  // Function to toggle mute
  MuteToggle(): void {
    CrComLib.pulseDigital('5');
  }

  constructor(
    public dataService: DataService,
    private router: Router,
  ) {}

  muteStateSubscription!: string;
  volumeLevelSubscription!: string;

  ngOnInit(): void {
    this.muteStateSubscription = CrComLib.subscribeState('b', '5', (state: boolean) => {
      this.muteState.set(state);
    });
    this.volumeLevelSubscription = CrComLib.subscribeState('n', '1', (level: number) => {
      this.volumeLevel.set(level);
    });
  }
  ngOnDestroy(): void {
    CrComLib.unsubscribeState('b', '5', this.muteStateSubscription);
    CrComLib.unsubscribeState('n', '1', this.volumeLevelSubscription);
  }
}
