import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FileManagerService } from '../../services/file-manager.service';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.css']
})
export class AddFolderComponent implements OnInit, OnChanges {
  addFolderForm: FormGroup;
  @Input() editId: any;
  @Input() parentFileManagerFolderId: any = null;
  @Output() afterModalClose = new EventEmitter<any>();

  @Input() data: any;
  @Input() showAddFolderModal: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private fileService: FileManagerService,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService
  ) {}

  ngOnChanges(): void {
    console.log(this.data);

    if (this.editId) {
      this.loadFolderData();
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((data) => {
      this.loadFolderList();
      console.log(data);
    });
    this.addFolderForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(RegexEnum.folderNameRegex),
          this.folderNameValidator.bind(this)
        ]
      ]
    });
  }

  folderNameValidator(control: any) {
    const folderName = control.value ? control.value.trim() : '';
    if (!folderName) {
      return { required: true };
    }
    const folderExists = this.data.some(
      (folder: any) => folder.name.toLowerCase() === folderName.toLowerCase()
    );
    return folderExists ? { folderExists: true } : null;
  }

  checkFolderName(e: any) {
    console.log(e.target.value);
    const folderName = e.target.value;
    const folderExists = this.data.some(
      (folder: any) => folder.name === folderName
    );
    if (folderExists) {
      this.addFolderForm.get('name').setErrors({ folderExists: true });
    } else {
      this.addFolderForm.get('name').setErrors(null);
    }
  }
  loadFolderData() {
    this.fileService.getFolderById(this.editId).then((data: any) => {
      this.addFolderForm.patchValue({
        name: data.name
      });
    });
  }

  submitForm() {
    const formData = this.addFolderForm.value;
    console.log(this.addFolderForm.value);
    if (this.parentFileManagerFolderId) {
      formData['parentFileManagerFolderId'] = this.parentFileManagerFolderId;
    }
    if (this.editId) {
      this.fileService.updateFolder(this.editId, formData).then(() => {
        this.afterModalClose.emit({ type: 'Submit' });
        this.alertService.success('Folder Updated Successfully');
      });
    } else {
      this.fileService.addFolder(formData).then(() => {
        this.afterModalClose.emit({ type: 'Submit' });
        this.alertService.success('Folder Added Successfully');
      });
    }
  }

  get f() {
    return this.addFolderForm.controls;
  }
  closeModal() {
    this.afterModalClose.emit({ type: 'Close' });
  }

  loadFolderList() {
    this.fileService.getFolder().then((data: any) => {
      this.data = data;
    });
  }
}
