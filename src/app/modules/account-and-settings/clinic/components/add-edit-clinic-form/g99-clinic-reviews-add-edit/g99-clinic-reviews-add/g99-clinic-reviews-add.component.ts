import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import moment from 'moment';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ClinicService } from '../../../../services/clinic.service';

@Component({
  selector: 'app-g99-clinic-reviews-add',
  templateUrl: './g99-clinic-reviews-add.component.html',
  styleUrls: ['./g99-clinic-reviews-add.component.css']
})
export class G99ClinicReviewsAddComponent implements OnInit {
  @Input() showModal: boolean = false;
  @Output() modalClosed = new EventEmitter<any>();
  @Input() clinicId: any;
  reviewForm!: FormGroup;
  maxDate: Date = new Date();
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private clinicService: ClinicService
  ) {}

  ngOnInit(): void {
    this.reviewForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.alpha_spaces)]
      ],
      reviewDescription: [''],
      reviewDate: ['', [Validators.required]],
      rating: [1, []]
    });
  }

  get f() {
    return this.reviewForm.controls;
  }

  hideModal(isSaved: boolean) {
    this.modalClosed.emit({ close: true, isSaved: isSaved });
    this.showModal = false;
  }

  changeRating(star: number) {
    this.reviewForm.patchValue({
      rating: star
    });
  }

  saveReview() {
    const formData = this.reviewForm.value;
    this.clinicService
      .addReview(this.clinicId, {
        name: formData.name,
        description: formData.reviewDescription,
        rating: formData.rating,
        reviewDate: moment(formData.reviewDate).format('DD MMM yyyy'),
        handleName: 'other'
      })
      .subscribe(
        () => {
          this.toastService.success('Review added successfully.');
          this.hideModal(true);
        },
        () => {
          this.toastService.error('Error adding review.');
          this.hideModal(false);
        }
      );
  }
}
