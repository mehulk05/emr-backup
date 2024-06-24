import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';

@Component({
  selector: 'app-select-review-popup',
  templateUrl: './select-review-popup.component.html',
  styleUrls: ['./select-review-popup.component.css']
})
export class SelectReviewPopupComponent implements OnChanges {
  @Input() showModal: boolean = false;
  @Input() reviewsData: any;
  @Output() searchReview = new EventEmitter<any>();
  @Output() modalClosed = new EventEmitter<any>();
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
  selectedReview: any;
  searchText: string = '';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['reviewsData']) {
      this.initData();
    }
  }

  initData() {
    if (this.reviewsData) {
      this.reviewList = this.reviewsData?.data?.reviewMap;
      this.showPagination = this.reviewList?.length != 0;
      this.totalReviews = this.reviewsData?.data?.totalReviewsSize;
      this.lastPage = this.reviewsData?.data?.pages;
      this.rangeStart = (this.currentPage - 1) * this.reviewsPerPage + 1;
      this.rangeEnd =
        (this.currentPage - 1) * this.reviewsPerPage + this.reviewList?.length;
      if (this.reviewList?.length == 0) {
        this.showNoReviews = true;
      } else {
        this.showNoReviews = false;
      }
    }
  }

  searchReviews(searchText: string, pageNumber: number) {
    this.searchText = searchText;
    this.currentPage = pageNumber;
    this.searchReview.emit({
      searchText,
      pageNumber
    });
  }

  changeSelected(review: any) {
    if (review === this.selectedReview) {
      this.selectedReview = undefined;
      return;
    }
    this.selectedReview = review;
  }

  selectReview() {
    this.closeModal({
      isSelected: true,
      selectReview: this.selectedReview
    });
  }

  hideModal() {
    this.closeModal({ isSelected: false });
  }

  closeModal(data: any) {
    this.modalClosed.emit(data);
    this.showModal = false;
    this.selectedReview = undefined;
  }
}
