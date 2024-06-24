import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostLibraryService } from '../../services/post-library.service';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-configure-ai-post',
  templateUrl: './configure-ai-post.component.html',
  styleUrls: ['./configure-ai-post.component.css']
})
export class ConfigureAiPostComponent implements OnInit {
  configureFg!: FormGroup;
  calendarMinDate = new Date();
  frequency = [{ name: 'day' }];
  enabledTrigger = false;
  hideTrigger = true;
  id: any;
  constructor(
    private formBuilder: FormBuilder,
    private socialMediaService: PostLibraryService,
    private alertService: ToasTMessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.configureFg = this.formBuilder.group({
      startDate: ['', [Validators.required]],
      duration: ['', [Validators.required]],
      frequency: ['', [Validators.required]]
    });
    this.getPostConfig();
  }

  getPostConfig() {
    this.socialMediaService.socialPostConfiglist().then(
      (data: any) => {
        if (data != null) {
          this.id = data.id;
          if (data?.id) {
            this.hideTrigger = false;
          }
          if (data?.disabled) {
            this.enabledTrigger = false;
          } else {
            this.enabledTrigger = true;
          }
          this.configureFg.patchValue({
            startDate: data?.date ? new Date(data?.date) : this.calendarMinDate,
            duration: data.duration,
            frequency: data.frequency,
            id: data.id
          });
        }
      },
      () => {
        this.alertService.error('Unable to get the post config');
      }
    );
  }

  submitForm() {
    if (this.configureFg.value.duration > 31) {
      this.alertService.error(
        'Scheduling frequency should be less than or equal to 31 days'
      );
      return;
    }
    this.configureFg.value.startDate = moment(this.configureFg.value.startDate)
      .format('YYYY/MM/DD')
      .replace(/[/]/g, '-');
    this.socialMediaService.createPostConfig(this.configureFg.value).then(
      () => {
        let message = 'Social media post configuration created successfully.';
        if (this.id) {
          message = 'Social media post configuration updated successfully';
        }
        this.alertService.success(message);
        this.router.navigate(['/post-library']);
      },
      () => {
        this.alertService.error('Unable to create the post config');
      }
    );
  }

  checked($event: any) {
    console.log($event);
    this.socialMediaService.diableEnablePost(!this.enabledTrigger).then(
      () => {
        const message =
          'Social media post configuration ' +
          (!this.enabledTrigger ? 'disabled' : 'enabled') +
          ' successfully.';
        this.alertService.success(message);
      },
      () => {
        this.alertService.error('Unable to do an action');
      }
    );
  }
}
