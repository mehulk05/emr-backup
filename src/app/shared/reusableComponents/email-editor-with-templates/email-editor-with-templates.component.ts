/* eslint-disable @angular-eslint/use-lifecycle-interface */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
  ElementRef
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-email-editor-with-templates',
  templateUrl: './email-editor-with-templates.component.html',
  styleUrls: ['./email-editor-with-templates.component.css']
})
export class EmailEditorWithTemplatesComponent implements OnInit, OnChanges {
  @ViewChild('editorContainer') editorContainer!: ElementRef;
  @ViewChild('ckeditor', { static: false }) ckeditor: any;
  @Output() sendEmail: EventEmitter<any> = new EventEmitter();
  @Input() emailTemplates: any[] = [];
  @Input() email: any = '';
  @Input() isOptOutEnabled: boolean = false;
  config: any = {
    allowedContent: true,
    width: '100%',
    height: 385,
    uiColor: '#d8e2f6',
    toolbarGroups: [
      { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
      { name: 'forms' },
      { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
      {
        name: 'paragraph',
        groups: ['list', 'indent', 'blocks', 'align', 'bidi']
      },
      { name: 'links' },
      { name: 'styles' },
      { name: 'colors' },
      { name: 'tools' },
      { name: 'others' }
    ],

    // The default plugins included in the basic setup define some toolbar buttons that
    // are not needed in a basic editor. These are removed here.
    removeButtons: 'Cut,Copy,Paste,Undo,Redo,Anchor,Subscript,Superscript',

    // Dialog windows are also simplified.
    removeDialogTabs: 'link:advanced',

    // Finally, configure editor placeholder text.
    editorplaceholder: 'Type something here...'
  };
  simpleEmailForm: FormGroup;
  showTemplatesModal: boolean = false;
  showAiModal = false;
  totalCharacterLength = 8000;
  category =
    'Generate the better content while keeping the variable names , programming syntax';

  constructor(public formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.simpleEmailForm = this.formBuilder.group({
      toNumber: [this.email, []],
      subject: ['', [Validators.required]],
      body: ['', [Validators.required]]
    });
  }
  ngOnChanges(): void {
    if (this.simpleEmailForm) {
      this.simpleEmailForm.patchValue({
        toNumber: this.email,
        subject: '',
        body: ''
      });
    }
  }

  editorReady() {
    if ((window as any).CKEDITOR) {
      (window as any).CKEDITOR.dtd.button.a = 1;
    }
  }

  get f() {
    return this.simpleEmailForm.controls;
  }

  sendSimpleEmail() {
    if (this.simpleEmailForm.valid) {
      this.sendEmail.emit(this.simpleEmailForm.value);
      this.simpleEmailForm.patchValue({
        toNumber: this.email,
        body: '',
        subject: ''
      });
    }
  }

  templateSelected(e: any) {
    if (e && e.body) {
      this.simpleEmailForm.patchValue({
        body: e.body,
        subject: e.subject ? e.subject : ''
      });
    }
  }
  removeTemplate() {
    this.simpleEmailForm.patchValue({
      body: '',
      subject: ''
    });
  }

  showHideTemplatesDialog(e: any) {
    this.showTemplatesModal = e;
  }

  aiModelClose(event: any) {
    if (event?.replace) {
      this.simpleEmailForm.patchValue({
        body: event.replaceData
      });
    }
    this.showAiModal = false;
  }

  adjustEditorHeight() {
    const editorContainer = this.editorContainer.nativeElement;
    const ckeditorContent = editorContainer.querySelector('.ck-content');
    if (ckeditorContent) {
      const isOverflowing =
        ckeditorContent.scrollHeight > editorContainer.clientHeight;
      editorContainer.style.overflowY = isOverflowing ? 'auto' : 'hidden';
    }
  }
}
