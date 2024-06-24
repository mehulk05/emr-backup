import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionarieService } from '../../services/questionarie.service';

@Component({
  selector: 'app-contact-form-tab',
  templateUrl: './contact-form-tab.component.html',
  styleUrls: ['./contact-form-tab.component.css']
})
export class ContactFormTabComponent implements OnInit {
  selectedIndex: any = 0;
  sources = [
    'designer',
    'notification',
    'configuration',
    'submission',
    'business'
  ];
  source: any = 'designer';
  formId: any;
  questionnaireId: any;
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private questionnaireService: QuestionarieService
  ) {}

  ngOnInit(): void {
    this.formId = this.activatedRoute.snapshot.params.questionnaireId;
    this.questionnaireId = this.activatedRoute.snapshot.params.questionnaireId;
    if (!this.questionnaireId || this.questionnaireId == 0) {
      this.questionnaireService.getLeadCaptureForm().then((response: any) => {
        this.questionnaireId = response.id;
        this.formId = response.id;
      });
    }
    this.source =
      this.activatedRoute.snapshot.queryParams?.source ?? 'designer';
    this.activatedRoute.queryParams.subscribe((data: any) => {
      this.source = data?.source ?? 'designer';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
    });
  }

  handleChange(e: any) {
    this.selectedIndex = e.index;
    console.log('id', this.formId);
    if (this.formId !== '0') {
      console.log('if');
      this.router.navigate(
        ['clinical-doc/questionnaire', this.formId, 'edit'],
        {
          queryParams: {
            source: this.sources[e.index]
          },
          queryParamsHandling: 'merge'
        }
      );
    } else {
      console.log('else');
      this.router.navigate(
        ['clinical-doc/questionnaire', this.formId, 'lead-capture-form'],
        {
          queryParams: {
            source: this.sources[e.index]
          },
          queryParamsHandling: 'merge'
        }
      );
    }
  }
}
