import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseFilter } from './expense-filter';

describe('ExpenseFilter', () => {
  let component: ExpenseFilter;
  let fixture: ComponentFixture<ExpenseFilter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExpenseFilter],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpenseFilter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
