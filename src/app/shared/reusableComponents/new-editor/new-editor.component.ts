import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ViewChild,
  OnDestroy
} from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-new-editor',
  templateUrl: './new-editor.component.html',
  styleUrls: ['./new-editor.component.css']
})
export class NewEditorComponent implements OnInit, OnDestroy {
  config: any;
  @Input() landingTemplateValue: string;
  @Output() getEditorValue = new EventEmitter<any>();
  @ViewChild('myEditor') myEditor: any;
  private debounceSubscription: Subscription;
  private editorValueSubject = new Subject<any>();
  editorValue$ = this.editorValueSubject.asObservable();
  constructor() {
    this.config = { uiColor: '#f2f2f2' };
  }

  ngOnInit(): void {
    this.config.allowedContent = true;
    this.config.extraPlugins = 'colorbutton , justify';
    this.config.colorButton_enableAutomatic = true;
    this.config.allowedContent = true;
    this.config.extraAllowedContent = 'span(*)';
    console.log(this.landingTemplateValue);
    this.debounceSubscription = this.editorValue$
      .pipe(debounceTime(1000))
      .subscribe((value) => {
        console.log('Emitted after debounce', value);
        this.getEditorValue.emit(value);
      });
  }

  onBlur(e: any) {
    console.log(
      '=======================================',
      e,
      this.landingTemplateValue
    );
    this.getEditorValue.emit({ editorVal: this.landingTemplateValue });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  save(event: any) {
    this.editorValueSubject.next({ editorVal: this.landingTemplateValue });
  }

  ngOnDestroy() {
    this.debounceSubscription.unsubscribe();
  }
}
