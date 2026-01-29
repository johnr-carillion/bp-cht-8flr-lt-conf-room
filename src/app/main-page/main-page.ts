import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { Pinpad } from '../general-components/pinpad/pinpad';
import { DataService } from '../services/data.service';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, CommonModule, Header, Pinpad],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  constructor(
    public themeService: ThemeService,
    public dataService: DataService,
  ) {}
}
