import { Routes } from '@angular/router';
import { StartPage } from './start-page/start-page';
import { MainPage } from './main-page/main-page';
import { Routing } from './main-page/routing/routing';
import { Videowall } from './main-page/routing/videowall/videowall';
import { LowerGroundFloor } from './main-page/routing/lower-ground-floor/lower-ground-floor';
import { Cameras } from './main-page/cameras/cameras';

export const routes: Routes = [
  { path: '', redirectTo: 'start-page', pathMatch: 'full' },
  { path: 'start-page', component: StartPage },
  {
    path: 'main-page',
    component: MainPage,
    children: [
      {
        path: 'routing',
        component: Routing,
        children: [
          { path: 'videowall', component: Videowall },
          { path: 'lower-ground-floor', component: LowerGroundFloor },
        ],
      },

      { path: 'cameras', component: Cameras },
    ],
  },
];
