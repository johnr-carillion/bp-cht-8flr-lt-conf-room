import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import './helpers/CrComLibHelpers';
import { WebXPanelService } from './services/WebXPanel';
import { CrestronRouterService } from './services/CrestronRouterService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('bp-cht-8flr-lt-conf-room');
  constructor(
    private webXPanelService: WebXPanelService,
    private crestronRouterService: CrestronRouterService,
  ) {
    document.addEventListener(
      'contextmenu',
      function (e) {
        e.preventDefault();
      },
      false,
    );
  }
}
