import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router,
  NavigationStart,
  NavigationEnd
} from '@angular/router';
import { PaymentService } from 'src/app/modules/appointment/services/payment.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-two-way-text-upgrade',
  templateUrl: './two-way-text-upgrade.component.html',
  styleUrls: ['./two-way-text-upgrade.component.css']
})
export class TwoWayTextUpgradeComponent implements OnChanges, OnInit {
  @Input() twoWayTextUpgradeRequest: boolean = false;
  @Output() buttonClicked: EventEmitter<any> = new EventEmitter<any>();
  isPaymentComplete: boolean = false;
  businessId: any;
  currentRoute: string;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private paymentService: PaymentService,
    private localStorageService: LocalStorageService
  ) {}

  // ngOnInit(): void {
  //   this.activatedRoute.queryParams.subscribe((data: any) => {
  //     this.businessId =
  //       data?.bid || this.localStorageService.readStorage('businessData')?.id;
  //     console.log(this.businessId);
  //   });
  // }
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.businessId =
        data?.bid || this.localStorageService.readStorage('businessInfo')?.id;
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        // Store the current route when navigation starts
        this.currentRoute = this.router.url;
      } else if (event instanceof NavigationEnd) {
        // Check if the destination route is different from the current route
        if (this.router.url !== this.currentRoute) {
          // Perform a refresh if navigating away from the component
          window.location.reload();
        } else {
          // If staying on the same route, execute the existing logic
          setTimeout(() => {
            console.log('Executing existing logic...');
            this.paymentService
              .getTwilioA2pUpgradeData(this.businessId)
              .then((res: any) => {
                res?.isPaymentComplete && this.emitButtonClicked('upgrade');
              })
              .catch((error: any) => {
                console.error('Error retrieving upgrade data:', error);
                // Handle error appropriately
              });
          }, 500);
        }
      }
    });
  }

  ngOnChanges(): void {
    setTimeout(() => {
      console.log('34');
      this.paymentService
        .getTwilioA2pUpgradeData(this.businessId)
        .then((res: any) => {
          res?.isPaymentComplete && this.emitButtonClicked('upgrade');
        });
    }, 500);
  }

  emitButtonClicked(type: string) {
    this.buttonClicked.emit({ type: type, bid: this.businessId });
  }

  upgrade(): void {
    this.router.navigate(['two-way-text', 'subscribe']);
  }

  goToDemo() {
    window.open(
      'https://support.growth99.com/portal/en/kb/articles/two-way-texting-feature-in-the-g99-application',
      '_blank'
    );
  }
}
