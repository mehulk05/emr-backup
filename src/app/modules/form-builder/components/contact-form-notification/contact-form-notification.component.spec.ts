import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactFormNotificationComponent } from './contact-form-notification.component';

describe('ContactFormNotificationComponent', () => {
  let component: ContactFormNotificationComponent;
  let fixture: ComponentFixture<ContactFormNotificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactFormNotificationComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactFormNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
