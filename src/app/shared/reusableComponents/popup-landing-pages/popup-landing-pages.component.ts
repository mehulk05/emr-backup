import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { environment } from 'src/environments/environment';
import { ToasTMessageService } from '../../services/toast-message.service';
import { WebsiteService } from 'src/app/modules/website/service/website.service';

@Component({
  selector: 'app-popup-landing-pages',
  templateUrl: './popup-landing-pages.component.html',
  styleUrls: ['./popup-landing-pages.component.css']
})
export class PopupLandingPagesComponent implements OnInit {
  @Input() showModalForImage: boolean = true;
  @Output() afterImageSelection = new EventEmitter<any>();
  previwThumbnailLink: string;
  ssrhost = environment.SSR_DOMAIN;
  defaultTemplates: any[] = [];
  totalDataCustomCount: any = 0;
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1,
    first: 0
  };
  websitePageFilter: any = '';
  domain: any = environment.OLD_EMR_DOMAIN;
  link: any;
  bid: any = 0;

  myPaginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1,
    first: 0
  };

  constructor(
    private landingpageService: WebsiteService,
    private authenticationService: AuthService,
    private toasTMessageService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.link = this.domain + '/assets/static/website.html?';
    this.previwThumbnailLink = this.domain + '/assets/static/website-old.html?';
    this.authenticationService.currentUserSubject.subscribe((data) => {
      this.bid = data?.businessId;
    });
    this.loadLanddingPages(
      this.myPaginatorConfig.currentPage,
      this.myPaginatorConfig.noOfRecord
    );
  }

  loadLanddingPages(page?: number, size?: number, search?: string) {
    if (search && search.trim()) {
      (page = 0), (size = 10);
      this.paginatorConfig.currentPage = 0;
      this.myPaginatorConfig.currentPage = 0;
      this.paginatorConfig.currentRecordIndex = 1;
      this.myPaginatorConfig.currentRecordIndex = 1;
    }
    this.defaultTemplates = [];
    this.landingpageService.websiteList().then(
      (data: any) => {
        console.log(data);
        //this.totalDataCustomCount = data?.pop();
        this.defaultTemplates = data?.filter(
          (obj: any) => !obj.selectedWebsite
        );
      },
      (e) => {
        console.log(e);
      }
    );
  }

  paginate(event: any) {
    console.log(event);
    this.myPaginatorConfig.currentPage = event.page;
    this.myPaginatorConfig.noOfRecord = event.rows;
    this.myPaginatorConfig.currentRecordIndex = event.first;
    this.loadLanddingPages(
      this.myPaginatorConfig.currentPage,
      this.myPaginatorConfig.noOfRecord
    );
  }

  useTemplate(id: any) {
    this.landingpageService.updateSelectedWebsite(id).then(
      (data) => {
        console.log(data);
        this.toasTMessageService.success(
          'Website Template is copied to My Template successfully.'
        );
        this.afterImageSelection.emit({ true: 'true' });
      },
      (e) => {
        console.log(e);
      }
    );
  }

  replaceSpecialCharacter(name: any) {
    // var name1 = name.replace(/[^a-zA-Z0-9_-]+/g, '');
    var name1 = name ? name.replace(/[^a-zA-Z0-9_-]+/g, '') : name;
    //console.log(name1)
    return name1;
  }

  selectTheme(
    landingPageReq: any,
    bgColor: any,
    fgColor: any,
    titleColor: any
  ) {
    var event: any = {};
    localStorage.removeItem('personalization');
    event.landingPage = landingPageReq;
    event.landingPage.buttonBackgroundColor = bgColor;
    event.landingPage.buttonForegroundColor = fgColor;
    event.landingPage.titleColor = titleColor;
    const landingPage: any = event.landingPage;
    //   this.backgroundColor = bgColor
    //   this.foregroundColor = fgColor
    //   this.titleColor = titleColor
    const buttonCSS =
      landingPage.buttonCSS +
      'button {background:' +
      landingPage.buttonBackgroundColor +
      ' !important; color:' +
      landingPage.buttonForegroundColor +
      ' !important }';
    landingPage.buttonCSS = buttonCSS;
    this.landingpageService.update(landingPage.id, landingPage).then(
      () => {
        this.toasTMessageService.success('Website updated successfully.');
        this.loadLanddingPages(
          this.myPaginatorConfig.currentPage,
          this.myPaginatorConfig.noOfRecord
        );
      },
      () => {
        this.toasTMessageService.error(
          'Error while updating the theme for website'
        );
      }
    );
  }
}
