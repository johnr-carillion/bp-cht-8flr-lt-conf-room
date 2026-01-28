import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService } from '../../../services/data.service';
import { DisplaysHeader } from '../displays-header/displays-header';

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

  constructor(public dataService: DataService) {}

  lgfFeedPressed() {
    CrComLib.setAnalog('33', this.dataService.selectedSourceValue());
  }
  lgfFeedClearPressed() {
    CrComLib.setAnalog('33', 0);
  }
}
