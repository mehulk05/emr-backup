import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientTagService } from '../../services/patient-tag.service';
@Component({
  selector: 'app-add-edit-patient-tag',
  templateUrl: './add-edit-patient-tag.component.html',
  styleUrls: ['./add-edit-patient-tag.component.css']
})
export class AddEditPatientTagComponent implements OnInit {
  id: any = null;
  submitted = false;
  patientTagForm: FormGroup;
  disabled = false;
  disableAdd: boolean = true;
  duplicateLabel: boolean = false;
  labels: any = [];
  tag_name: any = '';

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private patientTagService: PatientTagService
  ) {}

  ngOnInit(): void {
    this.patientTagForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          Validators.pattern(/^[a-zA-Z0-9\s]+$/)
        ]
      ],
      isDefault: [false, []]
    });

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      if (this.id) {
        this.loadTag();
      }
    });
    this.loadTags();
  }

  submitForm() {
    this.submitted = true;
    if (this.patientTagForm.invalid) {
      return;
    }
    if (this.duplicateLabel) {
      return;
    }

    if (this.id) {
      const formData = this.patientTagForm.value;
      this.patientTagService.update(this.id, formData).then(
        () => {
          //this.images.push(event.target.result);
          this.alertService.success('Tag updated successfully.');
          this.goBack();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    } else {
      const formData = this.patientTagForm.value;
      console.log(formData);
      this.patientTagService.create(formData).then(
        () => {
          this.alertService.success('Tag created successfully.');
          this.goBack();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/ptag']);
  }

  get f() {
    return this.patientTagForm.controls;
  }

  loadTag() {
    this.patientTagService.get(this.id).then((response: any) => {
      this.patientTagForm.patchValue(response);
    });
  }

  loadTags() {
    this.patientTagService.list().then(
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
