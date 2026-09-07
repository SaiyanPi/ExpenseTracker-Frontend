import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSetting } from './account-setting';

describe('AccountSetting', () => {
  let component: AccountSetting;
  let fixture: ComponentFixture<AccountSetting>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccountSetting],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountSetting);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
