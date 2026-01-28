import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ThemeService } from '../services/theme.service';

@Component({
  selector: 'app-start-page',
  imports: [RouterLink, CommonModule],
  templateUrl: './start-page.html',
  styleUrl: './start-page.css',
})
export class StartPage {
  constructor(public themeService: ThemeService) {}
}
