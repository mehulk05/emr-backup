import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWayTextPackageListComponent } from './two-way-text-package-list.component';

describe('TwoWayTextPackageListComponent', () => {
  let component: TwoWayTextPackageListComponent;
  let fixture: ComponentFixture<TwoWayTextPackageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoWayTextPackageListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoWayTextPackageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
