import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { MultipageWebsiteService } from '../../services/multipage-website.service';

@Component({
  selector: 'app-add-website-single-page-modal',
  templateUrl: './add-website-single-page-modal.component.html',
  styleUrls: ['./add-website-single-page-modal.component.css']
})
export class AddWebsiteSinglePageModalComponent implements OnInit {
  isAddNewPageApiLoading: boolean;
  showAddNewPageModal: boolean;
  singlePageForm: FormGroup;
  updatedHTMLPageContent: any;
  @Input() websiteId: any;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onAddPageModalClose = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private alertService: ToasTMessageService,
    private landingPageService: MultipageWebsiteService
  ) {}

  ngOnInit(): void {
    this.singlePageForm = this.fb.group({
      filename: ['', [Validators.required, this.fileNameValidator()]],
      htmlContent: ['']
    });
  }

  // Custom validator for filename with .HTML extension
  fileNameValidator() {
    return (control: { value: any }) => {
      const filename = control.value;
      if (filename && !filename.toLowerCase().endsWith('.html')) {
        return { invalidFilename: true };
      }
      return null;
    };
  }

  onPageHtmlChange(e: any) {
    console.log(e);
    this.updatedHTMLPageContent = e.editorVal;
  }

  onCloseModal() {
    this.onAddPageModalClose.emit({ type: 'close', event: 'close' });
  }
  onSubmit() {
    if (this.singlePageForm.valid) {
      this.isAddNewPageApiLoading = true;

      const apiPayload: any = {
        fileName: this.singlePageForm.value.filename,
        htmlContent: this.updatedHTMLPageContent,
        pageName: this.singlePageForm.value.filename.split('.html')[0]
      };
      console.log(apiPayload);
      this.landingPageService
        .addNewPageToWebsite(apiPayload, this.websiteId)
        .then(() => {
          this.alertService.success('Page added successfully');
          this.onAddPageModalClose.emit({ type: 'close', event: 'success' });
        })
        .catch(() => {
          this.alertService.error('Failed to add the page');
          // this.onAddPageModalClose.emit({ type: 'close', event: 'error' });
        })
        .finally(() => {
          this.isAddNewPageApiLoading = false;
        });
    }
  }
}
