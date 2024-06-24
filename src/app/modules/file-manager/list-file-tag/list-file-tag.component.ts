import { Component, Input, OnInit } from '@angular/core';
import { MediaTagService } from '../../social-media-manager/services/media-tag.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AbstractControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-list-file-tag',
  templateUrl: './list-file-tag.component.html',
  styleUrls: ['./list-file-tag.component.css']
})
export class ListFileTagComponent implements OnInit {
  showModal: boolean = false;
  modalData: any;
  first = 0;
  rows = 50;
  globalFilterColumn = ['id', 'name'];
  columns = [
    { header: 'Id', field: 'id' },
    { header: 'Name', field: 'name' },
    { header: 'Actions', field: 'actions' }
  ];
  _selectedColumns: any[] = this.columns;
  rowData: any[] = [];
  screeName = '';
  patientTagForm: any;
  submitted: boolean;
  duplicateLabel: any;
  editId: any;
  isModalVisible: boolean;
  labels: any;
  disableAdd: any;
  constructor(
    private mediaTagService: MediaTagService,
    private toastService: ToasTMessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private alertService: ToasTMessageService,
    private patientTagService: MediaTagService
  ) {}
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      this.screeName = params['page'];
    });
    this.loadPatientTags();
    this.patientTagForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          this.noOnlySpacesValidator
          // Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          // Validators.pattern(/^[a-zA-Z0-9\s]+$/)
        ]
      ],
      isDefault: [false, []]
    });
  }

  get f() {
    return this.patientTagForm.controls;
  }

  onLabelAdd = ($event: any) => {
    const name = $event.target?.value;
    console.log('name', name);
    if (
      this.rowData.some(
        (label: any) => label.name.toLowerCase() == name.toLowerCase()
      )
    ) {
      this.duplicateLabel = true;
    } else {
      this.duplicateLabel = false;
    }
    console.log('dupli', this.duplicateLabel);
    this.disableAdd = name === '' || this.duplicateLabel;
  };

  noOnlySpacesValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    if (control.value && control.value.trim() === '') {
      return { onlySpaces: true };
    }
    return null;
  }

  createTag() {
    this.editId = null;
    this.patientTagForm.patchValue({
      name: '',
      isDefault: false
    });
    this.isModalVisible = true;
  }

  editTag(editId: number) {
    this.editId = editId;
    this.loadTag();
    this.isModalVisible = true;
  }

  loadTag() {
    if (this.editId) {
      this.patientTagService.get(this.editId).then((response: any) => {
        this.patientTagForm.patchValue(response);
      });
    }
  }

  loadPatientTags() {
    this.mediaTagService
      .fileManagerTagList()
      .then((data: any) => {
        this.rowData = data.sort((a: any, b: any) => (a.id > b.id ? -1 : 1));
        // console.log(this.rowData.sort((a, b) => (a.id > b.id ? -1 : 1)));
      })
      .catch(() => {
        this.toastService.error('Unable to load File Tags');
      });
  }

  deleteTemplateModal(data: any) {
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'File Tag';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    if (e.isDelete) {
      this.deleteTemplate(this.modalData.id);
    }
  }

  deleteTemplate(id: any) {
    this.mediaTagService
      .deleteTagFileManagerById(id)
      .then(() => {
        this.loadPatientTags();
        this.toastService.success('Tag deleted successfully');
      })
      .catch(() => {
        this.toastService.error(
          'The Tag Associated With A Media Cannot Be Deleted. To Delete, Remove This Tag From The Media'
        );
      });
  }
  editTemplate(id: any) {
    this.router.navigate(['/file-manager/tag/edit', id]);
  }
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.columns.filter((col) => val.includes(col));
  }

  onBackPressed() {
    // this.router.navigate(['/file-manager']);
    this.isModalVisible = false;
    this.editId = null;
  }

  submitForm() {
    this.submitted = true;
    if (this.patientTagForm.invalid) {
      return;
    }
    if (this.duplicateLabel) {
      return;
    }

    if (this.editId) {
      const formData = this.patientTagForm.value;
      this.patientTagService.update(this.editId, formData).then(
        () => {
          //this.images.push(event.target.result);
          this.alertService.success('Tag updated successfully.');
          this.loadPatientTags();
          this.onBackPressed();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    } else {
      var formData = this.patientTagForm.value;
      formData['isFileManagerTag'] = true;
      console.log(formData);
      this.patientTagService.create(formData).then(
        () => {
          this.alertService.success('Tag created successfully.');
          this.loadPatientTags();
          this.onBackPressed();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    }
  }
}
