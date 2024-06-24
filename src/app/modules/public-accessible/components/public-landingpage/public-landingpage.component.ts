import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { PublicAccessibleService } from '../../services/public-accessible.service';

@Component({
  selector: 'app-public-landingpage',
  templateUrl: './public-landingpage.component.html',
  styleUrls: ['./public-landingpage.component.css']
})
export class PublicLandingpageComponent implements OnInit {
  selectedIndex: any = 0;
  sources = ['myWebsite', 'Libary'];
  source: any = 'myWebsite';
  modifiedTemplates: any = [];
  defaultTemplates: any = [];
  landingPages: any;
  businessId: any;

  ssrDomain = environment.SSR_DOMAIN;
  paginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1
  };
  myPaginatorConfig = {
    currentPage: 0, //page
    totalPage: 0, //pageCount,
    noOfRecord: 10, //rows,
    recordArray: [10, 20, 25, 30, 50],
    currentRecordIndex: 1
  };
  totalDataCount: any = 0;
  domain: any = environment.OLD_EMR_DOMAIN;
  previwThumbnailLink: string;
  libraryTemplates: any = [];
  totalCustomCount: any;
  constructor(
    private landingpageService: PublicAccessibleService,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.previwThumbnailLink =
      this.domain + '/assets/static/landingpage-preview.html?';
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.businessId = data?.businessId;
      console.log(this.businessId);
      this.loadBusiness();
      this.source = data?.source ?? 'myWebsite';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
        if (this.source === 'myWebsite') {
          this.loadLanddingPages(
            this.paginatorConfig.currentPage,
            this.paginatorConfig.noOfRecord,
            this.source,
            ''
          );
        } else if (this.source === 'Libary') {
          this.loadLanddingPages(
            this.myPaginatorConfig.currentPage,
            this.myPaginatorConfig.noOfRecord,
            this.source,
            ''
          );
        }
      }
    });
  }

  loadLanddingPages(
    page?: number,
    size?: number,
    source?: string,
    search?: string
  ) {
    this.modifiedTemplates = [];
    this.defaultTemplates = [];
    console.log(search);
    if (search && search.trim()) {
      (page = 0), (size = 10);
      this.paginatorConfig.currentPage = 0;
      this.myPaginatorConfig.currentPage = 0;
      this.paginatorConfig.currentRecordIndex = 1;
      this.myPaginatorConfig.currentRecordIndex = 1;
    }
    if (!source || source === 'myWebsite') {
      this.landingpageService
        .getOptimizedLandingPageList(this.businessId, page, size, search)
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
      this.landingpageService
        .getLibraryPages(this.businessId, page, size, search)
        .then(
          (data: any) => {
            console.log(data);
            this.totalCustomCount = data.pop();
            this.libraryTemplates = data;
          },
          (e) => {
            console.log(e);
          }
        );
    }
  }

  onPageUpdate(e: any) {
    console.log(e);
    this.loadLanddingPages(0, 10, this.source, e?.searchText);
  }

  loadBusiness() {
    this.landingpageService
      .getBusinessData(this.businessId)
      .then((response: any) => {
        if (response.subDomainName != null) {
          this.ssrDomain =
            location.protocol +
            '//' +
            response.subDomainName +
            '.' +
            environment.SSR_HOST;
        }
      });
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

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['public', 'landingPage'], {
      queryParams: {
        source: this.sources[e.index],
        businessId: this.businessId
      },
      queryParamsHandling: 'merge'
    });
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
        this.source,
        ''
      );
    } else {
      this.myPaginatorConfig.currentPage = event.page;
      this.myPaginatorConfig.noOfRecord = event.rows;

      this.myPaginatorConfig.currentRecordIndex = event.first;
      this.loadLanddingPages(
        this.myPaginatorConfig.currentPage,
        this.myPaginatorConfig.noOfRecord,
        this.source,
        ''
      );
    }
  }
}
