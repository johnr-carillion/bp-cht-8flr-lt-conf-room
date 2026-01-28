import { Component, signal } from '@angular/core';
import { DataService } from '../../../services/data.service';
import { ThemeService } from '../../../services/theme.service';
import { DisplaysHeader } from '../displays-header/displays-header';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-videowall',
  imports: [DisplaysHeader],
  templateUrl: './videowall.html',
  styleUrl: './videowall.css',
})
export class Videowall {
  videowallSourceIsIptv = signal(false);
  sonyDisplaySourceIsIptv = signal(false);

  constructor(
    public dataService: DataService,
    public themeService: ThemeService,
  ) {}

  videowallPressed() {
    if (this.dataService.selectedSourceValue() !== 0)
      CrComLib.setAnalog('11', this.dataService.selectedSourceValue());
  }
  videowallClearPressed() {
    CrComLib.setAnalog('11', 0);
  }
  sonyDisplayPressed() {
    if (this.dataService.selectedSourceValue() !== 0)
      CrComLib.setAnalog('12', this.dataService.selectedSourceValue());
  }
  sonyDisplayClearPressed() {
    CrComLib.setAnalog('12', 0);
  }
}
