import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { BusinessService } from '../../../modules/account-and-settings/business/services/business.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy-packs',
  templateUrl: './buy-packs.component.html',
  styleUrls: ['./buy-packs.component.css']
})
export class BuyPacksComponent implements OnInit {
  businessData: any;
  agencyLogoUrl =
    'https://g99plus.b-cdn.net/AA%20new%20g99%20app/images/g99%20full%20logo.svg';
  buypacksData: any;
  showStripeComponent: boolean = false;
  selectedPack: any;
  rowBgColor: String = '#F8F8FF';
  showButton: Boolean;
  customOptions: OwlOptions = {
    freeDrag: false,
    mouseDrag: true,
    loop: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    center: true,
    autoWidth: false,
    navSpeed: 700,
    nav: true,
    navText: [
      "<i class='fa fa-chevron-left'></i>",
      "<i class='fa fa-chevron-right'></i>"
    ],
    responsive: {
      0: {
        items: 1
      },

      600: {
        items: 3
      }
    }
  };
  constructor(
    private businessService: BusinessService,
    private toastService: ToasTMessageService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getBuyPacksAPIcall();
    const bdData: any = this.localStorageService.readStorage('businessInfo');
    this.businessData = bdData;
    if (this.businessData) {
      this.agencyLogoUrl =
        this.businessData?.agency?.logoUrl ??
        'https://g99plus.b-cdn.net/AA%20new%20g99%20app/images/g99%20full%20logo.svg';
    }
  }

  callFunc(id: Number) {
    alert(id);
  }

  getBuyPacksAPIcall() {
    this.businessService
      .getBuyPacks()
      .then((data: any) => {
        const comboPackages = data.comboPackages;
        const smsPackages = data.smsPackages;
        const emailPackages = data.emailPackages;
        this.buypacksData = [smsPackages, comboPackages, emailPackages];
        console.log('Data populated...');
      })
      .catch((e) => {
        console.log(e.message);
      });
  }

  callOnBuy(pack: any) {
    console.log(pack);
    pack.amountToPaid = pack.cost;
    this.selectedPack = pack;
    this.selectedPack.tenantId =
      this.localStorageService.readStorage('businessInfo')?.id;
    this.showStripeComponent = true;
  }

  cancelStripeModal() {
    this.showStripeComponent = false;
  }

  onPaymentSuccess() {
    this.showStripeComponent = false;
    this.toastService.success('Payment completed successfully.');
    setTimeout(() => {
      this.router.navigate(['billing/sms-email-billing']);
    }, 5000); //5s
  }

  onPaymentCancel() {
    this.showStripeComponent = false;
    // this.router.navigate(['business']);
  }
}
