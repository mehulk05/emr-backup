import { Location } from '@angular/common';
import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { LandingPageService } from 'src/app/modules/landing-page/service/landing-page.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-landingpage-service-list',
  templateUrl: './landingpage-service-list.component.html',
  styleUrls: ['./landingpage-service-list.component.css']
})
export class LandingpageServiceListComponent implements OnInit, OnDestroy {
  oldDomain = environment.OLD_EMR_DOMAIN;
  landingPageFilter: any = '';
  showModal: boolean = false;
  modalData: any;
  @Output() emitPageEvent = new EventEmitter<any>();
  currentSource: any;
  websiteLink = '';
  loggedInUser: any = [];
  bid = '';
  domain = environment.OLD_EMR_DOMAIN;
  previwThumbnailLink = '';
  defaultTemplates: any[] = [];
  unFilteredContent: any[] = [];
  editDisabled = true;
  serviceName = '';
  deleteDisabled = true;
  myPaginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1,
    first: 0
  };
  totalDataCount = 0;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private toastMessage: ToasTMessageService,
    private router: Router,
    private activeRouter: ActivatedRoute,
    private authService: AuthService,
    private location: Location,
    private landingPageService: LandingPageService,
    private businessService: BusinessService
  ) {
    this.authService.currentUserSubject.subscribe((data: any) => {
      this.loggedInUser = data;
      this.bid = this.loggedInUser.businessId;
    });
    this.activatedRoute.queryParamMap.subscribe((data: any) => {
      this.serviceName = data?.params?.serviceName;
    });
  }

  ngOnInit(): void {
    this.defaultTemplates =
      this.localStorageService.readStorage('landing-page');
    this.totalDataCount = this.defaultTemplates.length;
    this.unFilteredContent = this.defaultTemplates;
    this.defaultTemplates;
    this.previwThumbnailLink =
      this.domain + '/assets/static/landingpage-preview.html?';
    this.activatedRoute.queryParams.subscribe((data) => {
      console.log('data', data);
      this.currentSource = data?.source;
    });
    this.loadBusiness();
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser.businessId)
      .then((response: any) => {
        if (response.subDomainName != null) {
          this.websiteLink =
            location.protocol +
            '//' +
            response.subDomainName +
            '.' +
            environment.SSR_HOST;
        }
      });
  }

  addLandingPage() {
    this.emitPageEvent.emit({ eventType: 'CREATE' });
    // this.router.navigate(['landingpage/create']);
  }

  replaceSpecialCharacter(name: any) {
    // var name1 = name.replace(/[^a-zA-Z0-9_-]+/g, '');
    var name1 = name ? name.replace(/[^a-zA-Z0-9_-]+/g, '') : name;
    //console.log(name1)
    return name1;
  }

  deleteTrash(data: any) {
    console.log('id', data);
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
        this.toastMessage.success('Landing page deleted successfully.');
        this.defaultTemplates = this.defaultTemplates.filter(
          (it: any) => it.landingPage.id != id
        );
      },
      () => {
        this.toastMessage.error('Unable to delete landing page.');
      }
    );
  }

  previewPage(page: any) {
    const currentUser = this.localStorageService.readStorage('currentUser');
    let url;
    if (currentUser && currentUser?.idToken) {
      url =
        this.websiteLink +
        '/landingpage1/' +
        page.id +
        '?token=' +
        currentUser.idToken;
    } else {
      url = this.websiteLink + '/landingpage/' + page.id;
    }
    window.open(url, '_blank');
  }

  useTemplate(page: any) {
    const url =
      this.websiteLink + '/service/' + this.replaceSpecialCharacter(page.name);

    this.landingPageService.copyTemplateToMyTemplate(page.id).then(
      (data) => {
        console.log(data);
        this.toastMessage.success(
          'Website Template is copied to My Template successfully.'
        );
        window.open(url, '_blank');
      },
      (e) => {
        console.log(e);
      }
    );
  }

  editPage(id: any) {
    this.router.navigate(['landingpage', id, 'edit']);
  }

  searchPage() {
    if (this.landingPageFilter) {
      this.defaultTemplates = this.unFilteredContent.filter((data: any) =>
        data.landingPage?.name
          ?.toLowerCase()
          .includes(this.landingPageFilter.toLowerCase())
      );
    } else {
      this.defaultTemplates = this.unFilteredContent;
    }
  }

  ngOnDestroy(): void {
    this.localStorageService.removeStorage('landing-page');
  }

  onBackPressed() {
    this.location.back();
  }
}
