import { Component, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { BusinessService } from '../../services/business.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-api-details',
  templateUrl: './api-details.component.html',
  styleUrls: ['./api-details.component.css']
})
export class ApiDetailsComponent implements OnInit {
  authKey: any;
  refreshKey: any;
  baseUlr = environment.SERVER_API_URL;
  businessId = 0;
  encrptBusinessId = '';
  businessData: any;
  agencyName: any;
  curlAuth =
    "curl --location '" +
    this.baseUlr +
    "/api/auth'  --header 'Content-Type: application/json' --data-raw '{ 'refreshToken': 'refresh token' }'";
  curlFormPost =
    "curl --location ''" +
    this.baseUlr +
    "/api/manual/leadsubmission'  --header 'Content-Type: application/json' --header 'Authorization: bearer ID_TOKEN_HERE'  --header 'x-tenantid: " +
    window.btoa(this.businessId.toString()).toString() +
    "' --data-raw '{ 'firstName': 'firstname', 'lastName':'lastname', 'email':'email', 'phoneNumber':'phoneNumber' }'";
  loginResponse = JSON.stringify({
    tokenType: 'Bearer',
    accessToken: 'eyJraWQiO',
    expiresIn: 43200,
    idToken: 'eyJraWQiO',
    refreshToken: 'eyJjdHkiOiJ',
    id: 22014,
    firstName: 'first name',
    lastName: 'last name',
    profileImageUrl: 'https://dev-emr-asset.s3.amazonaws.com/profile22014',
    businessId: window.btoa('1418').toString(),
    roles: 'Admin',
    agencyId: '1',
    defaultAgency: true
  });

  formListRes = JSON.stringify([
    {
      createdAt: '2022-09-02T07:30:48.707+0000',
      updatedBy: 'Kasturi',
      noOfQuestions: 5,
      isContactForm: null,
      createdBy: 'Kasturi',
      name: 'name',
      id: 7926,
      isG99ReviewForm: false,
      updatedAt: '2022-10-05T10:44:55.647+0000'
    }
  ]);

  appointmentListRes = JSON.stringify({
    appointmentDTOList: [
      {
        id: 7797,
        patientId: 23403,
        patientFirstName: 'rosmi',
        patientLastName: 'mishal',
        patientPhone: '9999999999',
        patientEmail: 'rosmi@yopmail.com',
        patientNotes: null,
        clinicId: 1721,
        clinicName: 'gjd',
        timeZone: 'US/Pacific',
        serviceList: [
          {
            serviceId: 4956,
            serviceName: 'Tummy Tuck',
            description: null,
            serviceCost: 50,
            categoryId: 2833,
            durationInMinutes: null,
            imageUrl: null,
            categoryName: 'Skin Care & Rejuvenation',
            id: null,
            name: null,
            isPreBookingCostAllowed: null,
            priceVaries: null,
            showDepositCost: null,
            depositCost: null,
            preBookingCostAllowed: null
          }
        ],
        providerId: 22029,
        providerName: 'Rimsha pp',
        paymentStatus: 'Unpaid',
        appointmentStatus: 'Pending',
        appointmentType: 'InPerson',
        appointmentStartDate: '2022-11-02T14:00:00.000+0000',
        appointmentEndDate: '2022-11-02T15:00:00.000+0000',
        appointmentCreatedDate: '2022-11-02T10:54:36.996+0000',
        appointmentUpdatedDate: '2022-11-02T10:54:37.164+0000',
        notes: '',
        source: 'Public',
        paymentSource: null,
        notesLabel: 'please add your address',
        notesRequiredOptional: false,
        documentSigned: false,
        documentPresent: true,
        appointmentRead: false,
        defaultClinic: false
      }
    ]
  });
  constructor(
    private alertService: ToasTMessageService,
    private businessService: BusinessService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.generateAuthKey();
  }

  generateAuthKey() {
    const userData = this.localStorageService.readStorage('currentUser');
    const bdData: any = this.localStorageService.readStorage('businessInfo');
    this.businessData = bdData;

    this.authKey = userData?.idToken;
    this.refreshKey = userData?.refreshToken;
    this.businessId = userData.businessId;
    this.encrptBusinessId = window.btoa(this.businessId.toString()).toString();
    this.curlFormPost =
      "curl --location ''" +
      this.baseUlr +
      "/api/manual/leadsubmission'  --header 'Content-Type: application/json' --header 'Authorization: bearer ID_TOKEN_HERE'  --header 'x-tenantid: " +
      this.encrptBusinessId +
      "' --data-raw '{ 'firstName': 'firstname', 'lastName':'lastname', 'email':'email', 'phoneNumber':'phoneNumber' }'";
    if (this.businessData) {
      this.agencyName = this.businessData?.agency?.name ?? 'Growth99';
    }
  }

  copyApiKey() {
    try {
      const selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value = this.authKey;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
      this.alertService.success('Copied!');
    } catch (e) {}
  }

  copyRefreshKey() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.refreshKey;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alertService.success('Copied!');
  }

  moreApiDetails() {
    window.open(
      'https://support.growth99.com/portal/en/kb/articles/how-to-get-g99-api-details-and-how-to-use-it'
    );
  }
}
