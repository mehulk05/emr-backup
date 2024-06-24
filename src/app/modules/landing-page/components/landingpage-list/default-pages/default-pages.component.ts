import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { LandingPageService } from '../../../service/landing-page.service';

@Component({
  selector: 'app-default-pages',
  templateUrl: './default-pages.component.html',
  styleUrls: ['./default-pages.component.css']
})
export class DefaultPagesComponent {
  @Input() previwThumbnailLink: any;
  @Input() defaultTemplates: any;
  @Input() link: any;
  @Input() bid: any;
  @Input() websiteLink: any;
  @Input() landingPageLibraryLink: any;
  @Input() isEditDisabled = false;
  @Input() isDeleteDisabled = false;
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onPageUpdate = new EventEmitter<any>();
  //websiteLink: any = environment.SSR_DOMAIN;
  oldDomain = environment.OLD_EMR_DOMAIN;
  landingPageFilter: any = '';
  showModal: boolean = false;
  modalData: any;
  constructor(
    private router: Router,
    private toasTMessageService: ToasTMessageService,
    private landingPageService: LandingPageService
  ) {}

  editPage(id: any) {
    console.log('id', id);
    this.router.navigate(['landingpage', id, 'edit']);
  }

  addLandingPage() {
    this.router.navigate(['landingpage/create']);
  }

  replaceSpecialCharacter(name: any) {
    // var name1 = name.replace(/[^a-zA-Z0-9_-]+/g, '');
    var name1 = name ? name.replace(/[^a-zA-Z0-9_-]+/g, '') : name;
    //console.log(name1)
    return name1;
  }

  onEventFromTable(e: any) {
    if (e.eventType === 'DELETE') {
      this.deleteTrash(e.data);
    } else if (e.eventType === 'CREATE') {
      this.addLandingPage();
    } else if (e.eventType === 'EDIT') {
      this.editPage(e.data);
    } else if (e.eventType === 'USE') {
      this.useTemplate(e.data);
    }
  }

  useTemplate(pageData: any) {
    this.landingPageService.copyTemplateToMyTemplate(pageData.page.id).then(
      (data) => {
        console.log(data);
        this.onPageUpdate.emit();
        this.toasTMessageService.success(
          'Website Template is copied to My Template successfully.'
        );

        window.open(pageData.previewUrl, '_blank');
      },
      (e) => {
        console.log(e);
      }
    );
  }

  deleteTrash(data: any) {
    console.log('id', data);
    this.showModal = true;
    this.modalData = {
      name: data.name,
      id: data.id
    };
    this.showModal = true;
    this.modalData.feildName = data.name;
    this.modalData.titleName = 'Landing';
  }

  onCloseModal(e: any) {
    this.showModal = false;
    console.log('e', e);
    if (e.isDelete) {
      this.DeleteLanding(this.modalData.id);
    }
  }

  DeleteLanding(id: any) {
    this.landingPageService.deleteLandingPage(id).then(
      () => {
        this.onPageUpdate.emit();
        this.toasTMessageService.success('Landing page deleted successfully.');
      },
      () => {
        this.toasTMessageService.error('Unable to delete landing page.');
      }
    );
  }

  searchPage() {
    this.onPageUpdate.emit({ searchText: this.landingPageFilter });
  }
}
