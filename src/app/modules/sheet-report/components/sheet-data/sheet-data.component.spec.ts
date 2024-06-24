import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetDataComponent } from './sheet-data.component';

describe('SheetDataComponent', () => {
  let component: SheetDataComponent;
  let fixture: ComponentFixture<SheetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SheetDataComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
