import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinpadComponent } from './pinpad.component';

describe('PinpadComponent', () => {
  let component: PinpadComponent;
  let fixture: ComponentFixture<PinpadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PinpadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
