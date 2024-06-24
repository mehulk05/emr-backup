import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicTable1Component } from './dynamic-table1.component';

describe('DynamicTable1Component', () => {
  let component: DynamicTable1Component;
  let fixture: ComponentFixture<DynamicTable1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DynamicTable1Component]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DynamicTable1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
