import { Component, OnInit } from '@angular/core';
import { BusinessService } from '../../services/business.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-api-card-integration',
  templateUrl: './api-card-integration.component.html',
  styleUrls: ['./api-card-integration.component.css']
})
export class ApiCardIntegrationComponent implements OnInit {
  apiIntegrationPageFilter = '';
  searchFilter = '';
  isApiCartdComponant = true;
  activeIntegration: any[] = [];
  stateOptions: any[] = [
    { label: 'Data Outgoing', value: 'Data Outgoing' },
    { label: 'Data Incoming', value: 'Data Incoming' }
  ];
  dataOutgoingApps = [
    {
      name: 'Aesthetic Record',
      description:
        'Aesthetic Record is a cloud-based practice management software designed to help aesthetic clinics manage online booking, patient records.',
      icon: 'asthetic-record',
      routing: 'details',
      active: false,
      disable: true,
      type: 'AESTHETIC'
    },
    {
      name: 'Close CRM',
      description:
        'Close is the inside sales CRM of choice for startups and SMBs. Make more calls, send more emails and close more deals starting today.',
      icon: 'close',
      routing: 'details',
      active: false,
      disable: true,
      type: 'CLOSE'
    },
    {
      name: 'Mailchimp',
      description:
        'Mailchimp is an email and marketing automations platform for growing businesses.',
      icon: 'mailchimp',
      routing: 'details',
      active: false,
      disable: true,
      type: 'MAILCHIMP'
    },
    {
      name: 'GoHighLevel',
      description:
        'GoHighLevel is a subscription-based all-in-one marketing and customer relationship management solution for agencies and professionals.',
      icon: 'highLevel',
      routing: 'details',
      active: false,
      disable: true,
      type: 'GOHIGHLEVEL'
    },
    {
      name: 'HubSpot',
      description:
        'HubSpot is an inbound marketing and sales software that helps companies attract visitors, convert leads, and close customers.',
      icon: 'hubspot',
      routing: 'details',
      active: false,
      disable: true,
      type: 'HUBSPOT'
    },
    {
      name: 'Zoho CRM',
      description:
        'Zoho CRM acts as a single repository to bring your sales, marketing, and customer support activities together, and streamline your process, policy.',
      icon: 'zoho',
      routing: 'details',
      active: false,
      disable: true,
      type: 'ZOHO'
    },
    {
      name: 'Nextech',
      description:
        'Nextech offers EHR, Practice Management, Patient Engagement and Revenue Management that enables productivity and profitability for specialty practices.',
      icon: 'nexttech',
      routing: 'details',
      active: false,
      disable: true,
      type: 'NEXTECH'
    },
    {
      name: 'Meevo',
      description:
        'Meevo equip beauty and wellness businesses with advanced operating solutions that drive growth, support employees, and engage clients.',
      icon: 'meevo',
      routing: 'details',
      active: false,
      disable: true,
      type: 'MEEVO'
    },
    {
      name: 'ActiveCampaign',
      description:
        'ActiveCampaign for Marketing gives businesses the power of personalization and automations to drive high-quality leads, increase customer engagement.',
      icon: 'active-campaign',
      routing: 'details',
      active: false,
      disable: true,
      type: 'ACTIVECAMPAIGN'
    },
    {
      name: 'Mindbody',
      description:
        'Mindbody Provides cloud-based online scheduling and other business management software for the wellness services industry.',
      icon: 'mindbody',
      routing: 'details',
      active: false,
      disable: true,
      type: 'MINDBODYONLINE'
    },
    {
      name: 'PatientNow',
      description:
        'PatientNow offers solutions for managing your practice, patients, & marketing. If you have ever felt overloaded while running your practice.',
      icon: 'patientNow',
      routing: 'close',
      active: false,
      disable: true,
      type: 'PatientNow'
    },
    {
      name: 'Zenoti',
      description:
        'Zenoti Offers Memberships, Packages, Offers, Promotional Coupons, Gift Cards, Feedback, Reviews. All in one Cloud Software.',
      icon: 'zenoti',
      routing: 'details',
      active: false,
      disable: true,
      type: 'ZENOTI'
    },
    {
      name: 'TouchMD',
      description:
        'TouchMD Consult simplifies patient communication, demonstrates your expertise and showcases your results to exceed expectations',
      icon: 'TouchMD',
      routing: 'details',
      active: false,
      disable: true,
      type: 'TOUCH_MD'
    },
    {
      name: 'Podium',
      description:
        'Podium lead conversion platform, powered by AI and ready to integrate with the tools you already use.',
      icon: 'Podium',
      routing: 'details',
      active: false,
      disable: true,
      type: 'PODIUM'
    }
  ];
  dataIncomingApps: any[] = [
    {
      name: 'Modmed',
      description:
        'Specialty-specific suites of products and services that seamlessly integrate with our powerful electronic health records software',
      icon: 'modmed',
      routing: 'modmed',
      active: false,
      disable: true,
      type: 'MODMED'
    },
    {
      name: 'Square',
      description:
        'Work smarter, automate for efficiency, and open up new revenue streams on the software and hardware platform.',
      icon: 'square',
      routing: 'Square',
      active: false,
      disable: true,
      type: 'Square'
    }
  ];
  stateValue = 'Data Outgoing';
  filterDataApps: any[] = [];
  constructor(
    private businessService: BusinessService,
    private router: Router,
    private toastService: ToasTMessageService
  ) {
    router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log(event.url);
        var lastPart = event.url.substr(event.url.lastIndexOf('/') + 1);
        this.isApiCartdComponant = lastPart === 'api-integration';
      });
  }

  ngOnInit(): void {
    this.dataOutgoingApps = this.dataOutgoingApps.sort(
      (first: any, second: any) => first.name.localeCompare(second.name)
    );
    this.dataIncomingApps = this.dataIncomingApps.sort(
      (first: any, second: any) => first.name.localeCompare(second.name)
    );
    this.filterDataApps = this.dataOutgoingApps;
    var lastPart = this.router.url.substr(this.router.url.lastIndexOf('/') + 1);
    this.isApiCartdComponant = lastPart === 'api-integration';
    this.getActivatedIntegration();
  }

  getActivatedIntegration() {
    this.businessService.getApiIntegrationStatus().then((data: any) => {
      data?.status?.forEach((element: any) => {
        this.dataOutgoingApps
          .filter((t) => t.type == element.type)
          .forEach((t: any) => {
            t.active = element.status;
            t.disable = false;
            t['id'] = element?.id;
          });
        this.dataIncomingApps
          .filter((t) => t.type == element.type)
          .forEach((t: any) => {
            t.active = element.status;
            t.disable = false;
            t['id'] = element?.id;
          });
      });
      if (this.stateValue == 'Data Outgoing') {
        this.filterDataApps = this.dataOutgoingApps;
      } else {
        this.filterDataApps = this.dataIncomingApps;
      }
    });
  }

  disableIntegration(id: any, disable: any, name: any) {
    let request;
    const value = disable;
    if (name === 'Modmed') {
      request = this.businessService.disableAestheticRecordsAPiPull(id, value);
    } else {
      request = this.businessService.disableAestheticRecords(id, value);
    }
    request
      .then(() => {
        if (disable) {
          this.dataOutgoingApps
            .filter((t: any) => t?.id === id)
            .forEach((t: any) => {
              t.active = false;
              t.disable = false;
            });
          this.dataIncomingApps
            .filter((t: any) => t?.id === id)
            .forEach((t: any) => {
              t.active = false;
              t.disable = false;
            });
          this.toastService.success(
            `${name} API Integration disabled successfully`
          );
        } else {
          this.toastService.success(
            `${name} API Integration enabled successfully`
          );
        }
      })
      .catch(() => {
        this.toastService.error(`Unable to save ${name} API details`);
      });
  }

  onCheckBoxChange(e: any, data: any) {
    this.disableIntegration(data.id, !e.checked, data.name);
  }

  handleChange(e: any) {
    if (e.type === 'PatientNow') {
      window.open(
        'https://support.growth99.com/portal/en/kb/articles/patientnow-integration-with-g99',
        '_blank'
      );
      return;
    }
    // if (e.type === 'Zenoti') {
    //   window.open(
    //     'https://support.growth99.com/portal/en/kb/articles/zenoti-integration-with-g99',
    //     '_blank'
    //   );
    //   return;
    // }
    if (e.type === 'Square') {
      window.open(
        'https://support.growth99.com/portal/en/kb/articles/setting-up-a-square-webhook-subscription',
        '_blank'
      );
      return;
    }
    this.isApiCartdComponant = false;

    this.router.navigate(['business/api-integration/api/' + e.routing], {
      queryParams: {
        source: e.type
      },
      queryParamsHandling: 'merge'
    });
  }

  onChangeType(value: string) {
    this.stateValue = value;
    if (value == 'Data Outgoing') {
      this.filterDataApps = this.dataOutgoingApps;
    } else {
      this.filterDataApps = this.dataIncomingApps;
    }
  }
}
