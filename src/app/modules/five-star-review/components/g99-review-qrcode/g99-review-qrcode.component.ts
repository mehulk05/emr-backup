import { Component, Input, OnInit } from '@angular/core';
import { FiveStarViewService } from '../../services/five-star-view.service';

import { environment } from 'src/environments/environment';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { QRCodeElementType, QRCodeErrorCorrectionLevel } from 'angularx-qrcode';

@Component({
  selector: 'app-g99-review-qrcode',
  templateUrl: './g99-review-qrcode.component.html',
  styleUrls: ['./g99-review-qrcode.component.css']
})
export class G99ReviewQrCodeComponent implements OnInit {
  @Input() clinicData: any;
  @Input() clinicId: any;
  name = 'Angular QR';
  elementType: QRCodeElementType = "img";
  correctionLevel:QRCodeErrorCorrectionLevel = "M";
  clinicReviewData: any;
  g99ReviewLandingPage: any;
  businessData: any;
  logoUrl: any;
  agencyLogoUrl: any;

  constructor(
    private clinicService: FiveStarViewService,
    private toastMessageService: ToasTMessageService,
    private localStorageService: LocalStorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadClinicReviewDetail();
    this.loadBusinessData();
  }

  loadClinicReviewDetail() {
    this.clinicService
      .getClinicReview(this.clinicId)
      .then((response: any) => {
        this.clinicReviewData = response;
        console.log(this.clinicReviewData);
        this.g99ReviewLandingPage =
          environment.G99_REVIEW_DOMAIN +
          'clinicReviews/?id=' +
          this.clinicReviewData.encryptedClinicId;
      })
      .catch(() => {
        this.toastMessageService.error('Unable to load clinic Review.');
      });
  }

  goToLink(): void {
    window.open(this.g99ReviewLandingPage, '_blank');
  }

  downloadImage(): void {
    const canvas = document.querySelector(
      "img[alt='Review QR Code']"
    ) as HTMLCanvasElement;
    const imageData = canvas.getAttributeNode('src').value;
    const a = document.createElement('a');
    a.href = imageData;
    a.download = 'qrCode.jpeg';
    a.click();
  }

  printQoCode() {
    const printContents = document.getElementById('print-section').innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    window.location.reload();
  }

  loadBusinessData() {
    const bdData: any = this.localStorageService.readStorage('businessInfo');
    console.log(bdData);
    this.businessData = bdData;
    if (this.businessData?.logoUrl) {
      this.logoUrl =
        this.businessData?.logoUrl ??
        'https://g99plus.b-cdn.net/AEMR/assets/img/growth99_icon.png';
      this.agencyLogoUrl =
        this.businessData?.agency?.logoUrl ??
        'https://g99plus.b-cdn.net/AA%20new%20g99%20app/images/g99%20full%20logo.svg';
    } else {
      this.authService.currentBusinessSubject.subscribe((data: any) => {
        if (data && Object.keys(data).length > 0) {
          this.businessData = data;
          this.logoUrl =
            this.businessData?.logoUrl ??
            'https://g99plus.b-cdn.net/AEMR/assets/img/growth99_icon.png';
        } else {
          this.businessData = bdData;
          this.logoUrl =
            this.businessData?.logoUrl ??
            'https://g99plus.b-cdn.net/AEMR/assets/img/growth99_icon.png';
        }
        this.agencyLogoUrl =
          this.businessData?.agency?.logoUrl ??
          'https://g99plus.b-cdn.net/AA%20new%20g99%20app/images/g99%20full%20logo.svg';
      });
    }
  }
}
