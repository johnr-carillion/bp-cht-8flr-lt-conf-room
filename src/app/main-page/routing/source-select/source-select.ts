import { Component, signal, OnInit, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from './../../../services/data.service';
import { ThemeService } from '../../../services/theme.service';
import { SourceItem } from './source-item/source-item';
import { SourceGroup } from './source-item/source-models';
import { timer, Subscription } from 'rxjs';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-source-select',
  imports: [CommonModule, SourceItem],
  templateUrl: './source-select.html',
  styleUrl: './source-select.css',
})
export class SourceSelect implements OnInit, OnDestroy {
  constructor(
    public dataService: DataService,
    public themeService: ThemeService,
  ) {}

  private timerSubscription: Subscription | undefined;

  clearAll = signal(false);

  iptvControls() {
    // Toggle IPTV Controls visibility
    this.dataService.isIptvControlsActive.set(!this.dataService.isIptvControlsActive());
  }

  clearAllPressed() {
    this.clearAll.set(true);
    this.timerSubscription = timer(2000).subscribe(() => {
      this.clearAll.set(false);

      CrComLib.setAnalog('10', 0); // Clear Audio Source
      CrComLib.setAnalog('11', 0); // Clear Videowall Source
      CrComLib.setAnalog('12', 0); // Clear Sony Display Source
    });
  }

  ngOnDestroy() {
    // Clean up the timer subscription if it exists
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }
  clearAllReleased() {
    this.clearAll.set(false);
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    const nameOrBlank = (id: number) => this.dataService.getSourceById(id)?.name ?? 'Blank';
    const sourceTypeOrBlank = (id: number) =>
      this.dataService.getSourceById(id)?.type ?? 'question-circle';
    const sourceValueOrBlank = (id: number) => this.dataService.getSourceById(id)?.id ?? 0;

    this.groups = [
      {
        name: 'CREDENZA:',
        items: [
          {
            sourceName: nameOrBlank(4),
            sourceType: sourceTypeOrBlank(4),
            sourceValue: sourceValueOrBlank(4),
          },
        ],
      },
      {
        name: 'RACK:',
        items: [
          {
            sourceName: nameOrBlank(1),
            sourceType: sourceTypeOrBlank(1),
            sourceValue: sourceValueOrBlank(1),
          },
          {
            sourceName: nameOrBlank(2),
            sourceType: sourceTypeOrBlank(2),
            sourceValue: sourceValueOrBlank(2),
          },
        ],
      },
      {
        name: 'LGF FEEDS:',
        items: [
          {
            sourceName: nameOrBlank(3),
            sourceType: sourceTypeOrBlank(3),
            sourceValue: sourceValueOrBlank(3),
          },
        ],
      },
    ];
  }
  // Data structure
  groups: SourceGroup[] = [];

  // Method to filter items based on active display
  getFilteredItems(items: any[]) {
    if (this.dataService.isLowerGroundFloorActive()) {
      return items.filter((item) => item.sourceValue !== 1 && item.sourceValue !== 3); // Exclude IPTV and LGF Feed for LGF
    }
    return items;
  }

  // Method to handle the selection
  handleSourceSelection(sourceValue: number): void {
    // Send the value to your data service
    this.dataService.source(sourceValue);
    console.log(`Source selected with value: ${sourceValue}`);
  }
}
