import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Header } from './header/header';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-main-page',
  imports: [RouterOutlet, CommonModule, Header],
  templateUrl: './main-page.html',
  styleUrl: './main-page.css',
})
export class MainPage {
  constructor(public themeService: ThemeService) {}
}
