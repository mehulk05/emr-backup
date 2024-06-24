import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWayTextSubscriptionComponent } from './two-way-text-subscription.component';

describe('TwoWayTextSubscriptionComponent', () => {
  let component: TwoWayTextSubscriptionComponent;
  let fixture: ComponentFixture<TwoWayTextSubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoWayTextSubscriptionComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoWayTextSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
