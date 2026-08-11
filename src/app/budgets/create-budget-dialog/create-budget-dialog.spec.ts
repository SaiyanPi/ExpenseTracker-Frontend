import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateBudgetDialog } from './create-budget-dialog';

describe('CreateBudgetDialog', () => {
  let component: CreateBudgetDialog;
  let fixture: ComponentFixture<CreateBudgetDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateBudgetDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateBudgetDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
