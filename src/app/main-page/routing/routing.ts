import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { SourceSelect } from './source-select/source-select';
import { IptvControls } from '../../general-components/iptv-controls/iptv-controls';
import { DataService } from '../../services/data.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-routing',
  imports: [SourceSelect, IptvControls, CommonModule, FormsModule, RouterOutlet],
  templateUrl: './routing.html',
  styleUrl: './routing.css',
})
export class Routing {
  constructor(
    public dataService: DataService,
    private router: Router,
  ) {}
}
