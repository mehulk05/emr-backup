import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { ClinicService } from '../../../services/clinic.service';

@Component({
  selector: 'app-g99-clinic-reviews-edit',
  templateUrl: './g99-clinic-reviews-edit.component.html',
  styleUrls: ['./g99-clinic-reviews-edit.component.css']
})
export class G99ClinicReviewsEditComponent implements OnInit {
  @Input() clinicData: any;
  @Input() clinicId: any;
  searchReviewsForm!: FormGroup;
  loading: any;
  currentPage: number = 1;
  lastPage: number;
  reviewList: any[] = [];
  totalReviews: number = 0;
  previousPages: [];
  nextPages: [];
  rangeStart: number = 0;
  rangeEnd: number = 0;
  reviewsPerPage: number = 0;
  showPagination: boolean = false;
  showNoReviews: boolean;
  showAddReviewModal: boolean = false;

  constructor(
    private clinicService: ClinicService,
    private toastMessageService: ToasTMessageService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.fetchPageData();
    this.searchReviews('', this.currentPage);
    this.searchReviewsForm = this.formBuilder.group({
      searchText: ['', '']
    });
  }

  fetchPageData() {
    this.clinicService.getClinicProperties(btoa(this.clinicId)).subscribe(
      (response: any) => {
        console.log(response);
        this.reviewsPerPage = response?.data?.reviewPerPage;
      },
      () => {
        this.toastMessageService.error('Error fetching data');
      }
    );
  }

  searchReviews(searchText: string, pageNo: any) {
    this.clinicService
      .searchClinicReviews(this.clinicId, searchText, pageNo)
      .subscribe(
        (response: any) => {
          this.reviewList = response?.data?.reviewMap;
          this.showPagination = this.reviewList?.length != 0;
          this.totalReviews = response?.data?.totalReviewsSize;
          this.currentPage = pageNo;
          this.lastPage = response?.data?.pages;
          this.rangeStart = (this.currentPage - 1) * this.reviewsPerPage + 1;
          this.rangeEnd =
            (this.currentPage - 1) * this.reviewsPerPage +
            this.reviewList?.length;
          if (this.reviewList?.length == 0 || !this.reviewList) {
            this.showNoReviews = true;
          } else {
            this.showNoReviews = false;
          }
        },
        () => {
          this.showNoReviews = true;
          this.toastMessageService.error('Search failed');
        }
      );
  }

  submitForm() {
    const formData = this.searchReviewsForm.value;
    this.searchReviews(formData.searchText, 1);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  refetch(data: any) {
    this.searchReviews(
      this.searchReviewsForm.value.searchText,
      this.currentPage
    );
  }

  addReview() {
    this.showAddReviewModal = true;
  }

  onCloseModal(e: any) {
    this.showAddReviewModal = false;
    if (e?.isSaved) {
      this.refetch(null);
    }
  }
}
