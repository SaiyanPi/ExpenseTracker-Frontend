import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationState } from './pagination-state';

describe('PaginationState', () => {
  let component: PaginationState;
  let fixture: ComponentFixture<PaginationState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationState],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
