import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FolderManagementService } from '../../services/folder-management.service';

@Component({
  selector: 'app-add-edit-media-folder',
  templateUrl: './add-edit-media-folder.component.html',
  styleUrls: ['./add-edit-media-folder.component.css']
})
export class AddEditMediaFolderComponent implements OnInit, OnChanges {
  addFolderForm: FormGroup;
  @Input() editId: any;
  @Input() parentFileManagerFolderId: any = null;
  @Output() afterModalClose = new EventEmitter<any>();

  @Input() data: any = [];
  @Input() showAddFolderModal: boolean = false;
  parentFolderList:any =[];
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private fileService: FolderManagementService,
    private alertService: ToasTMessageService
  ) {}

  ngOnChanges(): void {
    setTimeout(() => {
      console.log(this.data);

      if (this.editId) {
        this.loadFolderData();
      }
    }, 1000);
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
          this.parentFolderNameValidator.bind(this),
          this.curentFolderNameValidator.bind(this),
          this.noWhitespaceValidator
        ]
      ]
    });
  }

  loadFolderList() {
    this.fileService.getFolder().then((data: any) => {
      this.parentFolderList = data;
    });
  }
  noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { whitespace: true };
  }

  parentFolderNameValidator(control: AbstractControl): ValidationErrors | null {
    console.log(this.parentFolderList);
    const folderName = control.value;
    const folderExists = this.parentFolderList.some(
      (folder: any) => folder.name.toLowerCase() === folderName.toLowerCase()
    );
    return folderExists ? { folderExists: true } : null;
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
      formData['parentSocialMediaLibraryFolderId'] =
        this.parentFileManagerFolderId;
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
    return this.addFolderForm?.controls;
  }
  closeModal() {
    this.afterModalClose.emit({ type: 'Close' });
  }

  curentFolderNameValidator(control: AbstractControl): ValidationErrors | null {
    const folderName = control.value;
    const folderExists = this.data.some(
      (folder: any) => folder.name.toLowerCase() === folderName.toLowerCase()
    );
    return folderExists ? { folderExists: true } : null;
  }
}
