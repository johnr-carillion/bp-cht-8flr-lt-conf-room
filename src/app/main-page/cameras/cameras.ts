import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { NgClass } from '@angular/common';

declare var CrComLib: CrComLib;

@Component({
  selector: 'app-cameras',
  imports: [NgClass],
  templateUrl: './cameras.html',
  styleUrl: './cameras.css',
})
export class Cameras implements OnInit, OnDestroy {
  scenario = signal(0);

  constructor(public themeService: ThemeService) {}

  scenarioPressed(scenario: number) {
    CrComLib.setAnalog('60', scenario);
  }

  scenarioSubscription!: string;

  ngOnInit() {
    this.scenarioSubscription = CrComLib.subscribeState('n', '60', (value: number) => {
      this.scenario.set(value);
    });
  }

  ngOnDestroy() {
    CrComLib.unsubscribeState('n', '60', this.scenarioSubscription);
  }
}
