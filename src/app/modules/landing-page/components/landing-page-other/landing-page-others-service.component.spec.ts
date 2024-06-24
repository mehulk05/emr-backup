import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingPageOthersServiceComponent } from './landing-page-others-service.component';

describe('LandingPageOthersServiceComponent', () => {
  let component: LandingPageOthersServiceComponent;
  let fixture: ComponentFixture<LandingPageOthersServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LandingPageOthersServiceComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LandingPageOthersServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
