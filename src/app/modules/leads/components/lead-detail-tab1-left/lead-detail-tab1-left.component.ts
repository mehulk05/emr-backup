import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { LeadsService } from '../../service/leads.service';
import { FileSaverService } from 'ngx-filesaver';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LeadTagService } from 'src/app/modules/lead-tag/services/lead-tag.service';
import { HttpHelperService } from 'src/app/shared/services/HttpHelperService';
import { environment } from 'src/environments/environment';
import { RegexEnum } from 'src/app/shared/common/constants/regex';

@Component({
  selector: 'app-lead-detail-tab1-left',
  templateUrl: './lead-detail-tab1-left.component.html',
  styleUrls: ['./lead-detail-tab1-left.component.css']
})
export class LeadDetailTab1LeftComponent implements OnInit, OnChanges {
  @Output() leadDetailsUpdated: EventEmitter<any> = new EventEmitter();
  @Input() leadQuestionarieResponse: any;
  @Output() handleCallQuestionaireApiCallback = new EventEmitter<any>();
  showTooltip = false;
  questionnaireSubmission: any = null;
  landingPageName: any = null;
  isSourceVirtualConsultation = false;
  leadFirstName = false;
  leadLastName = false;
  leadEmail = false;
  leadPhoneNumber = false;
  firstNamePlaceId = '';
  lastNamePlaceId = '';
  emailPlaceId = '';
  phoneNumberPlaceId = '';
  source: any;
  lead_status = 'New';
  firstName: any = null;
  lastName: any = null;
  @Input() leadIds: any = [];
  id: any = null;
  currentIndex: any = null;
  tempTab: string;
  currentTab: any = 'leadDetail';
  createdDate: any = null;
  showModal: boolean = false;
  showTaskTemplateModal: boolean = false;
  modalData: any;
  showEditLeadModal: boolean;
  leadObj: any;
  leadCommentForm: FormGroup;
  leadStatusForm: FormGroup;
  leadAmountForm: FormGroup;
  leadComments: any = [];
  selectedTag: any = [];
  tagId: any = [];
  tags: any = [];
  tagSelect: any;
  amountValid: any;
  amountVal: any;
  leadTasks: any = [];
  showConvertLeadModal: boolean = false;
  showOnboardedLeadModal: boolean = false;
  isSmileVirtualBusiness: boolean = false;
  formName: any;
  statusOptions = [
    'New',
    'Junk',
    'Cold',
    'Warm',
    'Hot',
    'Pending',
    'Won',
    'Dead'
  ];
  leadStatusColorObj = leadStatusColorObj;
  initialLeadStatus: string;
  shouldUpdateLeadDetail: boolean;
  isLeadDetailUpdated: boolean;

