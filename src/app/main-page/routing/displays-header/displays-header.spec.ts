import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplaysHeader } from './displays-header';

describe('DisplaysHeader', () => {
  let component: DisplaysHeader;
  let fixture: ComponentFixture<DisplaysHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DisplaysHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DisplaysHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
