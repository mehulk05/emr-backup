import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ChatConfigService } from '../../service/chat-config.service';

@Component({
  selector: 'app-scrape-website',
  templateUrl: './scrape-website.component.html',
  styleUrls: ['./scrape-website.component.css']
})
export class ScrapeWebsiteComponent implements OnInit, OnChanges {
  @Input() scrapeWeb: any;
  scrapForm!: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    private chatConfigService: ChatConfigService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.scrapForm = this.formBuilder.group({
      scrapWebsiteUrl: ['', [Validators.required]],
      scrapWebsiteFrequency: [7, [Validators.required]]
    });
  }

  ngOnChanges(): void {
    console.log('this.scrapeWeb', this.scrapeWeb);
    //this.patchChatValue(this.scrapeWeb);
    if (this.scrapeWeb && this.scrapeWeb?.tenantId) {
      this.patchChatValue(this.scrapeWeb);
    }
  }

  patchChatValue(response: any) {
    console.log('res000', response?.scrapWebsiteUrl);
    this.scrapForm.patchValue({
      scrapWebsiteUrl: response?.scrapWebsiteUrl,
      scrapWebsiteFrequency: response?.scrapWebsiteFrequency
    });
  }

  get sForm() {
    return this.scrapForm.controls;
  }

  submitScrapForm() {
    if (this.scrapForm.invalid) {
      return;
    }
    const values = this.scrapForm.value;
    this.chatConfigService.scrapWebsite(values).then(
      (response: any) => {
        this.alertService.success(
          'URL submitted for scrapping. You will see the questions in questionnaire.'
        );
        this.patchChatValue(response);
      },
      () => {
        this.alertService.error('Unable to submit URL for scrapping.');
      }
    );
  }
}
