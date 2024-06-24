import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegexEnum } from 'src/app/shared/common/constants/regex';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LeadsService } from '../../../service/leads.service';

@Component({
  selector: 'app-lead-inline-edit',
  templateUrl: './lead-inline-edit.component.html',
  styleUrls: ['./lead-inline-edit.component.css']
})
export class LeadInlineEditComponent implements OnInit, OnChanges {
  @Input() showModal: boolean = false;
  @Input() modalData: any;
  @Output() modalClosed = new EventEmitter<any>();
  leadForm!: FormGroup;
  selectedStatus: string = 'NEW';
  leadStatus: any = [
    'NEW',
    'JUNK',
    'COLD',
    'WARM',
    'HOT',
    'PENDING',
    'WON',
    'DEAD'
  ];
  constructor(
    public formBuilder: FormBuilder,
    private toastService: ToasTMessageService,
    private leadService: LeadsService
  ) {}

  ngOnInit(): void {
    this.leadForm = this.formBuilder.group({
      id: [],
      name: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.alpha_spaces)]
      ],
      phone: ['', [Validators.required, Validators.pattern(RegexEnum.phone)]],
      email: ['', [Validators.required, Validators.pattern(RegexEnum.email)]],
      source: [''],
      amount: ['', [Validators.pattern(RegexEnum.numeric)]],
      leadStatus: ['']
    });
  }
  ngOnChanges(): void {
    console.log('model', this.modalData);
    if (this.modalData && this.modalData?.id) {
      setTimeout(() => {
        console.log(this.modalData, this.leadForm, this.modalData.fullName);
        this.leadForm.patchValue({
          id: this.modalData.id,
          name: this.modalData.fullName,
          phone: this.modalData['Phone Number'],
          email: this.modalData.Email,
          amount: this.modalData.amount,
          source: this.modalData.leadSource,
          leadStatus: this.modalData.leadStatus
        });
        this.selectedStatus = this.modalData.leadStatus;
      }, 100);
    }
  }

  get f() {
    return this.leadForm.controls;
  }

  hideModal() {
    this.modalClosed.emit({ close: true, isDelete: false, isEdit: false });
    this.showModal = false;
  }

  selectStatus(status: any) {
    this.selectedStatus = status;
  }

  saveLead() {
    console.log(this.leadForm.value);
    const formData: any = {};
    formData.name = this.leadForm.value.name;
    formData.email = this.leadForm.value.email;
    formData.phoneNumber = this.leadForm.value.phone;
    // formData.leadStatus = this.leadForm.value.leadStatus;
    formData.leadStatus = this.selectedStatus;
    console.log('phone', formData);
    const amount = this.leadForm.value.amount ?? 0;
    this.leadService.editInlineLead(formData, this.leadForm.value.id).then(
      () => {
        this.leadService
          .editAmountForLead(amount, this.leadForm.value.id)
          .then(() => {
            this.modalClosed.emit({
              close: true,
              isDelete: false,
              isEdit: true
            });
            this.showModal = false;
            this.toastService.success('Lead Edited successfully !');
          });
      },
      () => {
        this.toastService.error('Error while editing leads !');
      }
    );
  }
}
