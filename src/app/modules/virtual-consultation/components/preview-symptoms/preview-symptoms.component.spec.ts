import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewSymptomsComponent } from './preview-symptoms.component';

describe('PreviewSymptomsComponent', () => {
  let component: PreviewSymptomsComponent;
  let fixture: ComponentFixture<PreviewSymptomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PreviewSymptomsComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviewSymptomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
