import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCategoryDialog } from './edit-category-dialog';

describe('EditCategoryDialog', () => {
  let component: EditCategoryDialog;
  let fixture: ComponentFixture<EditCategoryDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCategoryDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCategoryDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
