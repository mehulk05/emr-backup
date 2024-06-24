import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadTagService } from '../../services/lead-tag.service';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-add-edit-lead-tag',
  templateUrl: './add-edit-lead-tag.component.html',
  styleUrls: ['./add-edit-lead-tag.component.css']
})
export class AddEditLeadTagComponent implements OnInit {
  id: any = null;
  submitted = false;
  leadTagForm: FormGroup;
  disabled = false;
  disableAdd: boolean = true;
  duplicateLabel: boolean = false;
  labels: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private leadTagService: LeadTagService
  ) {}

  ngOnInit(): void {
    this.leadTagForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(RegexEnum.textField_Spaces)
          // Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          // Validators.pattern(/^[a-zA-Z0-9\s]+$/)
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
    if (this.leadTagForm.invalid) {
      return;
    }
    if (this.duplicateLabel) {
      return;
    }

    if (this.id) {
      const formData = this.leadTagForm.value;
      this.leadTagService.update(this.id, formData).then(
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
      const formData = this.leadTagForm.value;
      console.log(formData);
      this.leadTagService.create(formData).then(
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
    this.router.navigate(['/tags']);
  }

  get f() {
    return this.leadTagForm.controls;
  }

  loadTag() {
    this.leadTagService.get(this.id).then((response: any) => {
      this.leadTagForm.patchValue(response);
    });
  }

  loadTags() {
    this.leadTagService.list().then(
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
    if (
      this.labels.some(
        (label: any) => label.name.toLowerCase() == name.toLowerCase()
      )
    ) {
      this.duplicateLabel = true;
    } else {
      this.duplicateLabel = false;
    }
    console.log('dupli', this.duplicateLabel);
    this.disableAdd = name === '' || this.duplicateLabel;
  };
}
