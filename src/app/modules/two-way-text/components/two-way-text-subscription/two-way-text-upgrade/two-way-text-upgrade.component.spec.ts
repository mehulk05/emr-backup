import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TwoWayTextUpgradeComponent } from './two-way-text-upgrade.component';

describe('TwoWayTextUpgradeComponent', () => {
  let component: TwoWayTextUpgradeComponent;
  let fixture: ComponentFixture<TwoWayTextUpgradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TwoWayTextUpgradeComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TwoWayTextUpgradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
