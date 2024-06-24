import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-feedback-request',
  templateUrl: './feedback-request.component.html',
  styleUrls: ['./feedback-request.component.css']
})
export class FeedbackRequestComponent implements OnInit {
  agenciesLinks = {
    [Agency.Growth99]: 'https://practicebuddy.rapidr.io/contribute/growth-99/',
    [Agency.SmileVirtual]:
      'https://practicebuddy.rapidr.io/contribute/smile-virtual/',
    [Agency.AestheticVirtual]:
      'https://practicebuddy.rapidr.io/contribute/aesthetic-virtual/'
  };
  agencyInfo: any;

  constructor(private localStroageService: LocalStorageService) {}

  ngOnInit(): void {
    this.agencyInfo =
      this.localStroageService.readStorage('businessData')?.agency;
  }
}

const Agency = {
  Growth99: 'Growth99+',
  SmileVirtual: 'Smile Virtual+',
  AestheticVirtual: 'Aesthetic Virtual+'
};
