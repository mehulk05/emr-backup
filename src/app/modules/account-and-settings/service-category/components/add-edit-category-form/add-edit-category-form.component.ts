import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClinicList } from 'src/app/shared/models/clinics/optimizedClinic';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ClinicService } from '../../../clinic/services/clinic.service';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-edit-category-form',
  templateUrl: './add-edit-category-form.component.html',
  styleUrls: ['./add-edit-category-form.component.css']
})
export class AddEditCategoryFormComponent implements OnInit {
  serviceCategoryForm!: FormGroup;
  clinicList: ClinicList[] = [];
  categoryId: any;
  title: string = 'Create Category';
  disableAdd: boolean = true;
  duplicateLabel: boolean = false;
  labels: any = [];

  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clinicService: ClinicService,
    private categoryService: CategoryService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.serviceCategoryForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      clinicIds: [[], [Validators.required]]
    });
    this.loadAllClinics();
    this.loadCategories();
    this.categoryId = this.activatedRoute.snapshot.params.categoryId;
    if (this.categoryId) {
      this.title = 'Edit Category';
      this.loadCategory();
    }
  }

  loadCategory() {
    this.categoryService
      .loadCategoryById(this.categoryId)
      .then((response: any) => {
        const clinics: any[] = [];

        response.clinics.map((clinic: any) => {
          clinics.push(clinic.clinic.id);
        });
        this.serviceCategoryForm.patchValue({
          name: response.name,
          clinicIds: clinics
        });
      });
  }

  loadAllClinics() {
    this.clinicService
      .getClinics()
      .then((response: any) => {
        this.clinicList = response;
      })
      .catch(() => {
        this.toastService.error('Unable to load Clinic');
      });
  }
  get f() {
    return this.serviceCategoryForm.controls;
  }

  submitForm() {
    const formData = this.serviceCategoryForm.value;
    if (this.categoryId) {
      this.categoryService
        .updateServiceCategory(this.categoryId, formData)
        .then(
          () => {
            this.toastService.success('Category updated successfully.');
            this.router.navigate(['/categories']);
          },
          () => {
            this.toastService.error('Unable to save category.');
          }
        );
    } else {
      this.categoryService.createServiceCategory(formData).then(
        () => {
          this.toastService.success('Category saved successfully.');
          this.router.navigate(['/categories']);
        },
        () => {
          this.toastService.error('Unable to save category.');
        }
      );
    }
  }

  loadCategories() {
    this.categoryService
      .getAllCategories()
      .then((data: any) => {
        this.labels = data;
      })
      .catch(() => {
        this.toastService.error('Unable to load Service Category');
      });
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
  goBack = () => {
    this.router.navigate(['/categories'], {
      state: { isDataModified: false }
    });
  };
}
