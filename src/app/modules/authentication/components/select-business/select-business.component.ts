import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ApiService } from 'src/app/shared/services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-select-business',
  templateUrl: './select-business.component.html',
  styleUrls: ['./select-business.component.css']
})
export class SelectBusinessComponent {
  showModal: boolean = true;
  @Input() userData: any;
  @Output() afterBusinessSelection = new EventEmitter<any>();

  constructor(
    private authService: AuthService,
    private apiService: ApiService
  ) {}

  hideModal() {
    this.showModal = false;
  }

  onBusinessSelect(id: any) {
    this.authService.getBusinessData(id).then(
      (data: any) => {
        this.afterBusinessSelection.emit({ bid: id, businessData: data });
        this.hideModal();
      },
      () => {
        this.apiService.error('Error fetching the business detail');
      }
    );
  }
}
