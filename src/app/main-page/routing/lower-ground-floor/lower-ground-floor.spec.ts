import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LowerGroundFloor } from './lower-ground-floor';

describe('LowerGroundFloor', () => {
  let component: LowerGroundFloor;
  let fixture: ComponentFixture<LowerGroundFloor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LowerGroundFloor],
    }).compileComponents();

    fixture = TestBed.createComponent(LowerGroundFloor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