  // Add Tag Modal
  showTagTemplateModal: boolean = false;
  addTagId: any = null;
  submitted = false;
  leadTagForm: FormGroup;
  disabled = false;
  disableAdd: boolean = true;
  duplicateLabel: boolean = false;
  labels: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: ToasTMessageService,
    public formatTimeService: FormatTimeService,
    private leadService: LeadsService,
    public formBuilder: FormBuilder,
    private fileSaverService: FileSaverService,
    private leadTagService: LeadTagService,
    private httpHelperService: HttpHelperService
  ) {
    this.leadAmountForm = this.formBuilder.group({
      amount: [0, [Validators.required]]
    });

    this.leadStatusForm = this.formBuilder.group({
      leadStatus: ['NEW', [Validators.required]],
      tagId: [[], []]
    });
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.id = data.params.leadId;
      this.loadTags();
    });
    this.leadCommentForm = this.formBuilder.group({
      comment: ['', [Validators.required]],
      questionnaireSubmissionId: [this.id, []]
    });

    console.log(this.httpHelperService.getTenantHttpOptions()['X-TenantID']);
    if (
      this.httpHelperService.getTenantHttpOptions()['X-TenantID'] ===
        environment.SMILE_VIRTUAL_BUSINESS_ID + '' ||
      this.httpHelperService.getTenantHttpOptions()['X-TenantID'] ===
        environment.AESTHETIC_VIRTUAL_BUSINESS_ID + ''
    ) {
      this.isSmileVirtualBusiness = true;
    }
    console.log(this.isSmileVirtualBusiness);

    this.leadTagForm = this.formBuilder.group({
      name: [
        '',
        [Validators.required, Validators.pattern(RegexEnum.textField_Spaces)]
      ],
      isDefault: [false, []]
    });

    // this.leadTagForm = this.formBuilder.group({
    //   name: [
    //     '',
    //     [
    //       Validators.required,
    //       Validators.pattern(RegexEnum.textField_Spaces)
    //       // Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
    //       // Validators.pattern(/^[a-zA-Z0-9\s]+$/)
    //     ]
    //   ],
    //   isDefault: [false, []]
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const currentValue = changes.leadQuestionarieResponse.currentValue;
    const previousValue = changes.leadQuestionarieResponse.previousValue;
    console.log('this', this.leadQuestionarieResponse, changes);

    // Check if both current and previous values are defined and the 'id' property is different
    if (
      (currentValue && currentValue.id !== previousValue?.id) ||
      this.isLeadDetailUpdated
    ) {
      this.updateQuestionnaireSubmission(this.leadQuestionarieResponse);
      this.isLeadDetailUpdated = false;
    }
  }

  submitForm() {
    this.submitted = true;
    if (this.leadTagForm.invalid) {
      return;
    }
    if (this.duplicateLabel) {
      return;
    }

    if (this.addTagId) {
      const formData = this.leadTagForm.value;
      this.leadTagService.update(this.addTagId, formData).then(
        () => {
          //this.images.push(event.target.result);
          this.alertService.success('Tag updated successfully.');
          this.closeAddTagTemplateModal();
          this.loadTags();
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
          this.closeAddTagTemplateModal();
          this.loadTags();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    }
    this.leadTagForm.reset();
  }

  get f() {
    return this.leadTagForm.controls;
  }

  loadTagModal() {
    this.leadTagService.get(this.addTagId).then((response: any) => {
      this.leadTagForm.patchValue(response);
    });
  }

  loadTagsModal() {
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

  openAddTagTemplateModal() {
    this.showTagTemplateModal = true;
  }
  closeAddTagTemplateModal() {
    this.showTagTemplateModal = false;
  }

  updateQuestionnaireSubmission(response: any) {
    if (response && this.shouldUpdateLeadDetail) {
      this.leadDetailsUpdated.emit(response);
    }
    this.source = response.source;
    this.landingPageName = response.landingPageName;
    this.createdDate = response.createdAt;
    this.questionnaireSubmission = this.sortByQuestionNumber(response);
    console.log('res', response);
    this.lead_status = response.leadStatus;
    this.formName = response.questionnaireName;
    if (this.source != null && this.source == 'Self Assessment') {
      this.isSourceVirtualConsultation = true;
    }
    for (let i = 0; i < response.questionAnswers.length; i++) {
      if (
        response.questionAnswers[i].questionName.toLowerCase() === 'first name'
      ) {
        this.firstName = response.questionAnswers[i].answerText;
        this.firstNamePlaceId = response.questionAnswers[i].answerText;
      } else if (
        response.questionAnswers[i].questionName.toLowerCase() === 'last name'
      ) {
        this.lastName = response.questionAnswers[i].answerText;
        this.lastNamePlaceId = response.questionAnswers[i].answerText;
      }
    }
    this.leadAmountForm.patchValue({
      amount: response.amount
    });
    this.leadStatusForm.patchValue({
      leadStatus: response.leadStatus,
      tagId: response.tag
    });
    this.tagId = response.tag;
    if (this.tagId) this.selectedTag = this.tagId.map((x: any) => x.id);
    if (response.tagId != null) {
      response.tagId.forEach((id: any) => {
        this.tagId.push(id);
      });
    }
    this.tags = response.tagsList;
    this.shouldUpdateLeadDetail = false;
  }

  inlineEdit(lead: any) {
    this.isLeadDetailUpdated = true;
    const mainObj: any = {
      id: this.id,
      fullName: this.firstName + ' ' + this.lastName,
      amount: lead.amount,
      landingPage: lead.landingPageName,
      leadStatus: lead.leadStatus,
      sourceUrl: lead.sourceUrl,
      leadSource: lead.source
    };
    for (var item of lead.questionAnswers) {
      var key = item.questionName;
      var value = item.answerText;
      mainObj[key] = value;
    }
    this.showEditLeadModal = true;
    this.leadObj = mainObj;
  }

  openConvertLeadModal = () => (this.showConvertLeadModal = true);
  hideConvertLeadModal = () => (this.showConvertLeadModal = false);
  openOnboardedLeadModal = () => (this.showOnboardedLeadModal = true);
  hideOnboarderLeadModal = () => (this.showOnboardedLeadModal = false);
  hideAddTagModal = () => (this.showTagTemplateModal = false);
  downloadAsPDF1() {
    console.log('pfd1', this.id);
    this.leadService
      .getLeadDetailPDF(this.id)
      .then((data: any) => {
        console.log('data', data);
        this.fileSaverService.save(data, 'LeadDetail.pdf');
      })
      .catch(() => {
        this.alertService.error('Unable to download pdf.');
      });
  }

  downloadEmailPDF() {
    console.log('pdf');
    this.leadService
      .getLeadEmailPDF(this.id)
      .then((data: any) => {
        this.fileSaverService.save(data, 'LeadEmailDetail.pdf');
      })
      .catch(() => {
        this.alertService.error('Unable to download pdf.');
      });
  }

  loadQuestionnaireSubmission() {
    this.handleCallQuestionaireApiCallback.emit();
  }

  sortByQuestionNumber(response: any) {
    response.questionAnswers = response.questionAnswers.sort(
      (a: any, b: any) => a.questionId - b.questionId
    );
    return response;
  }

  goBack = () => {
    this.router.navigate(['/leads'], {
      state: { isDataModified: true }
    });
  };

  onCloseModal(e: any) {
    console.log('eve', e);
    this.showModal = false;
    this.shouldUpdateLeadDetail = true;
    this.showEditLeadModal = false;
    if (e?.isEdit) {
      this.loadQuestionnaireSubmission();
    }
  }

  symptomsValue(answerText: any) {
    let answer = '';
    try {
      const obj = JSON.parse(answerText);
      let ans = '';
      for (const [key, value] of Object.entries(obj)) {
        ans = ans + key.toUpperCase() + ': ' + [].concat(value).join() + ';';
      }

      if (ans.length > 1) {
        ans = ans.substring(0, ans.length - 1);
      }

      answer = ans;
    } catch (e) {
      answer = answerText;
    }
    return answer === '' ? '-' : answer;
  }

  convertToPatient() {
    this.leadService.leadToPatient(this.id).then(
      (response: any) => {
        if (response.statusCode == 200) {
          this.alertService.success('Converted to patient successfully');
          this.goBack();
        } else if (response.statusCode == 500) {
          this.alertService.error(response.message);
        }
      },
      () => {
        this.alertService.error(
          'Unable to convert to patient. Patient/User already exists'
        );
      }
    );
  }

  convertToOnboarded() {
    this.leadService.leadToOnboard(this.id).then(
      (response: any) => {
        if (response.statusCode == 200) {
          this.alertService.success('Onboarede successfully');
          this.goBack();
        } else if (response.statusCode == 500) {
          this.alertService.error(response.message);
        }
      },
      () => {
        this.alertService.error('Unable to Onboard');
      }
    );
  }

  setLeadStatus(status: any) {
    this.leadService.updateLeadStatus(this.id, status).then(
      () => {
        this.loadQuestionnaireSubmission();
      },
      () => {
        this.alertService.error('Error while updating the lead status');
      }
    );
  }

  getBusinessHours(hours: string) {
    return hours.split(',').map((hour) => hour.split('-'));
  }

  getTextAnswerValue(answer: any) {
    return answer ? answer.replace(/\n/g, '<br/>') : '';
  }

  amountChange(event: any) {
    var amount = event.target.value;
    if (isNaN(amount)) {
      this.alertService.info('Enter a valid number');
      return;
    }
    if (amount < 0) {
      this.amountValid = true;
      this.amountVal = false;
      return;
    }
    if (amount === null || amount === '') {
      this.amountVal = true;
      this.amountValid = false;
    } else {
      this.amountVal = false;
      this.amountValid = false;
    }
  }

  updateAmount() {
    if (this.amountVal || this.amountValid) {
      return;
    }
    var amount = this.leadAmountForm.value.amount;
    this.leadService.editAmountForLead(amount, this.id).then(() => {
      this.alertService.success('Lead Edited successfully !');
      console.log('amount', amount);
      this.isLeadDetailUpdated = true;
      this.handleCallQuestionaireApiCallback.emit();
    });
  }

  loadTags() {
    this.leadTagService.list().then(
      (response) => {
        this.tags = response;
        console.log('tag', this.tags);
      },
      (error) => {
        this.alertService.error(error.message);
      }
    );

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.addTagId = params.get('id');
      if (this.addTagId) {
        this.loadTagModal();
      }
    });
    this.loadTagsModal();
    this.updateQuestionnaireSubmission(this.leadQuestionarieResponse);
  }

  onTagSelect(e: any) {
    this.selectedTag = e.value;
    if (this.selectedTag.length === 0) {
      this.tagSelect = true;
    } else {
      this.tagSelect = false;
    }
  }

  updateLeadTag() {
    if (this.selectedTag && this.selectedTag.length == 0) {
      this.selectedTag = [-1000];
    }
    this.leadService.updateLeadTags(this.id, this.selectedTag).then(
      () => {
        this.alertService.success('Lead tag updated successfully');
        this.isLeadDetailUpdated = true;
        this.handleCallQuestionaireApiCallback.emit();
      },
      () => {
        console.log('err');
        this.alertService.error('Unable to update Lead tag');
      }
    );
  }
  addTaskTemplateModal() {
    this.showTaskTemplateModal = true;
  }

  onSelectedValue(newStatus: string) {
    this.lead_status = newStatus;
    this.leadService
      .editInlineLead({ leadStatus: newStatus }, this.id)
      .then(() => {
        this.loadQuestionnaireSubmission();
        this.isLeadDetailUpdated = true;
      });
  }
}

export const leadStatusColorObj = {
  new: '#01b700',
  junk: '#9F9F9F',
  cold: '#109BC7',
  warm: '#FB6900',
  hot: '#C51900',
  pending: '#FFB800',
  won: '#AA4EE7',
  dead: '#333333'
};
