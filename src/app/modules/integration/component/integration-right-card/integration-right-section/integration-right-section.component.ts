import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-integration-right-section',
  templateUrl: './integration-right-section.component.html',
  styleUrls: ['./integration-right-section.component.css']
})
export class IntegrationRightSectionComponent {
  @Input() integrationScript: any;
  @Input() integrationPreviewUrl: any;
  @Output() contentChange: EventEmitter<string> = new EventEmitter<string>();
  private contentSubject: Subject<string> = new Subject<string>();

  @Input() customCssForButton: string;

  constructor() {
    this.contentSubject.pipe(debounceTime(500)).subscribe((content) => {
      this.emitContent(content);
    });
  }

  onContentChange(content: string) {
    this.contentSubject.next(content);
  }

  emitContent(content: string) {
    this.contentChange.emit(content);
  }
}
