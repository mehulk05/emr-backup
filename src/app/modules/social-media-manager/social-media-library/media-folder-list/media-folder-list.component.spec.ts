import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaFolderListComponent } from './media-folder-list.component';

describe('MediaFolderListComponent', () => {
  let component: MediaFolderListComponent;
  let fixture: ComponentFixture<MediaFolderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MediaFolderListComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MediaFolderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
