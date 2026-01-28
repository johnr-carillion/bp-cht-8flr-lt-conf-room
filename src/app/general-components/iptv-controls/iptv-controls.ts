import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { ThemeService } from '../../services/theme.service';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-iptv-controls',
  standalone: true,
  imports: [],
  templateUrl: './iptv-controls.html',
  styleUrl: './iptv-controls.css',
})
export class IptvControls {
  constructor(
    public dataService: DataService,
    public themeService: ThemeService,
  ) {}

  closeIptvControls() {
    this.dataService.isIptvControlsActive.set(false);
  }

  tvPresetSelected(presetNumber: number) {
    // Send the selected preset number to the IPTV system via CrComLib
    presetNumber = presetNumber + 300; // Map 1-13 to 301-313 for IPTV Controls 1
    CrComLib.pulseDigital(presetNumber.toString());
  }
}
