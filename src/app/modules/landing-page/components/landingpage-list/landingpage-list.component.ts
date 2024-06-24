import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { LandingPageService } from '../../service/landing-page.service';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';

@Component({
  selector: 'app-landingpage-list',
  templateUrl: './landingpage-list.component.html',
  styleUrls: ['./landingpage-list.component.css']
})
export class LandingpageListComponent implements OnInit {
  selectedIndex: any = 0;
  sources = ['myWebsite', 'ServiceRelated', 'otherLandingPage'];
  source: any = 'myWebsite';
  websiteLink: any;
  landingPageLibraryLink: any;
  modifiedTemplates: any = [];
  defaultTemplates: any = [];
  libraryTemplates: any = [];
  landingPages: any;

  ssrDomain = environment.SSR_DOMAIN;
  loggedInUser: any;
  domain: any = environment.OLD_EMR_DOMAIN;
  link: any = null;
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1,
    first: 0
  };

  myPaginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1,
    first: 0
  };
  totalDataCount: any = 0;
  totalDataCustomCount: any = 0;
  previwThumbnailLink: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private landingpageService: LandingPageService,
    private alertService: ToasTMessageService,
    private businessService: BusinessService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.previwThumbnailLink =
      this.domain + '/assets/static/landingpage-preview.html?';
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data.source ?? 'myWebsite';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
        if (this.source === 'myWebsite') {
          this.loadLanddingPages(
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord,
            this.source
          );
        } else if (this.source === 'Libary') {
          this.loadLanddingPages(
            this.myPaginatorConfig.currentPage,
            this.myPaginatorConfig.noOfRecord,
            this.source
          );
        }
      }
    });
    this.authService.currentUserSubject.subscribe((data: any) => {
      this.loggedInUser = data;
      this.loadBusiness();
    });
  }

  loadLanddingPages(
    page?: number,
    size?: number,
    source?: string,
    search?: string
  ) {
    if (search && search.trim()) {
      (page = 0), (size = 10);
      this.paginatorConfig.currentPage = 0;
      this.myPaginatorConfig.currentPage = 0;
      this.paginatorConfig.currentRecordIndex = 1;
      this.myPaginatorConfig.currentRecordIndex = 1;
    }
    this.modifiedTemplates = [];
    this.defaultTemplates = [];
    if (!source || source === 'myWebsite') {
      this.landingpageService
        .getOptimizedLandingPageList(page, size, search)
        .then(
          (response: any) => {
            this.totalDataCount = response.pop();
            this.landingPages = response;
            this.landingPages.map((data: any) => {
              this.defaultTemplates.push(data);
              console.log(this.defaultTemplates);
            });
          },
          () => {
            this.alertService.error('Unable to load landing pages.');
          }
        );
    } else {
      this.libraryTemplates = [];
      this.landingpageService.getLibraryPages(page, size, search).then(
        (data: any) => {
          console.log(data);
          this.totalDataCustomCount = data.pop();
          this.libraryTemplates = data;
        },
        (e) => {
          console.log(e);
        }
      );
    }
  }

  getThumbnail(landingPages: any) {
    landingPages.forEach((page: any, index: any) => {
      var ele = document.createElement('div');
      ele.innerHTML = page?.landingPageTemplate;
      var image: any = ele.querySelector('img');
      if (image != null) {
        landingPages[index].landingPageImage = image.src;
      } else {
        landingPages[index].landingPageImage =
          'https://g99plus.b-cdn.net/AEMR/assets/images/nopreview.jpeg';
      }
    });
  }

  refreshPage(e: any) {
    console.log(e);
    this.loadLanddingPages(
      this.paginatorConfig.currentPage,
      this.paginatorConfig.noOfRecord,
      this.source,
      e?.searchText
    );
  }
  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['landingpage'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }

  loadBusiness() {
    this.businessService
      .getBusinessOptimized(this.loggedInUser.businessId)
      .then((response: any) => {
        if (response.subDomainName != null) {
          this.ssrDomain =
            location.protocol +
            '//' +
            response.subDomainName +
            '.' +
            environment.SSR_HOST;
          this.domain =
            location.protocol +
            '//' +
            response.subDomainName +
            '.' +
            location.hostname +
            (location.port ? ':' + location.port : '');
          this.websiteLink =
            location.protocol +
            '//' +
            response.subDomainName +
            '.' +
            environment.SSR_HOST;
        }
      });

    this.landingPageLibraryLink =
      environment.NEW_UI_DOMAIN +
      '/public/landingPage?businessId=' +
      this.loggedInUser.businessId;
  }

  paginate(event: any) {
    console.log(event);

    if (this.source === 'myWebsite') {
      this.paginatorConfig.currentPage = event.page;
      this.paginatorConfig.noOfRecord = event.rows;

      this.paginatorConfig.currentRecordIndex = event.first;
      this.loadLanddingPages(
        this.paginatorConfig.currentPage,
        this.paginatorConfig.noOfRecord,
        this.source
      );
    } else {
      this.myPaginatorConfig.currentPage = event.page;
      this.myPaginatorConfig.noOfRecord = event.rows;

      this.myPaginatorConfig.currentRecordIndex = event.first;
      this.loadLanddingPages(
        this.myPaginatorConfig.currentPage,
        this.myPaginatorConfig.noOfRecord,
        this.source
      );
    }
  }
}
