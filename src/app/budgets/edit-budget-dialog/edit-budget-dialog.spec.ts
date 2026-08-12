import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBudgetDialog } from './edit-budget-dialog';

describe('EditBudgetDialog', () => {
  let component: EditBudgetDialog;
  let fixture: ComponentFixture<EditBudgetDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditBudgetDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EditBudgetDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
