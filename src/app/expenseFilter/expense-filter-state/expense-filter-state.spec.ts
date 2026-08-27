import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFilterState } from './expense-filter-state';

describe('ExpenseFilterState', () => {
  let component: ExpenseFilterState;
  let fixture: ComponentFixture<ExpenseFilterState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseFilterState],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseFilterState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
