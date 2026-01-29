import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { DisplaysHeader } from '../displays-header/displays-header';
import { ThemeService } from '../../../services/theme.service';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-lower-ground-floor',
  imports: [CommonModule, DisplaysHeader],
  templateUrl: './lower-ground-floor.html',
  styleUrl: './lower-ground-floor.css',
})
export class LowerGroundFloor {
  lgfFeedSnapshot = signal('');
  lgfFeed2Snapshot = signal('');
  lgfFeedSnapshotStarted = signal(false);
  lgfFeed2SnapshotStarted = signal(false);
  sendMicToLGF = signal(false);

  constructor(
    public dataService: DataService,
    public themeService: ThemeService,
  ) {}

  lgfFeedPressed() {
    CrComLib.setAnalog('13', this.dataService.selectedSourceValue());
  }
  lgfFeedClearPressed() {
    CrComLib.setAnalog('13', 0);
  }
}
