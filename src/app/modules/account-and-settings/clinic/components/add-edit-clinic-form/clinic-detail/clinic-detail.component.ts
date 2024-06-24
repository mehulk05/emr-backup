import {
  Component,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
  AfterViewInit
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import moment from 'moment-timezone';
import { Dropdown } from 'primeng/dropdown';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { environment } from 'src/environments/environment';
import { ClinicService } from '../../../services/clinic.service';
// import { RegexEnum } from 'src/app/shared/common/constants/regex';

export function websiteListValidator(): ValidatorFn {
  console.log('In websiteListValidator');
  return (control: AbstractControl): ValidationErrors | null => {
    console.log(control.value);
    if (!control.value) {
      return null;
    }
    const websites = control.value.split(',').map((w: string) => w.trim());

    // Validate each website
    for (const website of websites) {
      if (!isValidUrl(website)) {
        return { invalidWebsite: true };
      }
    }

    return null;
  };
}

// Function to check if a given string is a valid URL
function isValidUrl(url: string): boolean {
  // Use a regular expression to validate the URL
  // const urlRegex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  const urlRegex =
    /((https?|ftp):\/\/(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9])(:?\d*)\/?([a-z_\/0-9\-#.]*)\??([a-z_\/0-9\-#=&]*)/g;

  return urlRegex.test(url);
}

@Component({
  selector: 'app-clinic-detail',
  templateUrl: './clinic-detail.component.html',
  styleUrls: ['./clinic-detail.component.css']
})
export class ClinicDetailComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() clinicData: any;
  @ViewChild('dropdown') dropdown?: Dropdown;
  @ViewChild('currency') currency?: Dropdown;
  clinicForm!: FormGroup;
  showAiModal = false;
  aiContent = '';
  clinicTimezones: any = [];
  addressOptionCountry: any = {
    ComponentRestrictions: {
      country: ['US']
    }
  };
  currencies = ['USD', 'GBP', 'CAD', 'EUR', 'JPY', 'CHF', 'ZAR', 'AUD', 'NZD'];
  openHours = moment.utc().set('hours', 9).set('minutes', 0).set('seconds', 0);
  closeHours = moment
    .utc()
    .set('hours', 17)
    .set('minutes', 0)
    .set('seconds', 0);
  defaultBusinessHour = {
    checked: true,
    // openHour: new Date(2018, 1, 11, 9),
    // closeHour: new Date(2018, 1, 11, 17),
    openHour: moment(this.openHours.format('YYYY-MM-DD HH:mm:ss')).toDate(),
    closeHour: moment(this.closeHours.format('YYYY-MM-DD HH:mm:ss')).toDate(),
    day: ''
  };

  cflage: boolean = false;
  demoflag: boolean = true;
  message = '';
  category = 'Write the summary within 2500 characters';
  totalCharacterLength = 2500;
  businessHour = {
    checked: false,
    openHour: '',
    closeHour: '',
    day: ''
  };

  businessHours: any = {
    MONDAY: this.defaultBusinessHour,
    TUESDAY: this.defaultBusinessHour,
    WEDNESDAY: this.defaultBusinessHour,
    THURSDAY: this.defaultBusinessHour,
    FRIDAY: this.defaultBusinessHour,
    SATURDAY: this.businessHour,
    SUNDAY: this.businessHour
  };

  MONDAY: boolean = false;
  TUESDAY: boolean = false;
  WEDNESDAY: boolean = false;
  THURSDAY: boolean = false;
  FRIDAY: boolean = false;
  isClinicHour: boolean = false;
  clinicId: any = null;
  loggedInUser: any = null;
  businessId: any;
  domain =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
  bookingUrlLink: any;
  constructor(
    public formBuilder: FormBuilder,
    private authenticationService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastMessageService: ToasTMessageService,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.clinicForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      contactNumber: [
        '',
        [Validators.required, Validators.pattern(/^\d{9,10}$/)]
      ],
      address: ['', [Validators.required]],
      // notificationEmail: [
      //   '',
      //   [Validators.required, Validators.pattern(RegexEnum.email)]
      // ],
      // notificationSMS: ['', [Validators.pattern(RegexEnum.mobile)]],
      timezone: ['', []],
      //allowOnlineBooking: [false, []],
      isDefault: [false, []],
      about: ['', []],
      facebook: ['', []],
      instagram: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      twitter: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      tiktok: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      giftCardDetail: ['', []],
      giftCardUrl: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      website: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      secondaryUrls: ['', [websiteListValidator()]],
      paymentLink: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      appointmentUrl: ['', [Validators.pattern(RegexEnum.httpUrl)]],
      // countryCode: ['1', [Validators.required]],
      currency: ['usd', [Validators.required]],
      googleMyBusiness: ['', []],
      googlePlaceId: ['', []],
      yelpUrl: ['', []]
    });

    this.clinicId = this.activatedRoute.snapshot.params.clinicId;
    this.authenticationService.currentUserSubject.subscribe((data) => {
      this.loggedInUser = data;
      this.businessId = this.loggedInUser.businessId;
      this.bookingUrlLink =
        environment.BOOKING_DOMAIN_URL +
        '/ap-booking?b=' +
        this.businessId +
        '&c=' +
        this.clinicId;
    });
    // this.activatedRoute.queryParams.subscribe(() => {
    //   if (this.clinicId) {
    //     this.loadClinicDetail();
    //   }
    // });
    this.loadClinicDetail();

    this.getClinicTimezones();
  }

  // loadClinicDetail() {
  //   this.clinicService
  //     .getSingleClinic(this.clinicId)
  //     .then((response) => {
  //       this.clinicData = response;
  //       this.updateClinicForm();
  //     })
  //     .catch(() => {
  //       this.toastMessageService.error('Unable to load clinic.');
  //     });
  // }

  loadClinicDetail() {
    if (this.clinicId) {
      // Check if clinicId is available (for editing existing clinic)
      this.clinicService
        .getSingleClinic(this.clinicId)
        .then((response) => {
          this.clinicData = response;
          this.updateClinicForm();
        })
        .catch(() => {
          console.error('Unable to load clinic.'); // Log the error for debugging
          // Optionally, you can handle the error silently without displaying an error message to the user
        });
    }
  }

  ngOnChanges(): void {
    if (this.clinicId) {
      this.updateClinicForm();
    }
    /* ----- Dropdown filter logic for single string array such as currency ----- */
    // if (this.dropdown) {
    //   (this.dropdown.filterBy as any) = {
    //     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //     split: (_: any) => [(item: any) => item]
    //   };
    // }
  }

  ngAfterViewInit(): void {
    if (this.dropdown) {
      (this.dropdown.filterBy as any) = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        split: (_: any) => [(item: any) => item]
      };
    }

    if (this.currency) {
      (this.currency.filterBy as any) = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        split: (_: any) => [(item: any) => item]
      };
    }
  }
  updateClinicForm() {
    this.cflage = true;
    this.demoflag = false;

    this.clinicForm.patchValue({
      name: this.clinicData.name,
      contactNumber: this.clinicData.contactNumber,
      address: this.clinicData.address,
      notificationEmail: this.clinicData.notificationEmail,
      notificationSMS: this.clinicData.notificationSMS,
      // allowOnlineBooking: (this.clinicData.allowOnlineBooking == null) ?
      //     false : this.clinicData.allowOnlineBooking,
      about: this.clinicData.about,
      facebook: this.clinicData.facebook,
      instagram: this.clinicData.instagram,
      twitter: this.clinicData.twitter,
      tiktok: this.clinicData.tiktok,
      giftCardDetail: this.clinicData.giftCardDetail,
      giftCardUrl: this.clinicData.giftCardUrl,
      website: this.clinicData.website,
      timezone: this.clinicData.timezone,
      isDefault: this.clinicData.isDefault,
      googleMyBusiness: this.clinicData.googleMyBusiness,
      paymentLink: this.clinicData.paymentLink,
      appointmentUrl: this.clinicData.appointmentUrl,
      countryCode: this.clinicData.countryCode,
      currency: this.clinicData?.currency?.toUpperCase(),
      googlePlaceId: this.clinicData?.googlePlaceId,
      yelpUrl: this.clinicData?.yelpUrl,
      secondaryUrls: this.clinicData?.secondaryUrls
    });

    if (
      this.clinicData?.businessHours &&
      this.clinicData.businessHours.length > 0
    ) {
      this.isClinicHour = true;
      this.clinicData.businessHours.map((businessHour: any) => {
        if (businessHour.dayOfWeek != null) {
          if (businessHour.dayOfWeek == 'MONDAY') {
            this.MONDAY = true;
          } else if (businessHour.dayOfWeek == 'TUESDAY') {
            this.TUESDAY = true;
          } else if (businessHour.dayOfWeek == 'WEDNESDAY') {
            this.WEDNESDAY = true;
          } else if (businessHour.dayOfWeek == 'THURSDAY') {
            this.THURSDAY = true;
          } else if (businessHour.dayOfWeek == 'FRIDAY') {
            this.FRIDAY = true;
          }
          businessHour.checked = true;

          /* -------------------------------------------------------------------------- */
          /*          Below code will show IST time irrespective of local time          */
          /* -------------------------------------------------------------------------- */
          // businessHour.openHour = moment(
          //   moment(businessHour.openHour)
          //     .tz('Asia/Kolkata')
          //     .format('YYYY-MM-DD HH:mm:ss')
          // ).toDate();

          /* -------------------------------------------------------------------------- */
          /*    BELOW CODE WILL SHOW UTC TIME IN CALENDAR IRRESPRCTIVE OF LOCAL TIME    */
          /* -------------------------------------------------------------------------- */
          // businessHour.openHour = moment(businessHour.openHour).utc().toDate();
          //businessHour.openHour = moment(moment(businessHour.openHour).utc().format( "YYYY-MM-DD HH:mm:ss" )).toDate();
          /* -------------------------------------------------------------------------- */
          /*          BELOW CODE WILL SHOW LOCAL TIME AS PER LOCAL SYSTEM TIME          */
          /* -------------------------------------------------------------------------- */
          // businessHour.openHour = moment( moment(businessHour.openHour).utc().format( "YYYY-MM-DD HH:mm:ss" )).toDate()
          // businessHour.openHour = moment(businessHour.openHour).utc().toDate();
          businessHour.openHour = moment(
            moment(businessHour.openHour).utc().format('YYYY-MM-DD HH:mm:ss')
          ).toDate();
          businessHour.closeHour = moment(
            moment(businessHour.closeHour).utc().format('YYYY-MM-DD HH:mm:ss')
          ).toDate();
          // businessHour.closeHour = new Date(businessHour.closeHour);
          this.businessHours[businessHour.dayOfWeek] = businessHour;
        }
      });
    }

    if (this.isClinicHour) {
      if (!this.MONDAY) {
        this.businessHours['MONDAY'] = this.businessHour;
      }
      if (!this.TUESDAY) {
        this.businessHours['TUESDAY'] = this.businessHour;
      }
      if (!this.WEDNESDAY) {
        this.businessHours['WEDNESDAY'] = this.businessHour;
      }
      if (!this.THURSDAY) {
        this.businessHours['THURSDAY'] = this.businessHour;
        this.THURSDAY = true;
      }
      if (!this.FRIDAY) {
        this.businessHours['FRIDAY'] = this.businessHour;
      }
    }
  }

  getClinicTimezones() {
    this.clinicService.getClinicTimeZones().then(
      (data: any) => {
        this.clinicTimezones = data;
      },
      () => {
        this.toastMessageService.error('Unable to load timezones.');
      }
    );
  }

  get f() {
    return this.clinicForm.controls;
  }

  public handleAddressChange(address: any) {
    this.clinicForm.patchValue({ address: address.formatted_address });
  }

  onBusinessHoursChange = (value: any) => {
    const key: any = value.day;
    if (undefined != key) {
      this.businessHours[key] = value;
    }
  };

  submitForm() {
    const businessHoursArray = [];
    const hours = this.businessHours;
    for (const [key, val] of Object.entries(hours)) {
      const value: any = val;
      if (value != null && value.checked) {
        if (value.appointmentOnly) {
          businessHoursArray.push({
            dayOfWeek: key,
            appointmentOnly: value.appointmentOnly
          });
        } else {
          if (!(!Date.parse(value.openHour) && !Date.parse(value.closeHour))) {
            businessHoursArray.push({
              dayOfWeek: key,
              // openHour: value.openHour.toString(),
              openHour: moment(value.openHour).utcOffset(0, true).format(),
              closeHour: moment(value.closeHour).utcOffset(0, true).format()
            });
          }
        }
      }
    }
    const formData = this.clinicForm.value;
    formData.businessHours = businessHoursArray;
    formData.clinicUrl = this.bookingUrlLink;
    formData.contactNumber = formData.contactNumber.replace(/\D/g, '');

    if (this.clinicId) {
      this.updateClinicDetails(formData);
    } else {
      this.createClinic(formData);
    }
  }

  updateClinicDetails(formData: any) {
    this.clinicService.updateClinic(this.clinicId, formData).then(
      (response: any) => {
        if (response.isReviewPublished) {
          this.toastMessageService.success(
            'Clinic updated successfully And queue get published.'
          );
        } else {
          this.toastMessageService.success('Clinic updated successfully.');
        }
        this.setDefaultClinic();
      },
      () => {
        this.toastMessageService.error('Unable to save clinic.');
      }
    );
  }

  createClinic(formData: any) {
    this.clinicService.createClinic(formData).then(
      () => {
        this.toastMessageService.success('Clinic saved successfully.');
        this.setDefaultClinic();
        this.router.navigate(['/clinics']);
      },
      () => {
        this.toastMessageService.error('Unable to save clinic.');
      }
    );
  }
  onCancelForm() {
    this.router.navigate(['clinics']);
  }

  setDefaultClinic() {
    this.clinicService.getDefaultCinic().then(
      () => {
        // this.toastMessageService.success('Clinic saved successfully.');
        this.router.navigate(['/clinics']);
      },
      () => {
        this.toastMessageService.error('Unable to save clinic.');
      }
    );
  }
  //country code list
  countryList = [
    { name: 'Select', countryCode: '' },
    { name: 'United States', countryCode: '1' },
    { name: 'Afghanistan', countryCode: '93' },
    { name: 'Albania', countryCode: '355' },
    { name: 'Algeria', countryCode: '213' },
    { name: 'American Samoa', countryCode: '1-684' },
    { name: 'Andorra', countryCode: '376' },
    { name: 'Angola', countryCode: '244' },
    { name: 'Anguilla', countryCode: '1-264' },
    { name: 'Antarctica', countryCode: '672' },
    { name: 'Antigua and Barbuda', countryCode: '1-268' },
    { name: 'Argentina', countryCode: '54' },
    { name: 'Armenia', countryCode: '374' },
    { name: 'Aruba', countryCode: '297' },
    { name: 'Australia', countryCode: '61' },
    { name: 'Austria', countryCode: '43' },
    { name: 'Azerbaijan', countryCode: '994' },
    { name: 'Bahamas', countryCode: '1-242' },
    { name: 'Bahrain', countryCode: '973' },
    { name: 'Bangladesh', countryCode: '880' },
    { name: 'Barbados', countryCode: '1-246' },
    { name: 'Belarus', countryCode: '375' },
    { name: 'Belgium', countryCode: '32' },
    { name: 'Belize', countryCode: '501' },
    { name: 'Benin', countryCode: '229' },
    { name: 'Bermuda', countryCode: '1-441' },
    { name: 'Bhutan', countryCode: '975' },
    { name: 'Bolivia', countryCode: '591' },
    { name: 'Bosnia and Herzegovina', countryCode: '387' },
    { name: 'Botswana', countryCode: '267' },
    { name: 'Brazil', countryCode: '55' },
    { name: 'British Indian Ocean Territory', countryCode: '246' },
    { name: 'British Virgin Islands', countryCode: '1-284' },
    { name: 'Brunei', countryCode: '673' },
    { name: 'Bulgaria', countryCode: '359' },
    { name: 'Burkina Faso', countryCode: '226' },
    { name: 'Burundi', countryCode: '257' },
    { name: 'Cambodia', countryCode: '855' },
    { name: 'Cameroon', countryCode: '237' },
    { name: 'Canada', countryCode: '1' },
    { name: 'Cape Verde', countryCode: '238' },
    { name: 'Cayman Islands', countryCode: '1-345' },
    { name: 'Central African Republic', countryCode: '236' },
    { name: 'Chad', countryCode: '235' },
    { name: 'Chile', countryCode: '56' },
    { name: 'China', countryCode: '86' },
    { name: 'Christmas Island', countryCode: '61' },
    { name: 'Cocos Islands', countryCode: '61' },
    { name: 'Colombia', countryCode: '57' },
    { name: 'Comoros', countryCode: '269' },
    { name: 'Cook Islands', countryCode: '682' },
    { name: 'Costa Rica', countryCode: '506' },
    { name: 'Croatia', countryCode: '385' },
    { name: 'Cuba', countryCode: '53' },
    { name: 'Curacao', countryCode: '599' },
    { name: 'Cyprus', countryCode: '357' },
    { name: 'Czech Republic', countryCode: '420' },
    { name: 'Democratic Republic of the Congo', countryCode: '243' },
    { name: 'Denmark', countryCode: '45' },
    { name: 'Djibouti', countryCode: '253' },
    { name: 'Dominica', countryCode: '1-767' },
    { name: 'Dominican Republic', countryCode: '1-809' },
    { name: 'Dominican Republic', countryCode: '1-829' },
    { name: 'Dominican Republic', countryCode: '1-849' },
    { name: 'East Timor', countryCode: '670' },
    { name: 'Ecuador', countryCode: '593' },
    { name: 'Egypt', countryCode: '20' },
    { name: 'El Salvador', countryCode: '503' },
    { name: 'Equatorial Guinea', countryCode: '240' },
    { name: 'Eritrea', countryCode: '291' },
    { name: 'Estonia', countryCode: '372' },
    { name: 'Ethiopia', countryCode: '251' },
    { name: 'Falkland Islands', countryCode: '500' },
    { name: 'Faroe Islands', countryCode: '298' },
    { name: 'Fiji', countryCode: '679' },
    { name: 'Finland', countryCode: '358' },
    { name: 'France', countryCode: '33' },
    { name: 'French Polynesia', countryCode: '689' },
    { name: 'Gabon', countryCode: '241' },
    { name: 'Gambia', countryCode: '220' },
    { name: 'Georgia', countryCode: '995' },
    { name: 'Germany', countryCode: '49' },
    { name: 'Ghana', countryCode: '233' },
    { name: 'Gibraltar', countryCode: '350' },
    { name: 'Greece', countryCode: '30' },
    { name: 'Greenland', countryCode: '299' },
    { name: 'Grenada', countryCode: '1-473' },
    { name: 'Guam', countryCode: '1-671' },
    { name: 'Guatemala', countryCode: '502' },
    { name: 'Guernsey', countryCode: '44-1481' },
    { name: 'Guinea', countryCode: '224' },
    { name: 'Guinea-Bissau', countryCode: '245' },
    { name: 'Guyana', countryCode: '592' },
    { name: 'Haiti', countryCode: '509' },
    { name: 'Honduras', countryCode: '504' },
    { name: 'Hong Kong', countryCode: '852' },
    { name: 'Hungary', countryCode: '36' },
    { name: 'Iceland', countryCode: '354' },
    { name: 'India', countryCode: '91' },
    { name: 'Indonesia', countryCode: '62' },
    { name: 'Iran', countryCode: '98' },
    { name: 'Iraq', countryCode: '964' },
    { name: 'Ireland', countryCode: '353' },
    { name: 'Isle of Man', countryCode: '44-1624' },
    { name: 'Israel', countryCode: '972' },
    { name: 'Italy', countryCode: '39' },
    { name: 'Ivory Coast', countryCode: '225' },
    { name: 'Jamaica', countryCode: '1-876' },
    { name: 'Japan', countryCode: '81' },
    { name: 'Jersey', countryCode: '44-1534' },
    { name: 'Jordan', countryCode: '962' },
    { name: 'Kazakhstan', countryCode: '7' },
    { name: 'Kenya', countryCode: '254' },
    { name: 'Kiribati', countryCode: '686' },
    { name: 'Kosovo', countryCode: '383' },
    { name: 'Kuwait', countryCode: '965' },
    { name: 'Kyrgyzstan', countryCode: '996' },
    { name: 'Laos', countryCode: '856' },
    { name: 'Latvia', countryCode: '371' },
    { name: 'Lebanon', countryCode: '961' },
    { name: 'Lesotho', countryCode: '266' },
    { name: 'Liberia', countryCode: '231' },
    { name: 'Libya', countryCode: '218' },
    { name: 'Liechtenstein', countryCode: '423' },
    { name: 'Lithuania', countryCode: '370' },
    { name: 'Luxembourg', countryCode: '352' },
    { name: 'Macau', countryCode: '853' },
    { name: 'Macedonia', countryCode: '389' },
    { name: 'Madagascar', countryCode: '261' },
    { name: 'Malawi', countryCode: '265' },
    { name: 'Malaysia', countryCode: '60' },
    { name: 'Maldives', countryCode: '960' },
    { name: 'Mali', countryCode: '223' },
    { name: 'Malta', countryCode: '356' },
    { name: 'Marshall Islands', countryCode: '692' },
    { name: 'Mauritania', countryCode: '222' },
    { name: 'Mauritius', countryCode: '230' },
    { name: 'Mayotte', countryCode: '262' },
    { name: 'Mexico', countryCode: '52' },
    { name: 'Micronesia', countryCode: '691' },
    { name: 'Moldova', countryCode: '373' },
    { name: 'Monaco', countryCode: '377' },
    { name: 'Mongolia', countryCode: '976' },
    { name: 'Montenegro', countryCode: '382' },
    { name: 'Montserrat', countryCode: '1-664' },
    { name: 'Morocco', countryCode: '212' },
    { name: 'Mozambique', countryCode: '258' },
    { name: 'Myanmar', countryCode: '95' },
    { name: 'Namibia', countryCode: '264' },
    { name: 'Nauru', countryCode: '674' },
    { name: 'Nepal', countryCode: '977' },
    { name: 'Netherlands', countryCode: '31' },
    { name: 'Netherlands Antilles', countryCode: '599' },
    { name: 'New Caledonia', countryCode: '687' },
    { name: 'New Zealand', countryCode: '64' },
    { name: 'Nicaragua', countryCode: '505' },
    { name: 'Niger', countryCode: '227' },
    { name: 'Nigeria', countryCode: '234' },
    { name: 'Niue', countryCode: '683' },
    { name: 'North Korea', countryCode: '850' },
    { name: 'Northern Mariana Islands', countryCode: '1-670' },
    { name: 'Norway', countryCode: '47' },
    { name: 'Oman', countryCode: '968' },
    { name: 'Pakistan', countryCode: '92' },
    { name: 'Palau', countryCode: '680' },
    { name: 'Palestine', countryCode: '970' },
    { name: 'Panama', countryCode: '507' },
    { name: 'Papua New Guinea', countryCode: '675' },
    { name: 'Paraguay', countryCode: '595' },
    { name: 'Peru', countryCode: '51' },
    { name: 'Philippines', countryCode: '63' },
    { name: 'Pitcairn', countryCode: '64' },
    { name: 'Poland', countryCode: '48' },
    { name: 'Portugal', countryCode: '351' },
    { name: 'Puerto Rico', countryCode: '1-787' },
    { name: 'Puerto Rico', countryCode: '1-939' },
    { name: 'Qatar', countryCode: '974' },
    { name: 'Republic of the Congo', countryCode: '242' },
    { name: 'Reunion', countryCode: '262' },
    { name: 'Romania', countryCode: '40' },
    { name: 'Russia', countryCode: '7' },
    { name: 'Rwanda', countryCode: '250' },
    { name: 'Saint Barthelemy', countryCode: '590' },
    { name: 'Saint Helena', countryCode: '290' },
    { name: 'Saint Kitts and Nevis', countryCode: '1-869' },
    { name: 'Saint Lucia', countryCode: '1-758' },
    { name: 'Saint Martin', countryCode: '590' },
    { name: 'Saint Pierre and Miquelon', countryCode: '508' },
    { name: 'Saint Vincent and the Grenadines', countryCode: '1-784' },
    { name: 'Samoa', countryCode: '685' },
    { name: 'San Marino', countryCode: '378' },
    { name: 'Sao Tome and Principe', countryCode: '239' },
    { name: 'Saudi Arabia', countryCode: '966' },
    { name: 'Senegal', countryCode: '221' },
    { name: 'Serbia', countryCode: '381' },
    { name: 'Seychelles', countryCode: '248' },
    { name: 'Sierra Leone', countryCode: '232' },
    { name: 'Singapore', countryCode: '65' },
    { name: 'Sint Maarten', countryCode: '1-721' },
    { name: 'Slovakia', countryCode: '421' },
    { name: 'Slovenia', countryCode: '386' },
    { name: 'Solomon Islands', countryCode: '677' },
    { name: 'Somalia', countryCode: '252' },
    { name: 'South Africa', countryCode: '27' },
    { name: 'South Korea', countryCode: '82' },
    { name: 'South Sudan', countryCode: '211' },
    { name: 'Spain', countryCode: '34' },
    { name: 'Sri Lanka', countryCode: '94' },
    { name: 'Sudan', countryCode: '249' },
    { name: 'Suriname', countryCode: '597' },
    { name: 'Svalbard and Jan Mayen', countryCode: '47' },
    { name: 'Swaziland', countryCode: '268' },
    { name: 'Sweden', countryCode: '46' },
    { name: 'Switzerland', countryCode: '41' },
    { name: 'Syria', countryCode: '963' },
    { name: 'Taiwan', countryCode: '886' },
    { name: 'Tajikistan', countryCode: '992' },
    { name: 'Tanzania', countryCode: '255' },
    { name: 'Thailand', countryCode: '66' },
    { name: 'Togo', countryCode: '228' },
    { name: 'Tokelau', countryCode: '+690' },
    { name: 'Tonga', countryCode: '676' },
    { name: 'Trinidad and Tobago', countryCode: '1-868' },
    { name: 'Tunisia', countryCode: '216' },
    { name: 'Turkey', countryCode: '90' },
    { name: 'Turkmenistan', countryCode: '993' },
    { name: 'Turks and Caicos Islands', countryCode: '1-649' },
    { name: 'Tuvalu', countryCode: '688' },
    { name: 'U.S. Virgin Islands', countryCode: '1-340' },
    { name: 'Uganda', countryCode: '256' },
    { name: 'Ukraine', countryCode: '380' },
    { name: 'United Arab Emirates', countryCode: '971' },
    { name: 'United Kingdom', countryCode: '44' },
    { name: 'United States', countryCode: '1' },
    { name: 'Uruguay', countryCode: '598' },
    { name: 'Uzbekistan', countryCode: '998' },
    { name: 'Vanuatu', countryCode: '678' },
    { name: 'Vatican', countryCode: '379' },
    { name: 'Venezuela', countryCode: '58' },
    { name: 'Vietnam', countryCode: '84' },
    { name: 'Wallis and Futuna', countryCode: '681' },
    { name: 'Western Sahara', countryCode: '212' },
    { name: 'Yemen', countryCode: '967' },
    { name: 'Zambia', countryCode: '260' },
    { name: 'Zimbabwe', countryCode: '263' }
  ];

  demo() {
    this.cflage = false;
    this.demoflag = true;
  }
  changeWebsite(country_iso3: any) {
    this.cflage = true;
    this.demoflag = false;
    this.clinicForm.patchValue({ countryCode: country_iso3.target.value });
  }

  aiModelClose(event: any) {
    if (event?.replace) {
      this.clinicForm.patchValue({
        about: event.replaceData
      });
    }
    this.showAiModal = false;
  }
}
