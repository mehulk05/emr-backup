import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExcelColumnListComponent } from './excel-column-list.component';

describe('ExcelColumnListComponent', () => {
  let component: ExcelColumnListComponent;
  let fixture: ComponentFixture<ExcelColumnListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExcelColumnListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExcelColumnListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
