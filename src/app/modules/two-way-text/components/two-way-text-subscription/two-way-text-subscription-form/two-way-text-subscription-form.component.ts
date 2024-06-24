import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { PaymentService } from 'src/app/modules/appointment/services/payment.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-two-way-text-subscription-form',
  templateUrl: './two-way-text-subscription-form.component.html',
  styleUrls: ['./two-way-text-subscription-form.component.css']
})
export class TwoWayTextSubscriptionFormComponent implements OnInit {
  subscriptionForm!: FormGroup;
  @Output() buttonClickedEvent = new EventEmitter<any>();
  countries: string[] = [
    'Australia - AU',
    'India - IN',
    'United States of America - US',
    'United Kingdom - GB'
  ];
  showModal: boolean = false;
  businessTypes: any[] = [
    { name: 'Sole Proprietorship', code: 'Sole Proprietorship' },
    { name: 'Partnership', code: 'Partnership' },
    { name: 'Corporation', code: 'Corporation' },
    { name: 'Co-Operative', code: 'Co-Operative' },
    {
      name: 'Limited Liability Corporation',
      code: 'Limited Liability Corporation'
    }
  ];

  businessTitles: any[] = [
    { name: 'Owner', code: 'Owner' },
    { name: 'Practice Manager', code: 'Practice Manager' },
    { name: 'Provider', code: 'Provider' },
    { name: 'Other', code: 'Other' }
  ];

  businessRegistrationTypes: any = [
    {
      name: 'USA: Employer Identification Number (EIN)',
      code: 'USA: Employer Identification Number (EIN)'
    },
    {
      name: 'Canada: Canadian Corporation Number (CCN)',
      code: 'Canada: Canadian Corporation Number (CCN)'
    },
    {
      name: 'Canada: Canadian Business Number (CBN)',
      code: 'Canada: Canadian Business Number (CBN)'
    },
    {
      name: 'Australia: : Company Number from ASIC (ACN)',
      code: 'Australia: : Company Number from ASIC (ACN)'
    },
    {
      name: 'Great Britain: Company Number',
      code: 'Great Britain: Company Number'
    },
    {
      name: 'India: Corporate Identity Number',
      code: 'India: Corporate Identity Number'
    },
    { name: 'Others', code: 'Others' }
  ];

  regionList: any[] = [
    { name: 'Africa', code: 'Africa' },
    { name: 'Asia', code: 'Asia' },
    { name: 'Europe', code: 'Europe' },
    { name: 'Latin America', code: 'Latin America' },
    { name: 'USA and Canada', code: 'USA and Canada' },
    { name: 'Australia', code: 'Australia' }
  ];
  companyStatusList: any[] = [
    { name: 'Status1', code: 'Status1' },
    { name: 'Status2', code: 'Status2' }
  ];
  jobPositions: any[] = [
    { name: 'Director', code: 'Director' },
    { name: 'GM', code: 'GM' },
    { name: 'VP', code: 'VP' },
    { name: 'CEO', code: 'CEO' },
    { name: 'CFO', code: 'CFO' },
    { name: 'General Counsel', code: 'General Counsel' },
    { name: 'Other', code: 'Other' }
  ];
  upgradefile: any;
  isFirstLoad: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private paymentService: PaymentService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.populateIfAlreadyFilled();
  }

  createForm() {
    this.subscriptionForm = this.formBuilder.group({
      businessName: ['', [Validators.required, Validators.maxLength(100)]],
      businessType: ['', [Validators.required]],
      address1: ['', [Validators.required]],
      address2: ['', []],
      country: ['', [Validators.required, Validators.max(50)]],
      city: ['', [Validators.required, Validators.max(50)]],
      state: ['', [Validators.required, Validators.max(50)]],
      zipCode: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.numeric)]
      ],
      registrationType: ['', [Validators.required]],
      registrationNumber: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.numeric)]
      ],
      website: ['', [Validators.required, Validators.pattern(RegexEnum.url)]],
      region: ['', [Validators.required]],
      businessTitle: ['', [Validators.required]],
      contactName: [
        '',
        [Validators.required, Validators.pattern('^[a-zA-Z ]*$')]
      ],
      contactPhone: [
        '',
        [
          Validators.required,
          Validators.pattern(RegexEnum.numeric),
          Validators.maxLength(10),
          Validators.minLength(10)
        ]
      ],
      contactEmail: ['', [Validators.required, Validators.email]],
      contactRole: ['', [Validators.required]],
      usersConcent: [false, Validators.requiredTrue],
      usersConcent1: [false, Validators.requiredTrue]
    });
  }

  populateIfAlreadyFilled() {
    this.paymentService.getTwilioA2pUpgradeData().then((res: any) => {
      this.isFirstLoad = res?.id ? false : true;
      res?.address1
        ? this.subscriptionForm.patchValue({
            ...res,
            region: [res.region]
          })
        : this.autoFillForFirstTime();
    });
  }

  get f() {
    return this.subscriptionForm.controls;
  }

  onCheckboxValueChanged1(newValue: boolean): void {
    this.subscriptionForm.patchValue({
      usersConcent1: newValue
    });
  }

  onCheckboxValueChanged(newValue: boolean): void {
    this.subscriptionForm.patchValue({
      usersConcent: newValue
    });
  }

  fileChangeEvent(e: any) {
    if (!e?.target || e.target.files?.length <= 0) {
      return;
    }
    this.upgradefile = e.target.files[0];
  }

  submitEmit(type: string) {
    const mForm = new FormData();
    const body = {
      ...this.subscriptionForm.value,
      region: this.subscriptionForm.value.region.toString()
    };
    delete body.usersConcent;
    delete body.usersConcent1;
    mForm.append('file', this.upgradefile);
    mForm.append('body', JSON.stringify(body));
    console.log(mForm);
    console.log(body);
    console.log(this.upgradefile);
    if (type === 'upgrade') {
      this.paymentService
        .saveTwilioA2pUpgradeData(mForm)
        .then((response: any) => {
          response?.address1 &&
            this.buttonClickedEvent.emit({
              type: 'next'
            });
        })
        .catch((err: any) => {
          this.buttonClickedEvent.emit({
            type: 'cancel'
          });
          console.log(err);
        });
    } else if (type === 'cancel')
      this.buttonClickedEvent.emit({
        type: 'cancel'
      });
  }

  autoFillForFirstTime(): any {
    const businessInfo: any =
      this.localStorageService.readStorage('businessInfo');
    this.subscriptionForm.patchValue({
      businessName: businessInfo.name,
      businessType: 'Limited Liability Corporation',
      // address1: '',
      // address2: '',
      country: 'United States of America - US',
      // city: '',
      // state: '',
      // zipCode: '',
      registrationType: 'USA: Employer Identification Number (EIN)',
      // registrationNumber: '',
      // website: '',
      region: ['USA and Canada'],
      businessTitle: 'Owner',
      // contactName: businessInfo.notificationSMSNumber,
      contactPhone: businessInfo.notificationSMSNumber,
      contactEmail: businessInfo.notificationEmail,
      contactRole: 'Other'
    });
  }

  hideShowModal(show: any) {
    this.showModal = show === 'show' ? true : false;
  }
}
