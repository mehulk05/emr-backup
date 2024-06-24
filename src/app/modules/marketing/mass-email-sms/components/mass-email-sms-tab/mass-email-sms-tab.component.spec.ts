import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MassEmailSmsTabComponent } from './mass-email-sms-tab.component';

describe('MassEmailSmsTabComponent', () => {
  let component: MassEmailSmsTabComponent;
  let fixture: ComponentFixture<MassEmailSmsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MassEmailSmsTabComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MassEmailSmsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
