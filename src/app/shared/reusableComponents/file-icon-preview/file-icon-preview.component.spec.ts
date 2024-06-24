import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileIconPreviewComponent } from './file-icon-preview.component';

describe('FileIconPreviewComponent', () => {
  let component: FileIconPreviewComponent;
  let fixture: ComponentFixture<FileIconPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileIconPreviewComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileIconPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
