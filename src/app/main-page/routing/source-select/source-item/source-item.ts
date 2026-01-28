import {
  Component,
  Input,
  computed,
  signal,
  OnInit,
  Output,
  EventEmitter,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../../services/data.service';
import { ThemeService } from '../../../../services/theme.service';
import { timer, Subscription } from 'rxjs';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-source-item',
  imports: [CommonModule],
  templateUrl: './source-item.html',
  styleUrl: './source-item.css',
})
export class SourceItem implements OnInit {
  private timerSubscription: Subscription | undefined;

  @Input() sourceName: string = 'Default Source'; // e.g. 'Laptop 1', 'Teams (People)'
  @Input() sourceType: string = 'Default Type'; // e.g. 'computer-laptop', 'office365_teams', 'iptv'
  @Input() sourceValue: number = 0; // Value associated with this source item
  @Output() sourceSelected = new EventEmitter<number>(); // Emit sourceValue when selected

  sourceOnScreen = signal(false); // Source is currently on screen
  videoPreview = signal(false); // Preview source
  listen = signal(false); // Listen to source audio
  audioSource = signal(0); // Audio source name
  clearSource = signal(false);
  iconColour: string = '-white-100.png';
  maskEndPercent: string = '0%';

  isVideowallActive = computed(() => this.dataService.isVideowallActive());
  isSelected = computed(
    () => this.dataService.selectedSourceValue() === this.sourceValue && this.sourceValue !== 0,
  );

  // Computed signal for button background color
  buttonBackgroundColor = computed(() => {
    const hasSignal = this.dataService.sourceVideoSignal()[this.sourceValue];
    const onScreen = this.sourceOnScreen();

    if (onScreen && hasSignal) {
      return 'bg-bpLightGreen dark:bg-arriBrightGreen';
    } else if (!onScreen && hasSignal) {
      return 'bg-bpDarkGrey dark:bg-arriDarkGrey4';
    } else {
      return 'bg-stone-300 dark:bg-arriDarkGrey4';
    }
  });

  // Computed signal for text color
  textColor = computed(() => {
    const hasSignal = this.dataService.sourceVideoSignal()[this.sourceValue];
    const onScreen = this.sourceOnScreen();
    console.log('Text Color - onScreen:', onScreen, 'hasSignal:', hasSignal);
    if (onScreen && hasSignal) {
      return 'text-black dark:text-bpWhite';
    } else if (!onScreen && hasSignal) {
      return 'text-bpLightGrey';
    } else {
      return 'text-stone-300 dark:text-[#282828]';
    }
  });

  // Method to get indicator background color
  getIndicatorBackgroundColor(isSourceMatch: boolean): string {
    const hasSignal = this.dataService.sourceVideoSignal()[this.sourceValue];

    if (isSourceMatch && !hasSignal) {
      return 'bg-bpDeepOrange1 dark:bg-arriBrightOrange';
    } else if (isSourceMatch && hasSignal) {
      return 'bg-bpLightGreen dark:bg-arriBrightGreen';
    } else {
      return 'bg-arriLightGrey dark:bg-bpDarkGrey';
    }
  }

  constructor(
    public dataService: DataService,
    public themeService: ThemeService,
  ) {
    // Check if source is on any videowall and videowall route is active
    effect(() => {
      if (
        this.dataService.videowallSourceValue() === this.sourceValue ||
        this.dataService.sonyDisplaySourceValue() === this.sourceValue
      ) {
        this.sourceOnScreen.set(true);
      } else {
        this.sourceOnScreen.set(false);
      }
    });
  }

  // Computed signal for the source image path
  // This signal will automatically re-evaluate when sourceSelect() or sourceType changes
  sourceSelectImagePath = computed(() => {
    const base = `./assets/images/bp-${this.sourceType}-pictograms`;

    if (this.themeService.isDarkMode()) {
      if (this.dataService.sourceVideoSignal()[this.sourceValue] && !this.sourceOnScreen()) {
        this.iconColour = '-dark-grey.svg';
      } else if (this.sourceOnScreen()) {
        this.iconColour = '-white.svg';
      } else {
        this.iconColour = '-mid-grey.svg';
      }
    } else {
      if (this.sourceOnScreen()) {
        this.iconColour = '-white.svg';
      } else {
        this.iconColour = '-light-grey.svg';
      }
    }
    return `${base}${this.iconColour}`;
  });

  sourceSelectPressed(): void {
    if (this.dataService.sourceVideoSignal()[this.sourceValue]) {
      if (this.isSelected()) {
        // Already selected, toggle off
        this.dataService.selectedSourceValue.set(0);
      } else {
        // Not selected, toggle on
        this.dataService.selectedSourceValue.set(this.sourceValue);
        this.sourceSelected.emit(this.sourceValue);
      }
    }
  }

  listenPressed() {
    if (this.audioSource() !== this.sourceValue) {
      CrComLib.setAnalog('10', this.sourceValue);
    } else {
      CrComLib.setAnalog('10', 0);
    }
  }

  clearSourcePressed() {
    this.clearSource.set(true);
    this.timerSubscription = timer(2000).subscribe(() => {
      this.clearSource.set(false);
      if (this.dataService.videowallSourceValue() === this.sourceValue) {
        CrComLib.setAnalog('11', 0);
      }
      if (this.dataService.sonyDisplaySourceValue() === this.sourceValue) {
        CrComLib.setAnalog('12', 0);
      }
    });
  }
  clearSourceReleased() {
    this.clearSource.set(false);
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  audioSourceSubscription!: string;

  ngOnInit(): void {
    // Subscribe to audio source changes
    this.audioSourceSubscription = CrComLib.subscribeState(
      'n',
      '10',
      (audioSourceValue: number) => {
        this.audioSource.set(audioSourceValue);
      },
    );
  }

  ngOnDestroy() {
    // Clean up the timer subscription if it exists
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
    // Unsubscribe from Crestron state updates
    CrComLib.unsubscribeState('n', '10', this.audioSourceSubscription);
  }
}
