import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LandingPageService } from '../../service/landing-page.service';

@Component({
  selector: 'app-landing-page-others-service',
  templateUrl: './landing-page-others-service.component.html',
  styleUrls: ['./landing-page-others-service.component.css']
})
export class LandingPageOthersServiceComponent implements OnInit {
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
  domain = environment.OLD_EMR_DOMAIN;
  landingPageFilter: any = '';
  showModal: boolean = false;
  modalData: any;
  totalDataCount: any;
  landingPages: any;
  loggedInUser: any;
  leadTagFilter = '';
  leadTagFilterName = '';
  tagsResponse: any[] = [];

  constructor(
    private router: Router,
    private toasTMessageService: ToasTMessageService,
    private landingPageService: LandingPageService,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {
    this.authService.currentUserSubject.subscribe((data: any) => {
      this.loggedInUser = data;
    });
  }

  ngOnInit(): void {
    this.previwThumbnailLink =
      this.domain + '/assets/static/landingpage-preview.html?';
    this.getlandingPageWithService();
    this.loadLeadTags();
    this.authService.currentUserSubject.subscribe((data: any) => {
      this.loggedInUser = data;
    });
  }

  loadLeadTags() {
    this.landingPageService
      .tagList('LANDING_PAGE')
      .then((data: any) => {
        this.tagsResponse = data;
      })
      .catch(() => {
        this.toasTMessageService.error('Unable to load leads');
      });
  }

  getlandingPageWithService() {
    this.landingPageService
      .getOtherLandingPageList(this.landingPageFilter, [this.leadTagFilterName])
      .then(
        (response: any) => {
          this.totalDataCount = response.length;
          this.landingPages = response;
        },
        () => {
          this.toasTMessageService.error('Unable to load landing pages.');
        }
      );
  }

  handleChange(e: any) {
    this.localStorageService.storeItem('landing-page', e.data);
    this.router.navigate(['landingpage/service-landing-other'], {
      queryParams: {
        serviceName: e.serviceName
      }
    });
  }

  searchPage() {
    this.getlandingPageWithService();
  }

  ontagChange(event: any) {
    this.leadTagFilterName = this.tagsResponse.filter(
      (data: any) => data.id === event.value
    )[0]?.name;
    this.getlandingPageWithService();
  }

  resetTag() {
    this.landingPageFilter = '';
    this.leadTagFilterName = '';
    this.leadTagFilter = null;
    this.getlandingPageWithService();
  }
}
