import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourceSelect } from './source-select';

describe('SourceSelect', () => {
  let component: SourceSelect;
  let fixture: ComponentFixture<SourceSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourceSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SourceSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
