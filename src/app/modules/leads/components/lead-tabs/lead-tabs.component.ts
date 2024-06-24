import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadsService } from '../../service/leads.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-lead-tabs',
  templateUrl: './lead-tabs.component.html',
  styleUrls: ['./lead-tabs.component.css']
})
export class LeadTabsComponent implements OnInit {
  leadQuestionarieResponse: any;
  leadDetailObj: any;
  leadId: any;
  selectedIndex: any = 0;
  sources = [
    'leadDetail',
    'timeline',
    'leadTask',
    'history',
    'allTimeline',
    'smsAudit'
  ];
  source: any = 'leadDetail';
  email: string;
  businessInfo: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private router: Router,
    private leadService: LeadsService,
    private alertService: ToasTMessageService
  ) {
    //console.log(this.router.getCurrentNavigation().extras.state.email);
  }

  ngOnInit(): void {
    this.leadId = this.activatedRoute.snapshot.params.leadId;
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data.source;
      this.email = data.email;
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
    this.businessInfo = this.localStorageService.readStorage('businessData');
    this.activatedRoute.params.subscribe((data: any) => {
      this.leadId = data.leadId;
      this.source =
        this.activatedRoute.snapshot.queryParams?.source ?? 'leadDetail';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
      console.log(this.source);
      this.loadQuestionnaireSubmission();
    });
  }

  loadQuestionnaireSubmission() {
    this.leadService.getQuestionnaireSubmission(this.leadId).then(
      (response: any) => {
        this.leadQuestionarieResponse = response;
        this.leadDetailObj = {};
        this.leadDetailObj.id = response.id;
        this.leadDetailObj.source = response.source;
        this.leadDetailObj.landingPageName = response.landingPageName;
        this.leadDetailObj.createdDate = response.createdAt;
        this.leadDetailObj.questionnaireSubmission = response;
        this.leadDetailObj.lead_status = response.leadStatus;
        for (let i = 0; i < response.questionAnswers.length; i++) {
          if (
            response.questionAnswers[i].questionName.toLowerCase() ==
            'first name'
          ) {
            this.leadDetailObj.firstName =
              response.questionAnswers[i].answerText;
            this.leadDetailObj.firstNamePlaceId =
              response.questionAnswers[i].answerText;
          } else if (
            response.questionAnswers[i].questionName.toLowerCase() ==
            'last name'
          ) {
            this.leadDetailObj.lastName =
              response.questionAnswers[i].answerText;
            this.leadDetailObj.lastNamePlaceId =
              response.questionAnswers[i].answerText;
          } else if (
            response.questionAnswers[i].questionName.toLowerCase() == 'email'
          ) {
            this.leadDetailObj.emailPlaceId =
              response.questionAnswers[i].answerText;
          } else if (
            response.questionAnswers[i].questionName.toLowerCase() ==
            'phone number'
          ) {
            this.leadDetailObj.phoneNumberPlaceId =
              response.questionAnswers[i].answerText;
          }
        }
        this.localStorageService.storeItem(
          'currentLeadDetail',
          this.leadDetailObj
        );
      },
      () => {
        this.alertService.error('Unable to load the questionnaire submission.');
      }
    );
  }
  handleChange(e: any) {
    this.selectedIndex = e.index;
    if (this.leadId) {
      this.router.navigate(['leads', this.leadId, 'edit'], {
        queryParams: {
          source: this.sources[e.index]
        },
        queryParamsHandling: 'merge'
      });
    } else {
      this.router.navigate(['leads', 'create'], {
        queryParams: {
          source: this.sources[e.index]
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  handleQuestionarieCall() {
    this.loadQuestionnaireSubmission();
  }
}
