import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DateRangeState } from './date-range-state';

describe('DateRangeState', () => {
  let component: DateRangeState;
  let fixture: ComponentFixture<DateRangeState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DateRangeState],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangeState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
