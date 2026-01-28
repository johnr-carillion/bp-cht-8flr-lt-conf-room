import { Injectable, signal, OnDestroy, effect } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeService } from './theme.service';

declare var CrComLib: CrComLib;

export interface SourceEntry {
  id: number;
  name: string;
  type: string;
  group: string; // e.g. 'CONTROL_DESK', 'TABLE', 'RACK'
}

@Injectable({
  providedIn: 'root', // Makes the service available throughout the app
})
export class DataService implements OnDestroy {
  selectedSourceValue = signal<number>(0); // Track the currently selected source
  lastRoutingChild = signal<string>('videowall'); // Remember last child route, default to videowall
  isVideowallActive = signal<boolean>(false); // Track if videowall route is active
  isLowerGroundFloorActive = signal<boolean>(false); // Track if lower ground floor route is active
  isPinpadVisible = signal(false);

  videowallSourceValue = signal<number>(0);
  videowallSourceName = signal<string>('Blank');
  videowallSourceIcon = signal<string>('./assets/images/bp-plus-interface-bp-light-green-32.svg');
  sonyDisplaySourceValue = signal<number>(0);
  sonyDisplaySourceName = signal<string>('Blank');
  sonyDisplaySourceIcon = signal<string>('./assets/images/bp-plus-interface-bp-light-green-32.svg');

  lgfFeedSourceValue = signal<number>(0);

  lgfFeedSourceName = signal<string>('Blank');

  isIptvControlsActive = signal(false);

  // Initialize arrays with a fixed length so indices like 1..10 are defined
  sourceInUse = signal<boolean[]>(new Array(11).fill(false));
  sourceVideoSignal = signal<boolean[]>(new Array(11).fill(false));

  sources: SourceEntry[] = [
    { id: 0, name: 'Blank', type: 'blank', group: 'NONE' },
    { id: 1, name: 'IPTV', type: 'iptv', group: 'Rack' },
    { id: 2, name: 'Wireless AirMedia', type: 'computer-laptop', group: 'Credenza' },
    { id: 3, name: 'HDMI Input', type: 'computer-laptop', group: 'Credenza' },
    { id: 4, name: 'Teams (People)', type: 'office365_teams', group: 'Rack' },
    { id: 5, name: 'Teams (Content)', type: 'office365_teams', group: 'Rack' },
    { id: 6, name: 'LGF Feed 1', type: 'lgf-feed', group: 'LGF FEEDS' },
    { id: 7, name: 'LGF Feed 2', type: 'lgf-feed', group: 'LGF FEEDS' },
  ];

  // helper: get by id
  getSourceById(id: number): SourceEntry | undefined {
    return this.sources.find((s) => s.id === id);
  }

  // helper: get by group key
  getSourcesByGroup(group: string): SourceEntry[] {
    return this.sources.filter((s) => s.group === group);
  }

  clearVideoWalls() {
    CrComLib.setAnalog('11', 0); // Clear NVX in SIMPL
    CrComLib.setAnalog('12', 0); // Clear NVX in SIMPL
    CrComLib.setAnalog('20', 0); // Clear Teams Sharing in SIMPL
  }

  // Method to select a source
  source(sourceValue: number) {
    this.selectedSourceValue.set(sourceValue);
    console.log('selected source id', sourceValue, this.getSourceById(sourceValue));
  }

  // Subscriptions
  isFullscreenActiveSubscription!: string;
  sourceVideoSignalSubscription!: string;
  sourceInUseSubscription!: string;
  videoRoutingStatusSubscription!: string;

