import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWayTextSubscriptionFormComponent } from './two-way-text-subscription-form.component';

describe('TwoWayTextSubscriptionFormComponent', () => {
  let component: TwoWayTextSubscriptionFormComponent;
  let fixture: ComponentFixture<TwoWayTextSubscriptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoWayTextSubscriptionFormComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoWayTextSubscriptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
