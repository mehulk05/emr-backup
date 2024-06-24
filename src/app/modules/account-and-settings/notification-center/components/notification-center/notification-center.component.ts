import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../../business/services/business.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-notification-center',
  templateUrl: './notification-center.component.html',
  styleUrls: ['./notification-center.component.css']
})
export class NotificationCenterComponent implements OnInit, OnChanges {
  @Input() businessInfo: any;
  notificationForm!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private businessService: BusinessService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.notificationForm = this.formBuilder.group({
      notificationEmail: ['', [Validators.pattern(RegexEnum.email)]],
      notificationSMSNumber: ['', [Validators.pattern(/^\d{9,10}$/)]],
      countryCode: ['1', []]
    });

    this.notificationForm.controls[
      'notificationSMSNumber'
    ].valueChanges.subscribe(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (value) => {
        if (value) {
          this.notificationForm.controls['countryCode'].addValidators(
            Validators.required
          );
        } else {
          this.notificationForm.controls['countryCode'].clearValidators();
        }
        this.notificationForm.controls['countryCode'].updateValueAndValidity();
      }
    );
  }

  ngOnChanges(): void {
    if (this.businessInfo) {
      this.notificationForm.patchValue({
        notificationSMSNumber: this.businessInfo?.notificationSMSNumber,
        countryCode: this.businessInfo?.countryCode,
        notificationEmail: this.businessInfo?.notificationEmail
      });
    }
  }

  get f() {
    return this.notificationForm.controls;
  }

  submitForm() {
    if (this.notificationForm.invalid) {
      return;
    }
    const formData = this.notificationForm.value;
    this.businessService
      .updateBusinessNotification(this.businessInfo.id, formData)
      .then(
        (data) => {
          if (data) {
            this.localStorageService.storeItem('businessInfo', data);
            this.businessInfo = data;
          }
          this.toastService.success('Information updated successfully.');
        },
        () => {
          this.toastService.error('Unable to update  information.');
        }
      );
  }

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
}
