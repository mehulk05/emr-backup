import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PostLabelService } from '../../services/post-label.service';

@Component({
  selector: 'app-add-edit-post-label',
  templateUrl: './add-edit-post-label.component.html',
  styleUrls: ['./add-edit-post-label.component.css']
})
export class AddEditPostLabelComponent implements OnInit {
  id: string = null;
  postLabelForm: FormGroup;
  disableAdd: boolean = true;
  duplicateLabel: boolean = false;
  labels: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private postLibraryLabelService: PostLabelService
  ) {}

  ngOnInit(): void {
    this.postLabelForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      isDefault: [false, []]
    });

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      if (this.id) {
        this.loadLabel();
      }
    });
    this.loadLabels();
  }

  submitForm() {
    if (this.postLabelForm.invalid) {
      return;
    }
    if (this.duplicateLabel) {
      this.alertService.error('The label with same name already exists');
      return;
    }

    if (this.id) {
      const formData = this.postLabelForm.value;
      this.postLibraryLabelService.update(this.id, formData).then(
        () => {
          //this.images.push(event.target.result);
          this.alertService.success('Post label updated successfully.');
          this.goBack();
        },
        () => {
          this.alertService.error('Error while updating label');
        }
      );
    } else {
      const formData = this.postLabelForm.value;
      console.log(formData);
      this.postLibraryLabelService.createPostLabels(formData).then(
        () => {
          this.alertService.success('Post label created successfully.');
          this.goBack();
        },
        () => {
          this.alertService.error('Error while creating label');
        }
      );
    }
  }

  goBack() {
    this.router.navigate(['/post-library-label']);
  }

  get f() {
    return this.postLabelForm.controls;
  }

  loadLabel() {
    this.postLibraryLabelService
      .get(this.id)
      .then((response: { [key: string]: any }) => {
        this.postLabelForm.patchValue(response);
      });
  }

  loadLabels() {
    this.postLibraryLabelService.getPostLabels().then(
      (response: any) => {
        this.labels = response;
      },
      (error: { message: any }) => {
        this.alertService.error(error.message);
      }
    );
  }

  onLabelAdd = ($event: any) => {
    const name = $event.target?.value;
    if (this.labels.some((label) => label.name == name)) {
      this.duplicateLabel = true;
    } else {
      this.duplicateLabel = false;
    }
    console.log(this.duplicateLabel);
    this.disableAdd = name === '' || this.duplicateLabel;
  };
}
