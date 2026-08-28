import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchState } from './search-state';

describe('SearchState', () => {
  let component: SearchState;
  let fixture: ComponentFixture<SearchState>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchState],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchState);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
