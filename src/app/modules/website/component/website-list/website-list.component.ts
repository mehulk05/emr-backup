import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BusinessService } from 'src/app/modules/account-and-settings/business/services/business.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { WebsiteService } from '../../service/website.service';

@Component({
  selector: 'app-website-list',
  templateUrl: './website-list.component.html',
  styleUrls: ['./website-list.component.css']
})
export class WebsiteListComponent implements OnInit {
  selectedIndex: any = 0;
  sources = ['myWebsite', 'OtherWebsite'];
  source: any = 'myWebsite';
  websiteLink: any;

  modifiedTemplates: any = [];
  defaultTemplates: any = [];

  isWebsiteSelected: boolean = false;
  defaultWebsite: any;
  previwThumbnailLink: string;

  ssrDomain = environment.SSR_DOMAIN;
  domain: any = environment.OLD_EMR_DOMAIN;
  link: any = null;
  loggedInUser: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private webstieService: WebsiteService,
    private alertService: ToasTMessageService,
    private authService: AuthService,
    private businessService: BusinessService
  ) {}

  ngOnInit(): void {
    console.log('');
    this.loadWebsite();
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data.source;
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });

    this.authService.currentUserSubject.subscribe((data: any) => {
      this.loggedInUser = data;
      this.loadBusiness();
    });
  }

  loadWebsite() {
    this.modifiedTemplates = [];
    this.defaultTemplates = [];
    this.link = this.domain + '/assets/static/website.html?';
    this.previwThumbnailLink = this.domain + '/assets/static/website-old.html?';
    this.webstieService.websiteList().then(
      (response: any) => {
        response.map((data: any) => {
          console.log(data.selectedWebsite);
          if (data.selectedWebsite) {
            this.defaultTemplates.push(data);
          } else {
            this.modifiedTemplates.push(data);
          }
        });
        console.log(this.modifiedTemplates);
      },
      () => {
        this.alertService.error('Unable to load website pages.');
      }
    );
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    this.router.navigate(['website'], {
      queryParams: {
        source: this.sources[e.index]
      },
      queryParamsHandling: 'merge'
    });
  }

  /* ------------------------ Theme color change event ------------------------ */
  selectTheme(event: any) {
    console.log(event);
    if (event.checkboxEvent) {
      this.updateWebsite(event.id);
    } else {
      localStorage.removeItem('personalization');
      event.landingPage.buttonBackgroundColor = event.bgColor;
      event.landingPage.buttonForegroundColor = event.fgColor;
      event.landingPage.titleColor = event.titleColor;
      const landingPage = event.landingPage;
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
      this.webstieService.update(landingPage.id, landingPage).then(
        () => {
          this.alertService.success('Website updated successfully.');
          this.loadWebsite();
          // window.open(
          //   this.ssrDomain +
          //     '/website?bid=' +
          //     landingPage.tenantId +
          //     '&lpid=' +
          //     landingPage.id,
          //   '_blank'
          // );
        },
        () => {
          this.alertService.error('Error while updating the theme for website');
        }
      );
    }
  }

  /* ----------------------------- Checkbox event ----------------------------- */
  updateWebsite(id: any) {
    console.log(id);
    this.webstieService.updateSelectedWebsite(id).then(
      () => {
        this.loadWebsite();
      },
      () => {
        this.alertService.error('Unable to update Clinic.');
      }
    );
  }

  deleteLanding(id: any) {
    this.webstieService.deleteLandingPage(id).then(
      () => {
        this.alertService.success('Website page deleted successfully.');
        this.loadWebsite();
      },
      () => {
        this.alertService.error('Unable to delete landing page.');
      }
    );
  }

  loadBusiness() {
    console.log('Business Id Is : ' + this.loggedInUser.businessId);

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
  }
}
