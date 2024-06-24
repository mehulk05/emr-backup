import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadSourceurlService } from '../../service/lead-sourceurl.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-ad-edit-lead-sourceurl',
  templateUrl: './ad-edit-lead-sourceurl.component.html',
  styleUrls: ['./ad-edit-lead-sourceurl.component.css']
})
export class AdEditLeadSourceurlComponent implements OnInit {
  id: any = null;
  submitted = false;
  leadSourceUrlForm: FormGroup;
  disabled = false;
  disableAdd: boolean = true;
  duplicateLabel: boolean = false;
  labels: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private leadSourceurlService: LeadSourceurlService
  ) {}

  ngOnInit(): void {
    this.leadSourceUrlForm = this.formBuilder.group({
      sourceUrl: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textField_Spaces)]
      ]
    });

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      if (this.id) {
        this.loadSourceUrl();
      }
    });
    this.loadTags();
  }

  submitForm() {
    this.submitted = true;
    if (this.leadSourceUrlForm.invalid) {
      return;
    }
    if (this.duplicateLabel) {
      return;
    }

    if (this.id) {
      const formData = this.leadSourceUrlForm.value;
      this.leadSourceurlService.update(this.id, formData).then(
        () => {
          //this.images.push(event.target.result);
          this.alertService.success('Source URL updated successfully.');
          this.goBack();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    } else {
      const formData = this.leadSourceUrlForm.value;
      console.log(formData);
      this.leadSourceurlService.create(formData).then(
        () => {
          this.alertService.success('Source URL created successfully.');
          this.goBack();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/sourceurl']);
  }

  get f() {
    return this.leadSourceUrlForm.controls;
  }

  loadSourceUrl() {
    this.leadSourceurlService.get(this.id).then((response: any) => {
      this.leadSourceUrlForm.patchValue(response);
    });
  }

  loadTags() {
    this.leadSourceurlService.list().then(
      (response: any) => {
        this.labels = response;
      },
      (error: any) => {
        this.alertService.error(error.message);
      }
    );
  }

  onLabelAdd = ($event: any) => {
    const name = $event.target?.value;
    console.log('name', name);
    if (this.labels.some((label: any) => label.name == name)) {
      this.duplicateLabel = true;
    } else {
      this.duplicateLabel = false;
    }
    console.log('dupli', this.duplicateLabel);
    this.disableAdd = name === '' || this.duplicateLabel;
  };
}
