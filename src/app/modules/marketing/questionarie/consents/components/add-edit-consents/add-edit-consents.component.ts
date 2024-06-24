import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
// import sizeof from 'object-sizeof';
import { ConsentService } from 'src/app/modules/pateint/services/consent.service';
// import { environment } from 'src/environments/environment';
import { PublicAccessibleService } from 'src/app/modules/public-accessible/services/public-accessible.service';

@Component({
  selector: 'app-add-edit-consents',
  templateUrl: './add-edit-consents.component.html',
  styleUrls: ['./add-edit-consents.component.css']
})
export class AddEditConsentsComponent implements OnInit {
  @ViewChild('ckeditor', { static: false }) ckeditor: any;
  editorData = '';
  submitted = false;
  consentForm: FormGroup;
  consentId: any = null;
  consentVariables: { label: string }[] = [];
  config: any;
  data: {};
  specializationList: [] = [];
  constructor(
    public formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private consentService: ConsentService,
    private alertService: ToasTMessageService,
    private publicAccessibleService: PublicAccessibleService
  ) {
    this.config = { uiColor: '#f2f2f2' };
  }

  ngOnInit(): void {
    this.consentForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      body: ['', [Validators.required]],
      tag: ['', []],
      specialization: [null]
    });
    this.config.extraPlugins = 'colorbutton , justify';
    this.consentId = this.activatedRoute.snapshot.params.consentId;
    this.loadSpecializations();
    if (this.consentId) {
      this.loadConsent();
    }
    this.loadConsentTags();
  }
  loadConsent() {
    this.consentService.getConsent(this.consentId).then(
      (response: any) => {
        this.consentForm.patchValue({
          name: response.name,
          body: response.body,
          tag: response.tag,
          specialization: 7
        });

        this.editorData = response.body;
      },
      () => {
        this.alertService.error('Unable to get the consent.');
      }
    );
  }

  loadSpecializations() {
    this.publicAccessibleService
      .getSpecializations(null)
      .then((response: any) => {
        this.specializationList = response;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  loadConsentTags() {
    this.consentVariables.push({ label: '${BUSINESS_LOGO}' });
    this.consentVariables.push({ label: '${CLINIC_NAME}' });
    this.consentVariables.push({ label: '${CLINIC_ADDRESS}' });
    this.consentVariables.push({ label: '${CURRENT_DATE}' });
    this.consentVariables.push({ label: '${PATIENT_FIRST_NAME}' });
    this.consentVariables.push({ label: '${PATIENT_LAST_NAME}' });
    // this.consentVariables.push({label:"${SERVICE_NAME}"});
    // this.consentVariables.push({label:"${PROVIDER_FIRST_NAME}"});
    // this.consentVariables.push({label:"${PROVIDER_LAST_NAME}"});
    this.consentVariables.push({ label: '${SIGNED_DATE}' });

    console.log(this.consentVariables);
  }

  get f() {
    return this.consentForm.controls;
  }

  submitForm = () => {
    this.submitted = true;
    if (this.consentForm.invalid) {
      return;
    }
    const formData = this.consentForm.value;
    // if (sizeof(formData) > environment.FORM_MAX_SIZE) {
    //   this.alertService.error('Consent Form size is greater than 2 MB');
    // } else {
    if (this.consentId) {
      this.consentService.updateConsent(this.consentId, formData).then(
        () => {
          this.alertService.success('Consent updated successfully.');
          this.back();
        },
        () => {
          this.alertService.error('Unable to save the consent.');
        }
      );
    } else {
      this.consentService.createConsent(formData).then(
        () => {
          this.alertService.success('Consent saved successfully.');
          this.back();
        },
        () => {
          this.alertService.error('Unable to save the consent.');
        }
      );
    }
    // }
  };

  back = () => {
    this.router.navigate(['/clinical-doc/consents']);
  };

  addVariables(event: any, variable: any) {
    if (variable.label == '${BUSINESS_LOGO}') {
      var style =
        " <img src='" +
        variable.label +
        "'   width='250' height='120'  style='line-height: 100%; outline-color: initial; outline-style: none; outline-width: initial; text-decoration-line: none; text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; box-sizing: border-box; width: 250px; height: 120px;' >";
      this.ckeditor.instance.insertHtml(style);
    } else {
      this.ckeditor.instance.insertHtml(
        '' + variable.label.replace(/ /g, '_') + ''
      );
    }
    const innerHtml = this.consentForm.value.body;
    this.consentForm.patchValue({ body: innerHtml });
    console.log(this.consentForm);
  }
}
