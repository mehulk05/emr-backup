import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ClinicService } from '../../../services/clinic.service';

@Component({
  selector: 'app-g99-review-item',
  templateUrl: './g99-review-item.component.html',
  styleUrls: ['./g99-review-item.component.css']
})
export class G99ReviewItemComponent implements OnInit {
  @Input() review: any;
  @Input() clinicId: any;
  rating: string = '0';
  stars: number[];
  reviewData!: FormGroup;
  editEnabled: boolean = false;
  @Output() refetchEvent = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private clinicService: ClinicService,
    private toasTMessageService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.rating = this.review.ratings;
    try {
      this.stars = [...Array(parseInt(this.rating)).keys()];
    } catch (e) {
      this.stars = [];
    }
    this.reviewData = this.formBuilder.group({
      description: [this.review.description, []]
    });
    this.reviewData.controls['description'].disable();
  }

  toogleHideReview() {
    this.clinicService
      .toggleHideReview(this.clinicId, !this.review.hidden, {
        name: this.review.name,
        description: this.review.description,
        handleName: this.review.handleName
      })
      .subscribe(
        () => {
          this.toasTMessageService.success('review updated');
          this.sendDataToParent();
        },
        () => {
          this.toasTMessageService.error('review update failed');
        }
      );
  }

  updateReview() {
    const formData = this.reviewData.value;
    this.clinicService
      .updateReview(this.clinicId, {
        name: this.review.name,
        description: formData.description,
        handleName: this.review.handleName
      })
      .subscribe(
        () => {
          this.toasTMessageService.success('review updated');
          this.sendDataToParent();
        },
        () => {
          this.toasTMessageService.error('review update failed');
        }
      );
  }

  sendDataToParent() {
    this.refetchEvent.emit('true');
  }

  toggleEdit() {
    this.editEnabled = !this.editEnabled;
    if (this.editEnabled) {
      this.reviewData.controls['description'].enable();
    } else {
      this.reviewData.controls['description'].disable();
    }
  }
}
