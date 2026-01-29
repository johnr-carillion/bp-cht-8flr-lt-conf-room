import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Pinpad } from './pinpad';

describe('Pinpad', () => {
  let component: Pinpad;
  let fixture: ComponentFixture<Pinpad>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Pinpad],
    }).compileComponents();

    fixture = TestBed.createComponent(Pinpad);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
