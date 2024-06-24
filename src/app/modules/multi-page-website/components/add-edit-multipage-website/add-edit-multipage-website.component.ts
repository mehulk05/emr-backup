import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { MultipageWebsiteService } from '../../services/multipage-website.service';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { FileSaverService } from 'ngx-filesaver';

@Component({
  selector: 'app-add-edit-multipage-website',
  templateUrl: './add-edit-multipage-website.component.html',
  styleUrls: ['./add-edit-multipage-website.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AddEditMultipageWebsiteComponent implements OnInit {
  id: any = null;
  editorConfig: any;
  landingPageForm: FormGroup;
  file: any;
  fileType = ['.zip', '.rar'];

  websitePreviewUrl = environment.SSR_DOMAIN;

  @ViewChild('fileDropRef') inputVariable: ElementRef;
  websiteData: any;
  selectedPageIndex: number = 0;
  bootstrapCdn: string;
  selectedPageFromWebsite: any;
  updatedHTMLPageContent: any;
  showAddNewPageModal: boolean;
  isAddNewPageApiLoading: boolean;
  showDeletePageModal: boolean;
  modalData: any;
  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private alertService: ToasTMessageService,
    private landingPageService: MultipageWebsiteService,
    private fileSaverService: FileSaverService
  ) {}

  ngOnInit(): void {
    this.landingPageForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      landingPageTemplate: ['', [Validators.required]],
      file: ['', []]
    });

    this.activatedRoute.params.subscribe((params) => {
      this.id = params['id']; // Assuming 'id' is the parameter name
      if (this.id) {
        // Fetch data for the specific ID using your service
        this.fetchDataById(this.id);
      }
    });
  }

  fetchDataById(id: any) {
    this.landingPageService.getFiles(id).then((data: any) => {
      console.log('here', data);
      this.websiteData = data;
      this.selectedPageFromWebsite = this.websiteData?.landingSinglePages[0];
      this.landingPageForm.patchValue({
        name: data.websiteName
      });
      this.websitePreviewUrl += `/multipage-website/${this.websiteData.websiteName}`;
    });
  }

  back() {
    this.router.navigate(['/multipage-website']);
  }

  get f() {
    return this.landingPageForm.controls;
  }

  deleteFile() {
    this.file = null;
    this.inputVariable.nativeElement.value = '';
  }

  downloadWebsiteZip() {
    this.landingPageService
      .downloadZipOfMultipageWebsite(this.websiteData.id)
      .then((data: any) => {
        this.fileSaverService.save(data, this.websiteData.websiteName + '.zip');
      })
      .catch((error) => {
        console.error('Error downloading file:', error);
      });
  }
  onFormSubmit() {
    console.log('here', this.landingPageForm.value);
    const formData = new FormData();
    if (this.file) {
      formData.append('file', this.landingPageForm.get('file').value);
    }
    formData.append('websiteName', this.landingPageForm.get('name').value);
    if (this.id) {
      formData.append('id', this.websiteData.id);
      this.landingPageService.update(formData).then(
        (data) => {
          console.log(data);
          // this.router.navigate(['']);
        },
        () => {
          this.alertService.error('Error while uploading files');
        }
      );
    } else {
      this.landingPageService.create(formData).then(
        (data) => {
          console.log(data);
          this.router.navigate(['multipage-website']);
        },
        () => {
          this.alertService.error('Error while uploading files');
        }
      );
    }
  }

  onFileDropped($event: any) {
    console.log($event);
    if ($event.length > 0 && this.fileType.includes($event[0].type)) {
      this.prepareFilesList($event);
    } else {
      this.file = null;
    }
  }

  /**
   * handle file from browsing
   */
  fileBrowseHandler(files: any) {
    this.prepareFilesList(files?.files);
  }

  prepareFilesList(files: any) {
    this.file = files[0];
    console.log(this.file);

    if (
      files.length > 0 &&
      (files[0].type === 'application/x-zip-compressed' ||
        files[0].type === 'application/x-rar-compressed')
    ) {
      this.landingPageForm.patchValue({
        file: this.file
      });
      // this.onFormSubmit();
    } else {
      this.alertService.error('Please upload a zip file');
    }
  }

  /**
   * format bytes
   * @param bytes (File size in bytes)
   * @param decimals (Decimals point)
   */
  formatBytes(bytes: number, decimals?: number) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  /**
   * showPagePreview
   * @param page - The selected page object to display in the preview.
   * @param index - The index of the selected page in the `landingSinglePages` array.
   */

  showPagePreview(page: any, index: number) {
    // Set the selected page index
    this.selectedPageFromWebsite = page;
    this.bootstrapCdn =
      '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/css/bootstrap.min.css" integrity="sha384-xOolHFLEh07PJGoPkLv1IbcEPTNtaed2xpHsD9ESMhqIYd0nLMwNLD69Npy4HI+N" crossorigin="anonymous">';
    this.selectedPageIndex = index;
  }

  onPageHtmlChange(e: any) {
    console.log(e);
    this.updatedHTMLPageContent = e.editorVal;
  }

  savePage() {
    const apiPayload: any = {
      id: this.selectedPageFromWebsite.id,
      htmlContent: this.updatedHTMLPageContent
    };
    this.landingPageService
      .updateSinglePageHtmlContent(apiPayload)
      .then(() => {
        this.alertService.success('Page content updated successfully');
        this.fetchDataById(this.id);
      })
      .catch(() => {
        this.alertService.error('Failed to update the page content');
      });
  }

  addNewPage() {
    this.showAddNewPageModal = true;
  }

  handleOnAddPageModalClose(event: any) {
    if (event.type === 'close') {
      this.showAddNewPageModal = false;
    }
    if (event.event === 'success') {
      this.fetchDataById(this.id);
    }
  }

  deletePage(page: any) {
    console.log(page);
    event.stopPropagation();
    this.showDeletePageModal = true;

    this.modalData = {
      name: page.pageName,
      id: page.id
    };
    this.modalData.titleName = page.fileName + 'file';
  }

  onCloseModal(e: any) {
    this.showDeletePageModal = false;
    if (e.isDelete) {
      console.log(e);
      this.landingPageService
        .deleteSinglePage(this.modalData.id)
        .then(() => {
          this.fetchDataById(this.id);
          this.alertService.success('Page deleted successfully');
        })
        .catch((e: any) => {
          console.log(e);
          this.alertService.error(
            'There is some error while deleting the selected page. Please try again later!'
          );
        });
    }
  }
}
