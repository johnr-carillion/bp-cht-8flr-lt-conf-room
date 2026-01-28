import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Videowall } from './videowall';

describe('Videowall', () => {
  let component: Videowall;
  let fixture: ComponentFixture<Videowall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Videowall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Videowall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
