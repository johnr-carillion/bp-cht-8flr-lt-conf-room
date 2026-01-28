import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IptvControls } from './iptv-controls';

describe('IptvControls', () => {
  let component: IptvControls;
  let fixture: ComponentFixture<IptvControls>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IptvControls],
    }).compileComponents();

    fixture = TestBed.createComponent(IptvControls);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