  constructor(
    private router: Router,
    private themeService: ThemeService,
  ) {
    // Track Angular router
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isVideowallActive.set(event.urlAfterRedirects.includes('videowall'));
        this.isLowerGroundFloorActive.set(event.urlAfterRedirects.includes('lower-ground-floor'));
      });

    // Update souce name
    effect(() => {
      const src1 = this.getSourceById(this.videowallSourceValue());
      const src2 = this.getSourceById(this.sonyDisplaySourceValue());
      const name1 = src1?.name ?? 'Add source';
      const name2 = src2?.name ?? 'Blank';
      this.videowallSourceName.set(name1 === 'Blank' ? 'Add source' : `${name1}`);
      this.videowallSourceIcon.set(
        name1 === 'Blank'
          ? './assets/images/bp-plus-interface-' +
              (this.themeService.isDarkMode()
                ? 'arri-bright-green-32.svg'
                : 'bp-light-green-32.svg')
          : './assets/images/bp-' +
              (src1?.type ??
                'plus-interface-' +
                  (this.themeService.isDarkMode()
                    ? 'arri-bright-green-32.svg'
                    : 'bp-light-green-32.svg')) +
              '-pictograms-' +
              (this.themeService.isDarkMode() ? 'light' : 'mid') +
              '-grey.svg',
      );
      this.sonyDisplaySourceName.set(name2 === 'Blank' ? 'Add source' : `${name2}`);
      this.sonyDisplaySourceIcon.set(
        name2 === 'Blank'
          ? './assets/images/bp-plus-interface-' +
              (this.themeService.isDarkMode()
                ? 'arri-bright-green-32.svg'
                : 'bp-light-green-32.svg')
          : './assets/images/bp-' +
              (src2?.type ??
                'plus-interface-' +
                  (this.themeService.isDarkMode()
                    ? 'arri-bright-green-32.svg'
                    : 'bp-light-green-32.svg')) +
              '-pictograms-' +
              (this.themeService.isDarkMode() ? 'light' : 'mid') +
              '-grey.svg',
      );
    });

    // Update LGF feed source names
    effect(() => {
      const src1 = this.getSourceById(this.lgfFeedSourceValue());
      const name1 = src1?.name ?? 'Blank';
      this.lgfFeedSourceName.set(
        name1 === 'Blank' ? 'Blank' : `${src1?.group ?? 'Blank'}: ${name1}`,
      );
    });

    // Subscribe to source video signal states
    this.sourceVideoSignalSubscription = CrComLib.subscribeState(
      'b',
      '101',
      (sourceVideoSignalValue: boolean) => {
        this.sourceVideoSignal.set(
          this.sourceVideoSignal().map((val, index) =>
            index === 1 ? sourceVideoSignalValue : val,
          ),
        );
        console.log('Source 1 video signal state updated to:', sourceVideoSignalValue);
      },
    );
    this.sourceVideoSignalSubscription = CrComLib.subscribeState(
      'b',
      '102',
      (sourceVideoSignalValue: boolean) => {
        this.sourceVideoSignal.set(
          this.sourceVideoSignal().map((val, index) =>
            index === 2 ? sourceVideoSignalValue : val,
          ),
        );
      },
    );
    this.sourceVideoSignalSubscription = CrComLib.subscribeState(
      'b',
      '103',
      (sourceVideoSignalValue: boolean) => {
        this.sourceVideoSignal.set(
          this.sourceVideoSignal().map((val, index) =>
            index === 3 ? sourceVideoSignalValue : val,
          ),
        );
      },
    );
    this.sourceVideoSignalSubscription = CrComLib.subscribeState(
      'b',
      '104',
      (sourceVideoSignalValue: boolean) => {
        this.sourceVideoSignal.set(
          this.sourceVideoSignal().map((val, index) =>
            index === 4 ? sourceVideoSignalValue : val,
          ),
        );
      },
    );

    // Subscribe to video routing statuses
    this.videoRoutingStatusSubscription = CrComLib.subscribeState(
      'n',
      '11',
      (currentSourceValue: number) => {
        this.videowallSourceValue.set(currentSourceValue);
      },
    );
    this.videoRoutingStatusSubscription = CrComLib.subscribeState(
      'n',
      '12',
      (currentSourceValue: number) => {
        this.sonyDisplaySourceValue.set(currentSourceValue);
      },
    );

    // Subscribe to source in use states
    this.sourceInUseSubscription = CrComLib.subscribeState(
      'b',
      '131',
      (sourceInUseValue: boolean) => {
        this.sourceInUse.set(
          this.sourceInUse().map((val, index) => (index === 1 ? sourceInUseValue : val)),
        );
      },
    );
    this.sourceInUseSubscription = CrComLib.subscribeState(
      'b',
      '132',
      (sourceInUseValue: boolean) => {
        this.sourceInUse.set(
          this.sourceInUse().map((val, index) => (index === 2 ? sourceInUseValue : val)),
        );
      },
    );
    this.sourceInUseSubscription = CrComLib.subscribeState(
      'b',
      '133',
      (sourceInUseValue: boolean) => {
        this.sourceInUse.set(
          this.sourceInUse().map((val, index) => (index === 3 ? sourceInUseValue : val)),
        );
      },
    );
    this.sourceInUseSubscription = CrComLib.subscribeState(
      'b',
      '134',
      (sourceInUseValue: boolean) => {
        this.sourceInUse.set(
          this.sourceInUse().map((val, index) => (index === 4 ? sourceInUseValue : val)),
        );
      },
    );
  }

  ngOnDestroy(): void {
    // Unsubscribe from all CrComLib subscriptions to prevent memory leaks
    CrComLib.unsubscribeState('b', '101', this.sourceVideoSignalSubscription);
    CrComLib.unsubscribeState('b', '102', this.sourceVideoSignalSubscription);
    CrComLib.unsubscribeState('b', '103', this.sourceVideoSignalSubscription);
    CrComLib.unsubscribeState('b', '104', this.sourceVideoSignalSubscription);
    CrComLib.unsubscribeState('n', '11', this.videoRoutingStatusSubscription);
    CrComLib.unsubscribeState('n', '12', this.videoRoutingStatusSubscription);
    CrComLib.unsubscribeState('b', '131', this.sourceInUseSubscription);
    CrComLib.unsubscribeState('b', '132', this.sourceInUseSubscription);
    CrComLib.unsubscribeState('b', '133', this.sourceInUseSubscription);
    CrComLib.unsubscribeState('b', '134', this.sourceInUseSubscription);
  }
}
