import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { currentUserService } from 'src/app/modules/authentication/services/current-user.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { MenuService } from 'src/app/shared/services/sidebar-menu.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-sidebar-static-links',
  templateUrl: './sidebar-static-links.component.html',
  styleUrls: ['./sidebar-static-links.component.css']
})
export class SidebarStaticLinksComponent implements OnChanges {
  // staticLinks:any;
  @Input() isSidebarOpened: boolean;
  @Input() businessData: any;
  staticLinks: any[] = staticLinks;
  loggedInUser: any;
  contactSupportEmail: any;
  subscription = new Subscription();
  constructor(
    private currentUserService: currentUserService,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService,
    private menuService: MenuService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Enter In ngOnChanges in sideBar');
    console.log(this.businessData, changes);
    this.businessData.termsAndConditions =
      changes.businessData.previousValue.termsAndConditions;
    this.businessData.privacyPolicy =
      changes.businessData.previousValue.privacyPolicy;
    // if (changes.agencyConfig && changes.agencyConfig.firstChange) {
    //   this.loadAgencyConfigurationData(this.agencyConfig);
    // }
  }

  logout() {
    this.currentUserService.currentUserSubject.next(null);
    this.authService.currentBusinessSubject.next(null);
    this.menuService.sideBarInfoSubject.next({
      hideHeader: true,
      hideSidebar: true
    });
    this.localStorageService.clearStorage();
    this.router.navigate(['/']);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }

  loadbusinessDataurationData(businessData: any) {
    this.staticLinks = [];

    if (businessData) {
      this.contactSupportEmail = businessData.contactSupportEmail;

      if (this.contactSupportEmail) {
        const contactSupportLink = this.staticLinks.find(
          (link) => link.title === 'Contact Support'
        );

        if (contactSupportLink) {
          contactSupportLink.email = this.contactSupportEmail;
        } else {
          // Create a new 'Contact Support' link if it doesn't exist
          // this.staticLinks.push({
          //   title: 'Contact Support',
          //   type: 'mail',
          //   email: this.contactSupportEmail,
          //   icon: 'fa fa-headset'
          // });

          this.staticLinks.push({
            title: 'Contact Support',
            type: 'external',
            url: this.sanitizer.bypassSecurityTrustResourceUrl(
              this.contactSupportEmail
            ),
            openInNewTab: true,
            icon: 'fa fa-headset'
          });
        }
      }

      this.staticLinks.push(
        ...staticLinks.filter((link) => link.title !== 'Contact Support')
      );
    } else {
      // If businessData is not provided, use the default staticLinks
      this.staticLinks = staticLinks;
    }
  }
}

export const staticLinks = [
  {
    title: 'Online Demo',
    type: 'route',
    route: '/online-demo',
    icon: 'fa-laptop fas'
  },
  // {
  //   title: 'Contact Support',
  //   type: 'mail',
  //   email: 'support@example.com',
  //   icon: 'fa fa-headset',
  //   route:
  //     'https://support.growth99.com/portal/en/kb/connect-with-customer-experience-team'
  // },
  {
    title: 'Contact Support',
    type: 'external',
    url: 'https://support.growth99.com/portal/en/kb/articles/how-to-have-a-phone-call-with-the-customer-experience-team',
    openInNewTab: true,
    icon: 'fa fa-headset'
  },
  {
    title: 'Announcement',
    type: 'route',
    route: '/prod-release',
    icon: 'fa-bullhorn fas'
  },
  {
    title: 'Feedback',
    type: 'iconWithImage',
    route: '/feedback',
    icon: 'https://g99plus.b-cdn.net/Emr/Feature%20Request.svg'
  },
  {
    title: 'Help and Training',
    type: 'external',
    url: 'https://support.growth99.com/portal/en/kb/growth99plus-articles-and-video-trainings',
    openInNewTab: true,
    icon: 'fas fa-graduation-cap'
  },
  // {
  //   title: 'Help and Training',
  //   type: 'external',
  //   url: ' https://support.growth99.com/portal/en/kb/growth99plus-articles-and-video-trainings',
  //   openInNewTab: true,
  //   icon: 'fas fa-graduation-cap'
  // },
  {
    title: 'Logout',
    type: 'logout',
    icon: 'fa fa-power-off'
  }
];
