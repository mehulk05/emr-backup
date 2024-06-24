import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';

@Component({
  selector: 'app-templates-modal',
  templateUrl: './templates-modal.component.html',
  styleUrls: ['./templates-modal.component.css']
})
export class TemplatesModelComponent implements OnInit, OnChanges {
  @Input() showModal = true;
  @Input() moduleName: string;
  @Input() templates: any[] = [];
  @Output() templateSelected: EventEmitter<any> = new EventEmitter();
  @Output() hideTemplateModal: EventEmitter<any> = new EventEmitter();
  filteredTemplates: any[] = [];
  selectedTemplateId: any;
  selectedTemplate: any;
  constructor() {}

  ngOnInit(): void {
    if (this.templates?.length) {
      this.filteredTemplates = [...this.templates];
    }
  }

  ngOnChanges(): void {
    if (this.templates?.length) {
      this.filteredTemplates = [...this.templates];
    } else {
      this.filteredTemplates = [];
    }
  }

  hideModal() {
    this.showModal = false;
    this.hideTemplateModal.emit(false);
  }

  selectTemplate(templateId: any) {
    this.templateSelected.emit(templateId);
  }

  filterTemplates(e: any) {
    if (e.target?.value) {
      const searchText = e.target.value ?? '';
      this.filteredTemplates = this.templates.filter((template) =>
        template.name
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase())
      );
    } else {
      this.filteredTemplates = [...this.templates];
    }
  }

  selectTemplateId(id: any) {
    this.selectedTemplate = this.filteredTemplates.find(
      (template: any) => template.id == id
    );
    this.selectedTemplateId = id !== this.selectedTemplateId ? id : undefined;
  }

  selectTemplateMessage() {
    if (this.selectTemplateId) {
      const template = this.templates.find(
        (t) => t.id === this.selectedTemplateId
      );
      this.templateSelected.emit(template);
      this.hideModal();
    }
  }
}
