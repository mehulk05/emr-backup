import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LandingPageService } from '../../services/landing-page.service';
import { TriggersService } from '../../services/triggers.service';
import { UserService } from '../../services/user.service';
import { QuestionariePageService } from '../../../questionarie/services/questionarie-page.service';
import { LeadSourceurlService } from '../../../../lead-sourceurl/service/lead-sourceurl.service';
import moment from 'moment-timezone';
import { LeadsService } from 'src/app/modules/leads/service/leads.service';
import { filterElementFromKey } from './triggerUtil';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

enum LeadStatus {
  GENERATED = 'generated',
  STATUS_CHANGE = 'statusChange',
  TAGS_CHANGE = 'tagsChange'
}

@Component({
  selector: 'app-add-edit-triggers',
  templateUrl: './add-edit-triggers.component.html',
  styleUrls: ['./add-edit-triggers.component.css']
})
export class AddEditTriggersComponent implements OnInit {
  LeadStatus = LeadStatus; // Expose the enum to the template
  validationExpression: RegExp =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  triggerForm: FormGroup | any;
  triggerAppointmentForm: FormGroup;
  orderCount = 0;
  minDeadLineDate = new Date();
  triggerId: number;
  taskNameValidation: boolean = false;
  taskNameValid: boolean = false;
  taskDescriptionInvalid: boolean = false;
  triggerOpen = true;
  actionIndex: number = -1;
  showBorder = false;
  moduleName: any = '';
  users: any = [];
  actionObj: any = {};
  leadTagList: any[] = [];
  triggerData: any = {};
  appointMentDetails: any;
  appointments: any = [];
  emailTemplates: any = [];
  moduleTypeForm = 'forms';
  triggerTimes = [
    // {value:'MIN',label:'Immediately'},
    { value: 'MIN', label: 'Min' },
    { value: 'HOUR', label: 'Hour' },
    { value: 'DAY', label: 'Day' }
  ];
  taskPriority = [
    { name: 'High', code: 'High' },
    {
      name: 'Medium',
      code: 'Medium'
    },
    {
      name: 'Low',
      code: 'Low'
    }
  ];

  dateFormat: string = 'yyyy-MM-dd HH:mm:ss Z';
  dateFormatSlash: string = 'YYYY/MM/DD HH:mm:ss Z';
  defaultStartTime = moment(
    moment().set('hours', 9).set('minutes', 0).set('seconds', 0)
  ).toDate();
  defaultEndTime = moment(
    moment().set('hours', 17).set('minutes', 0).set('seconds', 0)
  ).toDate();

  dateType = [
    { value: 'APPOINTMENT_CREATED', label: 'Appointment Created Date' },
    { value: 'APPOINTMENT_BEFORE', label: 'Before Appointment Date' },
    { value: 'APPOINTMENT_AFTER', label: 'After Appointment Date' }
  ];

  triggerFrequencies = [
    { value: 0, label: 'Never' },

    { value: 1, label: 'Every hour' },
    { value: 24, label: 'Every Day' },
    { value: 24 * 15, label: 'Every 15 Day' },
    { value: 24 * 30, label: 'Every 30 Day' }
  ];
  isMobileDevice: boolean = window.innerWidth < 768 ? true : false;
  smsTemplate: any[] = [];
  leadEmailTemplate: any = [];
  patientEmailTemplate: any = [];
  patientClinicEmailTemplate: any = [];
  clinicEmailTemplate: any = [];
  leadSmsTemplate: any = [];
  patientSmsTemplate: any = [];
  patientClinicSmsTemplate: any = [];
  clinicSmsTemplate: any = [];
  appointmentPatientEmailTemplate: any = [];
  appointmentClinicEmailTemplate: any = [];
  appointmentPatientSMSTemplate: any = [];
  appointmentClinicSMSTemplate: any = [];
  isLastLevel = true;

  leadEmailTemplateData: any;
  leadSmsTemplateData: any;
  clinicSmsTemplateData: any;
  filterEmailVariables: any[];
  leadEmailVariables: any[];
  questionnaires: any = [];

  leadSmsVariables: any[];

  @ViewChild('myckeditor') myckeditor: any;
  @ViewChild('closebutton') closebutton: any;
  @ViewChild('closebutton1') closebutton1: any;
  @ViewChild('smsBody') smsBody: any;

  config: any;
  private _editor: any;

  landingPageNamesList: any[] = [];
  // landingPageNames: any[] = [];
  formList: any[] = [];
  reviewFormList: any[] = [];
  sourceUrlList: any[] = [];
  // formNames: any[] = [];
  sourceUrlNames: any[] = [];
  source: string;
  leadSourceList: any[];
  warningMessage: string;
  showSmsModal: any;
  showPreviewSmsEmailModal: any;
  showEmailModal: boolean;
  modalData: { id: any; type: string };
  showPreviewModal: boolean;
  sourceParamFromUrl: any;
  leadStatusList: any = [];
  increaseLineHHeigh: any = 0;
  businessData: any;
  agencyName: any;

  readonly LEAD_MODULE = 'leads';
  readonly APPOINTMENT_MODULE = 'Appointment';
  readonly FORM_MODULE = 'forms';
  readonly PATIENT_MODULE = 'patient';
  preselectedModuleName: string;
  templateModalData: any = {
    moduleName: '',
    triggerType: '',
    templates: []
  };
  showTemplatesModal: boolean = false;
  SOURCES: any = {
    leads: 'Lead',
    appointment: 'Appointment',
    forms: 'Review Forms',
    patient: 'Patient'
  };
  patientSourceList: any[] = [];
  constructor(
    private fb: FormBuilder,
    private landingPageService: LandingPageService,
    private activatedRoute: ActivatedRoute,
    private highLevelService: TriggersService,
    private userService: UserService,
    private router: Router,
    private alertService: ToasTMessageService,
    private questionarieService: QuestionariePageService,
    private leadSourceurlService: LeadSourceurlService,
    private leadService: LeadsService,
    private localStorageService: LocalStorageService,
    private cd: ChangeDetectorRef
  ) {}

  async ngOnInit(): Promise<void> {
    // this.getReviewForms();

    await this.getLeadTags();
    this.sourceParamFromUrl =
      this.activatedRoute.snapshot.queryParams?.source ?? 'leads';
    await this.createTriggerForm();
    this.activatedRoute.params.subscribe(async (data: any) => {
      this.triggerId = data.id;
      this.preselectedModuleName = this.sourceParamFromUrl;

      if (this.triggerId) {
        this.isLastLevel = false;
        this.getSmsTemplate();
        //delaying the trigger data call to fetch all the list of api calls for dropdown,
        // so that selected value can be filtered out and then set in edit mode
        setTimeout(() => {
          this.getTriggerData(this.triggerId);
        }, 100);
      } else {
        this.triggerForm.patchValue({
          moduleName: SOURCE_ENUM[this.sourceParamFromUrl]
        });
      }
    });
    this.activatedRoute.queryParams.subscribe((data) => {
      this.sourceParamFromUrl = data?.source;
    });
    this.getSms_Email_Users();
  }

  noWhitespaceValidator(control: AbstractControl) {
    const folderName = control.value ? control.value.trim() : '';
    if (!folderName) {
      return { required: true };
    }
    return null;
  }
  multipleEmailValidator(value: string = ''): boolean {
    if (!value) {
      return false; // Return false if value is empty
    }
    value = value.trim().replace(/\s+/g, ' ');
    const emails = value.split(/[, ]+/).map((email) => email.trim());
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    for (const email of emails) {
      if (!emailPattern.test(email)) {
        return true; // Return true if any email is invalid
      }
    }

    return false; // Return false if all emails are invalid
  }

  /* ------------------------------ Trigger form ------------------------------ */
  async createTriggerForm() {
    const bdData: any = this.localStorageService.readStorage('businessInfo');
    this.businessData = bdData;
    if (this.businessData) {
      this.agencyName = this.businessData?.agency?.name ?? 'Growth99';
      console.log('Agency Name : ' + this.agencyName);
      if (this.agencyName === 'Smile Virtual+') {
        this.leadSourceList = [
          { label: 'ChatBot', value: 'ChatBot' },
          { label: 'Landing Page', value: 'Landing Page' },
          { label: 'Self Assessment', value: 'Self Assessment' },
          { label: 'Form', value: 'Form' },
          { label: 'Manual', value: 'Manual' },
          { label: 'Facebook', value: 'Facebook' },
          { label: 'Smile Virtual', value: 'Smile Virtual' },
          { label: 'ThirdParty', value: 'ThirdParty' }
          // { label: 'Review Form', value: 'Review Form' }
        ];
      } else {
        this.leadSourceList = [
          { label: 'ChatBot', value: 'ChatBot' },
          { label: 'Landing Page', value: 'Landing Page' },
          { label: 'Self Assessment', value: 'Self Assessment' },
          { label: 'Form', value: 'Form' },
          { label: 'Manual', value: 'Manual' },
          { label: 'Facebook', value: 'Facebook' },
          { label: 'ThirdParty', value: 'ThirdParty' }
          // { label: 'Review Form', value: 'Review Form' }
        ];
      }
    } else {
      this.leadSourceList = [
        { label: 'ChatBot', value: 'ChatBot' },
        { label: 'Landing Page', value: 'Landing Page' },
        { label: 'Self Assessment', value: 'Self Assessment' },
        { label: 'Form', value: 'Form' },
        { label: 'Manual', value: 'Manual' },
        { label: 'Facebook', value: 'Facebook' },
        { label: 'Facebook', value: 'Facebook' },
        { label: 'ThirdParty', value: 'ThirdParty' }
        // { label: 'Review Form', value: 'Review Form' }
      ];
    }

    this.patientSourceList = [
      { label: 'Manual', value: 'Manual' },
      { label: 'Review Form', value: 'Review Form' }
    ];

    this.leadStatusList = [
      'NEW',
      'JUNK',
      'COLD',
      'WARM',
      'HOT',
      'PENDING',
      'WON',
      'DEAD'
    ];
    this.triggerForm = this.fb.group({
      name: ['', [Validators.required, this.noWhitespaceValidator]],
      moduleName: ['leads', [Validators.required]],
      triggeractionName: ['Pending', [Validators.required]],
      triggerConditions: [[]],
      triggerData: this.fb.array([]),
      landingPageNames: [[]],
      forms: [[]],
      convertTo: ['None'],
      sourceUrls: [[]],
      leadTags: [[], []],
      isTriggerForLeadStatus: [LeadStatus.GENERATED],
      selectedLeadTags: [],
      fromLeadStatus: [null],
      toLeadStatus: [null],
      actionIndex: [0, []]
    });

    if (this.sourceParamFromUrl == 'forms') {
      this.triggerForm.controls['triggeractionName'].setValue('Pending');
      this.triggerForm.controls['triggerConditions'].setValue(['Form']);
    }

    // Promise.all([
    //   this.landingPageService.getOptimizedLandingPageNameList(),
    //   this.landingPageService.getWebsiteList()
    // ]).then((response: any) => {
    //   const landingPageNamesList = response[0];

    //   // Filter response[1] based on the 'selectedWebsite' property
    //   const filteredWebsites = response[1].filter(
    //     (website: any) => website.selectedWebsite
    //   );

    //   // Concatenate the filteredWebsites with landingPageNamesList
    //   this.landingPageNamesList = landingPageNamesList.concat(filteredWebsites);
    //   //console.log(this.landingPageNamesList);
    // });
    // if (this.sourceParamFromUrl !== 'forms') {
    //   this.questionarieService.getAllQuestionnaireList().then(
    //     (data: any) => {
    //       this.formList = this.formList.concat(data || []);
    //     },
    //     () => {
    //       // this.toastMessageService.error('Unable to load Questionaires.');
    //     }
    //   );
    //   this.questionarieService.getAllQuestionnaireReviewList('REVIEW').then(
    //     (data: any) => {
    //       this.formList = this.formList.concat(data || []);
    //       // this.reviewFormList = data;
    //     },
    //     () => {
    //       // this.toastMessageService.error('Unable to load Questionaires.');
    //     }
    //   );
    // } else {
    //   this.questionarieService.getAllQuestionnaireReviewList('REVIEW').then(
    //     (data: any) => {
    //       this.formList = this.formList.concat(data || []);
    //       // this.reviewFormList = data;
    //     },
    //     () => {
    //       // this.toastMessageService.error('Unable to load Questionaires.');
    //     }
    //   );
    // }

    // this.leadSourceurlService.list().then(
    //   (data: any) => {
    //     this.sourceUrlList = data;
    //   },
    //   () => {
    //     // this.toastMessageService.error('Unable to load Questionaires.');
    //   }
    // );
    // try {
    //   const pages: any = await Promise.all([
    //     this.landingPageService.getOptimizedLandingPageNameList(),
    //     this.landingPageService.getWebsiteList()
    //   ]);

    //   // Filter websiteList based on the 'selectedWebsite' property
    //   const filteredWebsites = pages[1].filter(
    //     (website: any) => website.selectedWebsite
    //   );

    //   // Concatenate the filteredWebsites with landingPageNamesList
    //   this.landingPageNamesList = pages[0].concat(filteredWebsites);

    //   if (
    //     this.sourceParamFromUrl !== 'forms' &&
    //     this.sourceParamFromUrl != 'patient'
    //   ) {
    //     const [questionnaireList, reviewQuestionnaireList] = await Promise.all([
    //       this.questionarieService.getAllQuestionnaireList(),
    //       this.questionarieService.getAllQuestionnaireReviewList('REVIEW')
    //     ]);
    //     console.log(questionnaireList);
    //     this.formList = this.formList.concat(questionnaireList || []);
    //     this.formList = this.formList.concat(reviewQuestionnaireList || []);
    //   } else {
    //     const reviewQuestionnaireList =
    //       await this.questionarieService.getAllQuestionnaireReviewList(
    //         'REVIEW'
    //       );
    //     this.formList = this.formList.concat(reviewQuestionnaireList || []);
    //   }

    //   this.sourceUrlList = (await this.leadSourceurlService.list()) as any;
    // } catch (error) {
    //   // Handle errors if needed
    // }

    try {
      const pages: any = await Promise.all([
        this.landingPageService.getOptimizedLandingPageNameList(),
        this.landingPageService.getWebsiteList()
      ]);

      // Filter websiteList based on the 'selectedWebsite' property
      const filteredWebsites = pages[1].filter(
        (website: any) => website.selectedWebsite
      );

      // Concatenate the filteredWebsites with landingPageNamesList
      this.landingPageNamesList = pages[0].concat(filteredWebsites);

      if (
        this.sourceParamFromUrl !== 'forms' &&
        this.sourceParamFromUrl != 'patient'
      ) {
        const [questionnaireList, reviewQuestionnaireList] = await Promise.all([
          this.questionarieService.getAllQuestionnaireList(),
          this.questionarieService.getAllQuestionnaireReviewList('REVIEW')
        ]);

        this.formList = this.formList.concat(questionnaireList || []);
        this.formList = this.formList.concat(reviewQuestionnaireList || []);
      } else {
        const reviewQuestionnaireList =
          await this.questionarieService.getAllQuestionnaireReviewList(
            'REVIEW'
          );

        this.formList = this.formList.concat(reviewQuestionnaireList || []);
      }

      // Exclude "ChatBot Form" from formList
      this.formList = this.formList.filter(
        (form: any) => form.name !== 'ChatBot Form'
      );

      this.sourceUrlList = (await this.leadSourceurlService.list()) as any;
    } catch (error) {
      // Handle errors if needed
    }

    this.triggerForm.get('triggerConditions').valueChanges.subscribe(() => {
      this.changeValidators();
      this.changeValidators1();
      this.changeLeadStatusValidators();
    });
    this.triggerForm
      .get('isTriggerForLeadStatus')
      .valueChanges.subscribe(() => {
        this.changeLeadStatusValidators();
      });
  }

  getLeadTags() {
    this.leadService.leadTagList().then((data: any) => {
      if (data) {
        this.leadTagList = data;
      }
    });
  }

  // onChangeLeadTriggerConditions(e?: any) {
  //   if (
  //     !e?.itemValue ||
  //     e?.itemValue === 'Form' ||
  //     e?.itemValue === 'Review Form'
  //   ) {
  //     // this.formList = [];
  //     let formFetched = false;
  //     const promises = [];
  //     if (this.triggerForm.controls.triggerConditions.value.includes('Form')) {
  //       formFetched = true;
  //       promises.push(this.questionarieService.getAllQuestionnaireList());
  //     }
  //     if (
  //       this.triggerForm.controls.triggerConditions.value.includes(
  //         'Review Form'
  //       )
  //     ) {
  //       formFetched = true;
  //       promises.push(
  //         this.questionarieService.getAllQuestionnaireReviewList('REVIEW')
  //       );
  //     }
  //     if (promises.length !== 0) {
  //       Promise.all(promises).then((data) => {
  //         if (formFetched) {
  //           let formList: any[] = [];
  //           formList = formList.concat(data[0] ?? []);
  //           formList = formList.concat(data[1] ?? []);
  //           let selectedForms: any[] = (<FormGroup>this.triggerForm).controls[
  //             'forms'
  //           ].value;
  //           (<FormGroup>this.triggerForm).controls['forms'].value?.forEach(
  //             (formId: any) => {
  //               const idx = formList.findIndex((f) => f.id === formId);
  //               if (idx === -1) {
  //                 selectedForms = selectedForms.filter((s) => s.id !== formId);
  //               }
  //             }
  //           );
  //           if (selectedForms?.length > 0) {
  //             (<FormGroup>this.triggerForm).controls['forms'].setValue(
  //               selectedForms
  //             );
  //           }
  //           if (formList?.length > 0) {
  //             this.formList = formList;
  //           }
  //         }
  //       });
  //     }
  //   }
  // }
  onChangeLeadTriggerConditions(e?: any) {
    if (
      !e?.itemValue ||
      e?.itemValue === 'Form' ||
      e?.itemValue === 'Review Form'
    ) {
      // this.formList = [];
      let formFetched = false;
      const promises = [];
      if (this.triggerForm.controls.triggerConditions.value.includes('Form')) {
        formFetched = true;
        promises.push(this.questionarieService.getAllQuestionnaireList());
      }
      if (
        this.triggerForm.controls.triggerConditions.value.includes(
          'Review Form'
        )
      ) {
        formFetched = true;
        promises.push(
          this.questionarieService.getAllQuestionnaireReviewList('REVIEW')
        );
      }
      if (promises.length !== 0) {
        Promise.all(promises).then((data) => {
          if (formFetched) {
            let formList: any[] = [];
            formList = formList.concat(data[0] ?? []);
            formList = formList.concat(data[1] ?? []);
            let selectedForms: any[] = (<FormGroup>this.triggerForm).controls[
              'forms'
            ].value;
            (<FormGroup>this.triggerForm).controls['forms'].value?.forEach(
              (formId: any) => {
                const idx = formList.findIndex((f) => f.id === formId);
                if (idx === -1) {
                  selectedForms = selectedForms.filter((s) => s.id !== formId);
                }
              }
            );

            // Filter out "ChatBot Form" from formList
            formList = formList.filter((form) => form.name !== 'ChatBot Form');

            if (selectedForms?.length > 0) {
              (<FormGroup>this.triggerForm).controls['forms'].setValue(
                selectedForms
              );
            }
            if (formList?.length > 0) {
              this.formList = formList;
            }
          }
        });
      }
    }
  }

  changeLeadStatusValidators() {
    const isTriggerForLeadStatus = this.triggerForm.get(
      'isTriggerForLeadStatus'
    ).value;

    if (
      this.triggerForm.get('moduleName').value === 'leads' &&
      this.triggerForm.get('isTriggerForLeadStatus').value ===
        LeadStatus.STATUS_CHANGE
    ) {
      this.triggerForm.controls['fromLeadStatus'].setValidators([
        Validators.required
      ]);
      this.triggerForm.controls['toLeadStatus'].setValidators([
        Validators.required
      ]);
    } else {
      this.triggerForm.controls['fromLeadStatus'].clearValidators();
      this.triggerForm.controls['fromLeadStatus'].setValue(null);
      this.triggerForm.controls['toLeadStatus'].clearValidators();
      this.triggerForm.controls['toLeadStatus'].setValue(null);
    }

    if (isTriggerForLeadStatus === LeadStatus.TAGS_CHANGE) {
      this.triggerForm.controls['selectedLeadTags'].setValidators([
        Validators.required,
        Validators.minLength(1)
      ]);
    } else {
      this.triggerForm.controls['selectedLeadTags'].clearValidators();
      this.triggerForm.controls['selectedLeadTags'].setValue([]);
    }

    this.triggerForm.get('fromLeadStatus').updateValueAndValidity();
    this.triggerForm.get('toLeadStatus').updateValueAndValidity();
    this.triggerForm.get('selectedLeadTags').updateValueAndValidity();
  }

  isLeadAllowedToProceedToConditionSelection() {
    const isTriggerForLeadStatus = this.triggerForm.get(
      'isTriggerForLeadStatus'
    ).value;

    if (
      isTriggerForLeadStatus === LeadStatus.STATUS_CHANGE &&
      !(
        this.triggerForm.get('fromLeadStatus').value ||
        this.triggerForm.get('toLeadStatus').value
      )
    ) {
      return false;
    }

    if (
      isTriggerForLeadStatus === LeadStatus.TAGS_CHANGE &&
      (!this.triggerForm.get('selectedLeadTags').value ||
        this.triggerForm.get('selectedLeadTags').value.length === 0)
    ) {
      return false;
    }

    return true;
  }

  changeValidators() {
    if (
      this.triggerForm.get('moduleName').value === 'leads' &&
      this.triggerForm.get('triggerConditions').value &&
      this.triggerForm.get('triggerConditions').value.includes('Landing Page')
    ) {
      this.triggerForm.controls['landingPageNames'].setValidators([
        Validators.required
      ]);
    } else {
      this.triggerForm.controls['landingPageNames'].clearValidators();
      this.triggerForm.controls['landingPageNames'].setValue([]);
    }

    this.triggerForm.get('landingPageNames').updateValueAndValidity();
  }

  changeValidators1() {
    if (
      this.triggerForm.get('moduleName').value === 'leads' &&
      this.triggerForm.get('triggerConditions').value &&
      this.triggerForm.get('triggerConditions').value.includes('Form')
    ) {
      this.triggerForm.controls['forms'].setValidators([Validators.required]);
    } else {
      this.triggerForm.controls['forms'].clearValidators();
    }

    this.triggerForm.get('forms').updateValueAndValidity();
  }

  changeValidators2() {
    if (
      this.triggerForm.get('moduleName').value === 'leads' &&
      this.triggerForm.get('triggerConditions').value &&
      this.triggerForm.get('triggerConditions').value.includes('Facebook')
    ) {
      this.triggerForm.controls['sourceUrls'].setValidators([
        Validators.required
      ]);
    } else {
      this.triggerForm.controls['sourceUrls'].clearValidators();
    }

    this.triggerForm.get('sourceUrls').updateValueAndValidity();
  }

  /* ------------------------- GET DATA BY TRIGGER ID ------------------------- */
  getTriggerData(id: any) {
    this.highLevelService.getTriggerData(id).then((data: any) => {
      /* -------------------------------------------------------------------------- */
      /*        BElOW Logic is to fix the order of condition if they are same       */
      /* -------------------------------------------------------------------------- */
      const triggerObj = data;
      this.triggerData = data;
      let orderOfCondition: number;
      const length = triggerObj.triggerData.length - 1;
      if (length >= 1) {
        triggerObj.triggerData.forEach((item: any) => {
          if (orderOfCondition === item.orderOfCondition) {
            item.orderOfCondition = item.orderOfCondition + 1;
          }
          orderOfCondition = item.orderOfCondition;
        });

        triggerObj.triggerData[length].showBorder = false;
        triggerObj.triggerData[length].addNew = true;
        triggerObj.triggerData[length - 1].showBorder = true;
        triggerObj.triggerData[length - 1].addNew = false;
      }

      if (this.sourceParamFromUrl == 'forms' && data?.moduleName == 'forms') {
        this.triggerForm.controls['triggerConditions'].setValue(['Form']);
      }

      if (triggerObj.moduleName === this.moduleTypeForm) {
        (<FormGroup>this.triggerForm).patchValue(
          {
            triggerConditions: ['Form']
          },
          { emitEvent: false }
        );
        // if (triggerObj.forms) {
        //   this.setForms(triggerObj.forms);
        // }
      }

      if (triggerObj.moduleName === this.PATIENT_MODULE) {
        if (
          triggerObj.triggerConditions &&
          (triggerObj.triggerConditions.includes('Form') ||
            triggerObj.triggerConditions.includes('Review Form'))
        ) {
          if (triggerObj.forms) {
            // this.setForms(triggerObj.forms);
            this.changeValidators1();
          }
        }
      }

      if (triggerObj.moduleName === 'leads') {
        this.setLeadTags(triggerObj.selectedLeadTags);
      }
      /* -------------------------------------------------------------------------- */
      /*                  Above logic was to fix order of condition                 */
      /* -------------------------------------------------------------------------- */
      console.log(triggerObj);
      this.triggerOpen = false;
      if (
        triggerObj.moduleName === 'leads' &&
        triggerObj.triggerConditions &&
        triggerObj.triggerConditions.includes('Landing Page')
      ) {
        // this.setLandingPageNames(triggerObj.landingPages);
        this.changeValidators();
      } else if (
        triggerObj.moduleName === 'leads' &&
        triggerObj.triggerActionName == 'Landing Page'
      ) {
        //this.source = triggerObj.triggerActionName;
        console.log('trigger');
        // this.setLandingPageNames(triggerObj.landingPages);
        this.changeValidators();
      }

      if (
        triggerObj.moduleName === 'leads' &&
        triggerObj.triggerConditions &&
        (triggerObj.triggerConditions.includes('Form') ||
          triggerObj.triggerConditions.includes('Review Form'))
      ) {
        if (triggerObj.forms) {
          // this.setForms(triggerObj.forms);
          this.changeValidators1();
        }
      } else if (
        triggerObj.moduleName === 'leads' &&
        triggerObj.triggerActionName == 'Form'
      ) {
        //this.source = triggerObj.triggerActionName;
        if (triggerObj.forms) {
          // this.setForms(triggerObj.forms);
          this.changeValidators1();
        }
      }

      if (
        triggerObj.moduleName === 'leads' &&
        triggerObj.triggerConditions &&
        triggerObj.triggerConditions.includes('Facebook')
      ) {
        if (triggerObj.sourceUrls) {
          this.setSourceUrls(triggerObj.sourceUrls);
          this.changeValidators2();
        }
      } else if (
        triggerObj.moduleName === 'leads' &&
        triggerObj.triggerActionName == 'Facebook'
      ) {
        //this.source = triggerObj.triggerActionName;
        if (triggerObj.sourceUrls) {
          this.setSourceUrls(triggerObj.sourceUrls);
          this.changeValidators2();
        }
      }
      if (triggerObj.moduleName === 'leads' && triggerObj.triggerActionName) {
        this.warningMessage = `This trigger is deprecated hence you will not be able to make any changes. The trigger is currently working but you can not modify it, If you have a need of modify this trigger then please create a new trigger instead and disable this trigger.`;
      }

      console.log(
        this.landingPageNamesList,
        triggerObj.landingPages,
        triggerObj.forms,
        this.formList
      );
      // console.log(triggerObj.forms);
      const filteredFormId = filterElementFromKey(
        this.formList,
        triggerObj.forms,
        'id'
      );

      const filterLp = filterElementFromKey(
        this.landingPageNamesList,
        triggerObj.landingPages,
        'id'
      );

      console.log(filterLp);

      this.triggerForm.patchValue({
        name: triggerObj.name,
        moduleName: triggerObj.moduleName,
        triggeractionName:
          triggerObj.triggerActionName === ''
            ? 'Pending'
            : triggerObj.triggerActionName,
        landingPageNames: filterLp,
        forms: filteredFormId,
        convertTo: triggerObj?.convertTo,
        triggerConditions: triggerObj.triggerConditions,
        sourceUrls: this.sourceUrlNames,
        isTriggerForLeadStatus:
          triggerObj.isTriggerForLeadStatus ?? LeadStatus.GENERATED,
        fromLeadStatus: triggerObj.fromLeadStatus,
        toLeadStatus: triggerObj.toLeadStatus,
        actionIndex: triggerObj.moduleName === 'leads' ? 1 : 0
      });

      if (this.triggerData?.moduleName === 'leads') {
        this.setLeadTags(this.triggerData?.selectedLeadTags);
      }
      this.showBorder = true;
      this.actionIndex = 2;
      const triggerDataArray = this.triggerForm.controls
        .triggerData as FormArray;
      triggerDataArray.removeAt(0);
      if (
        triggerObj.triggerData.length == 0 &&
        triggerObj.moduleName == 'leads'
      ) {
        triggerObj.triggerData.push({
          actionIndex: 4,
          addNew: true,
          triggerTemplate: 0,
          triggerType: 'SMS',
          triggerTarget: 'lead',
          triggerTime: 30,
          triggerFrequency: 'MIN',
          deadline: new Date(),
          showBorder: false,
          taskName: '',
          taskDescription: '',
          triggerTaskPriority: '',
          orderOfCondition: 0,
          timerType: 'Frequency',
          startTime: this.defaultStartTime,
          endTime: this.defaultEndTime,
          customEmail: ''
        });
      } else if (
        triggerObj.triggerData.length == 0 &&
        triggerObj.moduleName == 'Appointment'
      ) {
        triggerObj.triggerData.push({
          actionIndex: 4,
          addNew: true,
          triggerTemplate: 0,
          // this.fb.control({value: 0, disabled: true}),
          triggerType: 'SMS',
          triggerTarget: 'AppointmentPatient',
          triggerTime: 30,
          triggerFrequency: 'MIN',
          deadline: new Date(),
          showBorder: false,
          taskName: '',
          taskDescription: '',
          triggerTaskPriority: '',
          orderOfCondition: 0,
          customEmail: ''
        });
      } else if (
        triggerObj.triggerData.length == 0 &&
        triggerObj.moduleName == 'patient'
      ) {
        triggerObj.triggerData.push({
          actionIndex: 4,
          addNew: true,
          triggerTemplate: 0,
          // this.fb.control({value: 0, disabled: true}),
          triggerType: 'SMS',
          triggerTarget: 'patient',
          triggerTime: 30,
          triggerFrequency: 'MIN',
          deadline: new Date(),
          showBorder: false,
          taskName: '',
          taskDescription: '',
          triggerTaskPriority: '',
          orderOfCondition: 0,
          customEmail: ''
        });
      }
      triggerObj.triggerData.forEach((item: any, index: any) => {
        triggerDataArray.push(
          this.fb?.group({
            actionIndex: item.actionIndex,
            addNew: item.addNew,
            triggerTemplate: item.triggerTemplate,
            triggerType: item.triggerType,
            triggerTime:
              item.triggerTime < 0 ? item.triggerTime * -1 : item.triggerTime,
            triggerTarget: item.triggerTarget ? item.triggerTarget : 'lead',
            triggerFrequency: item.triggerFrequency,
            deadline: item.deadline,
            showBorder: item.showBorder,
            convertTo: item?.convertTo,
            taskName: item.taskName ? item.taskName : '',
            taskDescription: item.taskDescription ? item.taskDescription : '',
            triggerTaskPriority: item.triggerTaskPriority
              ? item.triggerTaskPriority
              : '',
            orderOfCondition: item.orderOfCondition
              ? item.orderOfCondition
              : index,
            dateType: item.dateType ? item.dateType : 'NA',
            timerType: item.timerType ? item.timerType : 'Frequency',
            startTime:
              item.startTime && item.timerType === 'Range'
                ? moment(item.startTime.replace(/\-/g, '/')).toDate()
                : this.defaultStartTime,
            endTime:
              item.endTime && item.timerType === 'Range'
                ? moment(item.endTime.replace(/\-/g, '/')).toDate()
                : this.defaultEndTime,
            customEmail: item.customEmail
          })
        );

        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        (<FormGroup>controlArray?.controls[index])?.controls[
          'taskName'
        ].setValidators([Validators.required]);
        (<FormGroup>controlArray?.controls[index])?.updateValueAndValidity();
        console.log(controlArray);
      });
    });
  }

  convertToArray(data: any) {
    const arr = data.split(',');
    var uniqueObjectsArray = arr.map((name: any) => ({ id: name, name: name }));
    console.log(uniqueObjectsArray);
    return uniqueObjectsArray;
  }

  /* -------------------------- Get SMS TEMPLATE LIST ------------------------- */
  getSmsTemplate(id?: any, templateId?: any) {
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    if (this.triggerForm.value.triggerData[id]) {
      if (this.triggerForm.value.triggerData[id].triggerTarget == 'Clinic') {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.clinicSmsTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget == 'lead'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.leadSmsTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget == 'patientClinic'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.patientClinicSmsTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget == 'patient'
      ) {
        if (this.patientSmsTemplate.length > 0) {
          controlArray.controls[id].patchValue({
            triggerTemplate: templateId ?? this.patientSmsTemplate[0].id
          });
        }
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget ==
        'AppointmentPatient'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate:
            templateId ?? this.appointmentPatientSMSTemplate[0]?.id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget ==
        'AppointmentClinic'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.appointmentClinicSMSTemplate[0].id
        });
      }
    }
  }

  /* ------------------------ GET SMS AND EMAIL BY USER ----------------------- */
  getSms_Email_Users() {
    this.leadSmsTemplate = [];
    this.clinicSmsTemplate = [];
    this.leadEmailTemplate = [];
    this.clinicEmailTemplate = [];

    this.highLevelService.getEmail_Sms_Users_Data().then((data: any) => {
      //console.log(data)
      this.smsTemplate = data.smsTemplateDTOList;
      this.emailTemplates = data.emailTemplateDTOList;
      this.users = data.userDTOList;
      data.smsTemplateDTOList.map((item: any) => {
        if (item.smsTarget == 'Lead' && item.templateFor == 'Lead') {
          this.leadSmsTemplate.push(item);
        } else if (
          item.smsTarget == 'Patient' &&
          item.templateFor == 'Patient'
        ) {
          this.patientSmsTemplate.push(item);
        } else if (item.smsTarget == 'Clinic' && item.templateFor == 'Lead') {
          this.clinicSmsTemplate.push(item);
        } else if (
          item.smsTarget == 'Clinic' &&
          item.templateFor == 'Patient'
        ) {
          this.patientClinicSmsTemplate.push(item);
        } else if (
          item.smsTarget == 'Patient' &&
          item.templateFor == 'Appointment'
        ) {
          this.appointmentPatientSMSTemplate.push(item);
        } else if (
          item.smsTarget == 'Clinic' &&
          item.templateFor == 'Appointment'
        ) {
          this.appointmentClinicSMSTemplate.push(item);
        }
      });

      data.emailTemplateDTOList.map((item: any) => {
        if (item.emailTarget == 'Lead' && item.templateFor == 'Lead') {
          this.leadEmailTemplate.push(item);
        } else if (item.emailTarget == 'Clinic' && item.templateFor == 'Lead') {
          this.clinicEmailTemplate.push(item);
        }
        if (item.emailTarget == 'Patient' && item.templateFor == 'Patient') {
          this.patientEmailTemplate.push(item);
        } else if (
          item.emailTarget == 'Clinic' &&
          item.templateFor == 'Patient'
        ) {
          this.patientClinicEmailTemplate.push(item);
        } else if (
          item.emailTarget == 'Patient' &&
          item.templateFor == 'Appointment'
        ) {
          this.appointmentPatientEmailTemplate.push(item);
        } else if (
          item.emailTarget == 'Clinic' &&
          item.templateFor == 'Appointment'
        ) {
          this.appointmentClinicEmailTemplate.push(item);
        }
      });
    });
  }

  /* -------------------------- LANFING PAGE NAME SET ------------------------- */
  // setLandingPageNames(lpNames: any) {
  //   const landingPageNames: any[] = [];
  //   lpNames.forEach((e1: any) => {
  //     this.landingPageNamesList.forEach((e2) => {
  //       if (e1 === e2.id) landingPageNames.push({ id: e2.id, name: e2.name });
  //     });
  //   });
  //   this.landingPageNames = landingPageNames;
  // }

  setLeadTags(tags: any[]) {
    console.log('tas', tags, this.leadTagList);
    if (tags != null && this.leadTagList.length > 0) {
      // this.handleActionOptions('showleadTags', true);
      // Extract the IDs of the selected tags
      const selectedTagIds = this.leadTagList
        .filter((tag: any) => tags.includes(tag.id))
        .map((tag: any) => tag.id);

      console.log(selectedTagIds);
      // Patch the form value with the selected tag IDs
      this.triggerForm.patchValue({
        selectedLeadTags: selectedTagIds
      });

      console.log(this.triggerForm.value);
      this.cd.detectChanges(); // Trigger change detection
    }
  }

  // setReviewForm(forms: any[]) {
  //   if (forms != null && this.reviewFormList.length > 0) {
  //     this.formNames = this.reviewFormList.filter((e2: any) =>
  //       forms.includes(e2.id)
  //     );
  //     this.triggerForm.patchValue({
  //       forms: this.formNames
  //     });
  //   }
  // }

  // setForms(lpNames: any) {
  //   const formNames: any[] = [];
  //   lpNames.forEach((e1: any) => {
  //     this.formList.forEach((e2) => {
  //       if (e1 === e2.id) formNames.push({ id: e2.id, name: e2.name });
  //     });
  //   });
  //   this.formNames = formNames;
  // }

  // setFormsReview(lpNames: any) {
  //   const formNames: any[] = [];
  //   lpNames.forEach((e1: any) => {
  //     this.reviewFormList.forEach((e2) => {
  //       if (e1 === e2.id) formNames.push({ id: e2.id, name: e2.name });
  //     });
  //   });
  //   this.formNames = formNames;
  // }

  setSourceUrls(lpNames: any) {
    console.log(lpNames);
    const sourceUrlNames: any[] = [];
    lpNames.forEach((e1: any) => {
      this.sourceUrlList.forEach((e2) => {
        if (e1 === e2.id)
          sourceUrlNames.push({ id: e2.id, sourceUrl: e2.sourceUrl });
      });
    });
    this.sourceUrlNames = sourceUrlNames;
    console.log(this.sourceUrlNames);
  }

  createTrigger() {
    this.triggerOpen = false;
  }

  goTo(actionIndex: any, triggerIndex?: any) {
    if (actionIndex == 1 && triggerIndex != undefined) {
      this.triggerForm.controls['actionIndex'].value = triggerIndex;
    } else if (actionIndex == 2) {
      let dateType = '';
      let triggerTarget = '';
      if (
        this.triggerForm.value.moduleName == 'leads' ||
        this.triggerForm.value.moduleName == this.moduleTypeForm
      ) {
        dateType = 'NA';
        triggerTarget = 'lead';
      } else if (this.triggerForm.value.moduleName == 'Appointment') {
        dateType = 'APPOINTMENT_CREATED';
        triggerTarget = 'AppointmentPatient';
      } else if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
        dateType = 'NA';
        triggerTarget = 'patient';
      }
      this.showBorder = true;
      const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
      controlArray.clear();
      controlArray.push(
        this.fb.group({
          actionIndex: 3,
          addNew: true,
          triggerTemplate: 0,
          triggerType: 'SMS',
          triggerTarget: triggerTarget,
          triggerTime: '30',
          triggerFrequency: 'MIN',
          taskName: '',
          taskDescription: '',
          triggerTaskPriority: '',
          showBorder: false,
          orderOfCondition: 0,
          dateType: dateType,
          timerType: 'Frequency',
          startTime: this.defaultStartTime,
          endTime: this.defaultEndTime,
          customEmail: ''
        })
      );
      this.isLastLevel = false;
      this.getSmsTemplate(0);
    } else if (actionIndex == 3 || actionIndex == 4) {
      this.isLastLevel = false;
      if (
        this.triggerForm.value.moduleName == 'leads' ||
        this.triggerForm.value.moduleName == this.moduleTypeForm
      ) {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        controlArray.controls[triggerIndex].patchValue({
          actionIndex: actionIndex,
          addNew: true
        });
      } else if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        controlArray.controls[triggerIndex].patchValue({
          actionIndex: actionIndex,
          addNew: true
        });
      } else if (this.triggerForm.value.moduleName == 'Appointment') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        controlArray.controls[triggerIndex].patchValue({
          actionIndex: actionIndex,
          addNew: true,
          dateType: 'APPOINTMENT_CREATED'
        });
      }
    } else if (actionIndex == 4) {
      console.log('here');

      const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
      controlArray.controls[triggerIndex].patchValue({
        actionIndex: actionIndex,
        addNew: true
      });
    }
    //console.log("actionIndex,triggerIndex", actionIndex, triggerIndex)
    this.actionIndex = actionIndex;
    //console.log(this.triggerForm.value, this.actionIndex, this.showBorder, actionIndex)
    this.scrollDiv();
    // console.log(this.triggerData)
  }

  CancelLeadsFrom(index: any) {
    this.actionIndex = index;
    this.removeTriggerData(this.actionIndex, 0);
    if (this.preselectedModuleName && index == 0) {
      this.goTo(-1);
    }
  }

  scrollDiv() {
    var $target = $('html,body');
    $target.animate({ scrollTop: $(document).height() }, 1000);
  }

  cancel(actionIndex: any, indexPosition?: any) {
    this.actionIndex = actionIndex;

    // this.triggerData[indexPosition].actionIndex = actionIndex
    console.log('indexPosition', indexPosition);

    if (indexPosition == 0) {
      this.actionIndex = 1;
      const data: any = {};
      data.leadType = null;
      data.addNew = false;
      data.showBorder = false;
      this.showBorder = false;
      const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
      controlArray.controls[indexPosition].patchValue({
        actionIndex: 0,
        addNew: true,
        triggerTemplate: 0,
        triggerType: 'SMS',
        triggerTarget: 'lead',
        triggerTime: 30,
        triggerFrequency: 'MIN',
        deadline: new Date(),
        showBorder: false,
        taskName: '',
        taskDescription: '',
        triggerTaskPriority: '',
        orderOfCondition: 0,
        timerType: 'Frequency',
        startTime: this.defaultStartTime,
        endTime: this.defaultEndTime,
        customEmail: ''
      });
      console.log(this.triggerForm.value);
    } else {
      let olderData = this.triggerForm.value.triggerData;
      const length = olderData.length;

      olderData = olderData[indexPosition - 1];
      console.log(olderData);
      const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
      if (indexPosition > 0) {
        controlArray.controls[indexPosition - 1].patchValue({
          actionIndex: olderData.actionIndex,
          addNew: length == 2 ? true : olderData.addNew,
          triggerTemplate: olderData.triggerTemplate,
          triggerType: olderData.triggerType,
          triggerTarget: olderData.triggerTarget
            ? olderData.triggerTarget
            : 'lead',
          triggerTime: olderData.triggerTime,
          triggerFrequency: olderData.triggerFrequency,
          deadline: new Date(),
          showBorder: false,
          taskName: olderData.taskName,
          taskDescription: olderData.taskDescription,
          triggerTaskPriority: olderData.triggerTaskPriority,
          orderOfCondition: olderData.orderOfCondition
            ? olderData.orderOfCondition
            : indexPosition,
          timerType: olderData.timerType ? olderData.timerType : 'Frequency',
          startTime: olderData.startTime
            ? moment(olderData.startTime.replace(/\-/g, '/')).toDate()
            : this.defaultStartTime,
          endTime: olderData.endTime
            ? moment(olderData.endTime.replace(/\-/g, '/')).toDate()
            : this.defaultEndTime,
          customEmail: olderData.customEmail
        });
      }

      const triggerDataArray = this.triggerForm.controls
        .triggerData as FormArray;
      triggerDataArray.removeAt(indexPosition);
      console.log(this.triggerForm.value, controlArray);
    }
  }

  removeTriggerData(actionIndex: number, indexPosition: number) {
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    //console.log(controlArray)
    const olderData = this.triggerForm.value.triggerData;
    const length = olderData.length;
    //console.log(length);
    if (length == 1 && indexPosition == 0) {
      this.isLastLevel = true;
      const previousData = olderData[indexPosition];
      //console.log(controlArray)
      controlArray.controls[0].patchValue({
        actionIndex: 2,
        addNew: true,
        triggerTemplate: previousData.triggerTemplate,
        triggerType: previousData.triggerType,
        triggerTime: previousData.triggerTime,
        triggerTarget: previousData.triggerTarget
          ? previousData.triggerTarget
          : 'lead',
        triggerFrequency: previousData.triggerFrequency,
        deadline: new Date(),
        showBorder: false,
        taskName: previousData.taskName,
        taskDescription: previousData.taskDescription,
        triggerTaskPriority: previousData.triggerTaskPriority,
        orderOfCondition: previousData.orderOfCondition
          ? previousData.orderOfCondition
          : indexPosition,
        timerType: previousData.timerType
          ? previousData.timerType
          : 'Frequency',
        startTime:
          previousData.startTime && typeof previousData.startTime === 'string'
            ? moment(previousData.startTime?.replace(/\-/g, '/')).toDate()
            : this.defaultStartTime,
        endTime:
          previousData.endTime && typeof previousData.endTime === 'string'
            ? moment(previousData.endTime?.replace(/\-/g, '/')).toDate()
            : this.defaultEndTime,

        customEmail: previousData.customEmail
      });
      this.actionIndex = actionIndex;
    } else {
      controlArray.removeAt(indexPosition);
      if (controlArray.controls.length > 0) {
        //if(length>1 && indexPosition==length-1 )
        controlArray.controls[controlArray.controls.length - 1].patchValue({
          addNew: true,
          showBorder: false
        });
        if (
          controlArray.controls[controlArray.controls.length - 1].value
            .actionIndex > 2
        ) {
          this.isLastLevel = false;
        } else {
          this.isLastLevel = true;
        }
      }
    }

    //console.log(indexPosition, length)
  }

  cancelTrigger() {
    this.router.navigate(['/triggers'], {
      queryParams: {
        source: this.sourceParamFromUrl
      },
      queryParamsHandling: 'merge'
    });
    // this.leadType = null
  }

  setModuleName() {
    //this.actionObj = {};
    //console.log(this.triggerForm.value, this.triggerForm.value.moduleName)
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    controlArray.clear();
    this.actionIndex = 0;
    console.log(this.triggerForm);
    if (this.triggerForm.value.moduleName == 'Appointment') {
      this.triggerForm.controls['triggeractionName'].setValue('Pending');
    } else if (this.triggerForm.value.moduleName == 'leads') {
      this.triggerForm.controls['triggeractionName'].setValue('Pending');
      this.triggerForm.controls['triggerConditions'].setValue([]);
      this.triggerForm.controls['landingPageNames'].setValue([]);
      this.handleShowHideActionOnEditTrigger();
    } else if (this.triggerForm.value.moduleName == this.moduleTypeForm) {
      this.triggerForm.controls['triggeractionName'].setValue('Pending');
      this.triggerForm.controls['triggerConditions'].setValue(['Form']);
    }
    console.log(this.triggerForm);
  }

  // getReviewForms() {
  //   this.questionarieService.getAllQuestionnaireReviewList('REVIEW').then(
  //     (data: any) => {
  //       this.reviewFormList = data;
  //       this.setForms(this.triggerData?.forms);
  //     },
  //     () => {
  //       // this.toastMessageService.error('Unable to load Questionaires.');
  //     }
  //   );
  // }

  handleShowHideActionOnEditTrigger() {
    //this.actionObj.showleadTags = true;
  }

  SetleadType(leadType: string, indexPosition: any) {
    if (leadType == 'TASK') {
      // console.log(
      //   'taskname',
      //   this.triggerForm.value.triggerData[indexPosition].taskName
      // );
      // const taskNameVal =
      //   this.triggerForm.value.triggerData[indexPosition].taskName;
      // if (taskNameVal === '') {
      //   this.taskNameValidation = true;
      // } else {
      //   this.taskNameValidation = false;
      // }
      const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'taskName'
      ].setValidators(Validators.required);
      // (<FormGroup>controlArray.controls[indexPosition]).controls[
      //   'taskDescription'
      // ].setValidators(Validators.required);
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'triggerTaskPriority'
      ].setValidators(Validators.required);
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'triggerTemplate'
      ].setValidators(Validators.required);
      if (!this.users || this.users.length == 0) {
        this.userService.getAllUsers().then((user: any) => {
          this.users = user;
          // console.log(user);

          controlArray.controls[indexPosition].patchValue({
            triggerTemplate: '',
            deadline: new Date()
          });
        });
      } else {
        controlArray.controls[indexPosition].patchValue({
          triggerTemplate: '',
          deadline: new Date()
        });
      }
    } else {
      const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'taskName'
      ].removeValidators(Validators.required);
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'taskName'
      ].setErrors(null);
      // (<FormGroup>controlArray.controls[indexPosition]).controls[
      //   'taskDescription'
      // ].removeValidators(Validators.required);
      // (<FormGroup>controlArray.controls[indexPosition]).controls[
      //   'taskDescription'
      // ].setErrors(null);
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'triggerTaskPriority'
      ].removeValidators(Validators.required);
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'triggerTaskPriority'
      ].setErrors(null);
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'triggerTemplate'
      ].removeValidators(Validators.required);
      (<FormGroup>controlArray.controls[indexPosition]).controls[
        'triggerTemplate'
      ].setErrors(null);
      (<FormGroup>(
        controlArray.controls[indexPosition]
      )).updateValueAndValidity();
    }
    if (leadType == 'EMAIL') {
      this.taskNameValid = false;
      this.getEmailTemplates(indexPosition);
    }

    if (leadType == 'SMS') {
      this.taskNameValid = false;
      this.getSmsTemplate(indexPosition);
    }
  }

  getEmailTemplates(id?: any, templateId?: any) {
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    if (this.triggerForm.value.triggerData[id]) {
      if (
        this.triggerForm.value.triggerData[id].triggerTarget == 'Clinic' ||
        this.triggerForm.value.triggerData[id].triggerTarget == 'custom'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.clinicEmailTemplate[0]?.id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget == 'lead'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.leadEmailTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget ==
        'AppointmentPatient'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate:
            templateId ?? this.appointmentPatientEmailTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget ==
          'AppointmentClinic' ||
        this.triggerForm.value.triggerData[id].triggerTarget ==
          'AppointmentCustom'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate:
            templateId ?? this.appointmentClinicEmailTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget == 'patientClinic'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.patientClinicEmailTemplate[0].id
        });
      } else if (
        this.triggerForm.value.triggerData[id].triggerTarget == 'patient'
      ) {
        controlArray.controls[id].patchValue({
          triggerTemplate: templateId ?? this.patientEmailTemplate[0].id
        });
      }
    }
  }

  /* -------------------------- Changinh trigger type ------------------------- */
  changeTriggerType(event: any, triggerType: any, id: any) {
    const value = event?.target?.value;
    console.log(value, triggerType, id);
    if (triggerType == 'EMAIL') {
      if (value == 'Clinic' || value == 'custom') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        controlArray.controls[id].patchValue({
          triggerTemplate: this.clinicEmailTemplate[0].id
        });
      } else if (value == 'lead') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        controlArray.controls[id].patchValue({
          triggerTemplate: this.leadEmailTemplate[0].id
        });
      } else if (value == 'patient') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        if (this.patientEmailTemplate.length > 0) {
          controlArray.controls[id].patchValue({
            triggerTemplate: this.patientEmailTemplate[0].id
          });
        } else {
          controlArray.controls[id].patchValue({
            triggerTemplate: ''
          });
        }
      } else if (value == 'patientClinic') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        if (this.patientClinicEmailTemplate.length > 0) {
          controlArray.controls[id].patchValue({
            triggerTemplate: this.patientClinicEmailTemplate[0].id
          });
        } else {
          controlArray.controls[id].patchValue({
            triggerTemplate: ''
          });
        }
      }
      if (value == 'AppointmentClinic') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        controlArray.controls[id].patchValue({
          triggerTemplate: this.appointmentClinicEmailTemplate[0].id
        });
      } else if (value == 'AppointmentPatient') {
        console.log(this.appointmentPatientEmailTemplate);
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        controlArray.controls[id].patchValue({
          triggerTemplate: this.appointmentPatientEmailTemplate[0].id
        });
      }
    }
    if (triggerType == 'SMS') {
      if (value == 'Clinic') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        controlArray.controls[id].patchValue({
          triggerTemplate: this.clinicSmsTemplate[0].id
        });
      } else if (value == 'lead') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        controlArray.controls[id].patchValue({
          triggerTemplate: this.leadSmsTemplate[0].id
        });
      } else if (value == 'patient') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        if (this.patientSmsTemplate.length > 0) {
          controlArray.controls[id].patchValue({
            triggerTemplate: this.patientSmsTemplate[0].id
          });
        } else {
          controlArray.controls[id].patchValue({
            triggerTemplate: ''
          });
        }
      } else if (value == 'patientClinic') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        if (this.patientClinicSmsTemplate.length > 0) {
          controlArray.controls[id].patchValue({
            triggerTemplate: this.patientClinicSmsTemplate[0].id
          });
        } else {
          controlArray.controls[id].patchValue({
            triggerTemplate: ''
          });
        }
      } else if (value == 'AppointmentClinic') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        controlArray.controls[id].patchValue({
          triggerTemplate: this.appointmentClinicSMSTemplate[0].id
        });
      } else if (value == 'AppointmentPatient') {
        const controlArray = <FormArray>(
          this.triggerForm.controls['triggerData']
        );
        console.log(controlArray.controls[id]);
        controlArray.controls[id].patchValue({
          triggerTemplate: this.appointmentPatientSMSTemplate[0].id
        });
      }
    }
  }

  addCondition(index: any) {
    this.isLastLevel = true;
    this.orderCount = this.orderCount + 1;
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    controlArray.controls[index].patchValue({
      addNew: false,
      showBorder: true
    });
    if (this.triggerForm.value.moduleName == 'leads') {
      this.createTriggerDataFormArray();
    } else if (this.triggerForm.value.moduleName == this.moduleTypeForm) {
      this.createTriggerDataFormTypeFormArray();
    } else if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
      this.createTriggerPatientDataArray();
    } else {
      this.createAppointmentTriggerData();
    }

    console.log('orderCount', this.orderCount);
    this.scrollDiv();
    this.goTo(3, index + 1);
  }

  createTriggerDataFormArray() {
    //console.log(this.smsTemplate)
    const length = this.triggerForm.value.triggerData.length;
    console.log(length);
    const triggerDataArray = this.triggerForm.controls.triggerData as FormArray;
    triggerDataArray.push(
      this.fb.group({
        actionIndex: 0,
        addNew: false,
        triggerTemplate:
          this.leadSmsTemplate.length > 0 ? this.leadSmsTemplate[0]?.id : [],
        triggerType: 'SMS',
        triggerTarget: 'lead',
        triggerTime: 30,
        triggerFrequency: 'MIN',
        deadline: new Date(),
        showBorder: false,
        taskName: '',
        taskDescription: '',
        triggerTaskPriority: '',
        orderOfCondition: length + 1,
        dateType: 'NA',
        timerType: 'Frequency',
        startTime: this.defaultStartTime,
        endTime: this.defaultEndTime,
        customEmail: ''
      })
    );
  }

  createTriggerPatientDataArray() {
    //console.log(this.smsTemplate)
    const length = this.triggerForm.value.triggerData.length;
    console.log(length);
    const triggerDataArray = this.triggerForm.controls.triggerData as FormArray;
    triggerDataArray.push(
      this.fb.group({
        actionIndex: 0,
        addNew: false,
        triggerTemplate:
          this.patientSmsTemplate.length > 0
            ? this.patientSmsTemplate[0]?.id
            : [],
        triggerType: 'SMS',
        triggerTarget: 'patient',
        triggerTime: 30,
        triggerFrequency: 'MIN',
        deadline: new Date(),
        showBorder: false,
        taskName: '',
        taskDescription: '',
        triggerTaskPriority: '',
        orderOfCondition: length + 1,
        dateType: 'NA',
        timerType: 'Frequency',
        startTime: this.defaultStartTime,
        endTime: this.defaultEndTime,
        customEmail: ''
      })
    );
  }

  createTriggerDataFormTypeFormArray() {
    //console.log(this.smsTemplate)
    const length = this.triggerForm.value.triggerData.length;
    console.log(length);
    const triggerDataArray = this.triggerForm.controls.triggerData as FormArray;
    triggerDataArray.push(
      this.fb.group({
        actionIndex: 0,
        addNew: false,
        triggerTemplate:
          this.leadSmsTemplate.length > 0 ? this.leadSmsTemplate[0]?.id : [],
        triggerType: 'SMS',
        triggerTarget: 'lead',
        triggerTime: 30,
        triggerFrequency: 'MIN',
        deadline: new Date(),
        showBorder: false,
        taskName: '',
        taskDescription: '',
        triggerTaskPriority: '',
        orderOfCondition: length + 1,
        dateType: 'NA',
        timerType: 'Frequency',
        startTime: this.defaultStartTime,
        endTime: this.defaultEndTime,
        customEmail: ''
      })
    );
  }

  createAppointmentTriggerData() {
    //console.log(this.smsTemplate)
    const length = this.triggerForm.value.triggerData.length;
    console.log(length);
    const triggerDataArray = this.triggerForm.controls.triggerData as FormArray;
    triggerDataArray.push(
      this.fb.group({
        actionIndex: 0,
        addNew: false,
        triggerTemplate:
          this.appointmentPatientSMSTemplate.length > 0
            ? this.appointmentPatientSMSTemplate[0]?.id
            : [],
        triggerType: 'SMS',
        triggerTarget: 'AppointmentPatient',
        triggerTime: 30,
        triggerFrequency: 'MIN',
        deadline: new Date(),
        showBorder: false,
        taskName: '',
        taskDescription: '',
        triggerTaskPriority: '',
        orderOfCondition: length + 1,
        dateType: 'NA',
        timerType: 'Frequency',
        customEmail: ''
      })
    );
  }

  submitTrigger() {
    console.log(JSON.stringify(this.triggerForm.value));
    if (this.triggerForm.invalid) {
      this.checkInvalidControls();
    } else {
      if (this.triggerId) {
        if (
          this.triggerForm.value.moduleName == 'leads' ||
          this.triggerForm.value.moduleName == this.moduleTypeForm ||
          this.triggerForm.value.moduleName == this.PATIENT_MODULE
        ) {
          const formData = this.triggerForm.value;
          formData.triggerData?.forEach((condition: any) => {
            if (condition.timerType == 'Range') {
              condition.startTime = moment(condition.startTime)
                .format(this.dateFormatSlash)
                .replace(/\//g, '-');
              condition.endTime = moment(condition.endTime)
                .format(this.dateFormatSlash)
                .replace(/\//g, '-');
              condition.triggerTime = 0;
              condition.triggerFrequency = 'MIN';
            }
          });
          this.highLevelService.updateTrigger(formData, this.triggerId).then(
            () => {
              //console.log(data)
              this.alertService.success('Trigger Updated successfully');
              this.router.navigate(['triggers'], {
                queryParams: {
                  source: this.sourceParamFromUrl
                },
                queryParamsHandling: 'merge'
              });
            },
            (e: any) => {
              console.log(e);
              this.alertService.error('Not able to Update');
              this.router.navigate(['triggers'], {
                queryParams: {
                  source: this.sourceParamFromUrl
                },
                queryParamsHandling: 'merge'
              });
            }
          );
        } else if (this.triggerForm.value.moduleName == 'Appointment') {
          const formData = this.triggerForm.value;
          this.highLevelService
            .updateAppointmentTrigger(formData, this.triggerId)
            .then(
              () => {
                this.alertService.success('Trigger Updated successfully');
                this.router.navigate(['triggers'], {
                  queryParams: {
                    source: this.sourceParamFromUrl
                  },
                  queryParamsHandling: 'merge'
                });
              },
              (e: any) => {
                console.log(e);
                this.alertService.error('Not able to Update');
                this.router.navigate(['triggers'], {
                  queryParams: {
                    source: this.sourceParamFromUrl
                  },
                  queryParamsHandling: 'merge'
                });
              }
            );
        }
      } else if (this.triggerForm.value.moduleName == 'leads') {
        const formData = this.triggerForm.value;
        formData.triggerData?.forEach((condition: any) => {
          if (condition.timerType == 'Range') {
            condition.startTime = moment(condition.startTime)
              .format(this.dateFormatSlash)
              .replace(/\//g, '-');
            condition.endTime = moment(condition.endTime)
              .format(this.dateFormatSlash)
              .replace(/\//g, '-');
            condition.triggerTime = 0;
            condition.triggerFrequency = 'MIN';
          }
        });
        this.highLevelService.createTrigger(formData).then(
          () => {
            console.log();
            this.alertService.success('Trigger created successfully');
            this.router.navigate(['triggers'], {
              queryParams: {
                source: this.sourceParamFromUrl
              },
              queryParamsHandling: 'merge'
            });
          },
          () => {
            this.alertService.error('Not able to save');
            this.router.navigate(['triggers'], {
              queryParams: {
                source: this.sourceParamFromUrl
              },
              queryParamsHandling: 'merge'
            });
          }
        );
      } else if (this.triggerForm.value.moduleName == this.moduleTypeForm) {
        const formData = this.triggerForm.value;
        formData.triggerData?.forEach((condition: any) => {
          if (condition.timerType == 'Range') {
            condition.startTime = moment(condition.startTime)
              .format(this.dateFormatSlash)
              .replace(/\//g, '-');
            condition.endTime = moment(condition.endTime)
              .format(this.dateFormatSlash)
              .replace(/\//g, '-');
            condition.triggerTime = 0;
            condition.triggerFrequency = 'MIN';
          }
        });
        this.highLevelService.createTriggerForm(formData).then(
          () => {
            console.log();
            this.alertService.success('Trigger created successfully');
            this.router.navigate(['triggers'], {
              queryParams: {
                source: this.sourceParamFromUrl
              },
              queryParamsHandling: 'merge'
            });
          },
          () => {
            this.alertService.error('Not able to save');
            this.router.navigate(['triggers'], {
              queryParams: {
                source: this.sourceParamFromUrl
              },
              queryParamsHandling: 'merge'
            });
          }
        );
      } else if (this.triggerForm.value.moduleName == this.PATIENT_MODULE) {
        const formData = this.triggerForm.value;
        formData.triggerData?.forEach((condition: any) => {
          if (condition.timerType == 'Range') {
            condition.startTime = moment(condition.startTime)
              .format(this.dateFormatSlash)
              .replace(/\//g, '-');
            condition.endTime = moment(condition.endTime)
              .format(this.dateFormatSlash)
              .replace(/\//g, '-');
            condition.triggerTime = 0;
            condition.triggerFrequency = 'MIN';
          }
        });
        this.highLevelService.createTriggerPatient(formData).then(
          () => {
            console.log();
            this.alertService.success('Trigger created successfully');
            this.router.navigate(['triggers'], {
              queryParams: {
                source: this.sourceParamFromUrl
              },
              queryParamsHandling: 'merge'
            });
          },
          () => {
            this.alertService.error('Not able to save');
            this.router.navigate(['triggers'], {
              queryParams: {
                source: this.sourceParamFromUrl
              },
              queryParamsHandling: 'merge'
            });
          }
        );
      } else if (this.triggerForm.value.moduleName == 'Appointment') {
        this.highLevelService
          .createAppointmentTrigger(this.triggerForm.value)
          .then(
            () => {
              this.alertService.success('Trigger created successfully');
              this.router.navigate(['triggers'], {
                queryParams: {
                  source: this.sourceParamFromUrl
                },
                queryParamsHandling: 'merge'
              });
            },
            () => {
              this.alertService.error('Not able to save');
              this.router.navigate(['triggers'], {
                queryParams: {
                  source: this.sourceParamFromUrl
                },
                queryParamsHandling: 'merge'
              });
            }
          );
      }
    }
  }
  getLeadSmsTemplate(lead: any) {
    this.showPreviewModal = true;
    this.modalData = {
      id: lead,
      type: 'sms'
    };
  }

  editSMSTemplate(smsId: any) {
    console.log(smsId);
    this.showSmsModal = true;
    this.modalData = {
      id: smsId,
      type: 'sms'
    };
  }
  previewSMSTemplate(smsId: any) {
    console.log(smsId);
    this.showPreviewSmsEmailModal = true;
    this.modalData = {
      id: smsId,
      type: 'sms'
    };
  }
  getEmailTemplate(email: any) {
    this.showPreviewModal = true;
    this.modalData = {
      id: email,
      type: 'email'
    };
  }

  editEmailTemplate(emailTemplateId: any) {
    console.log(emailTemplateId);
    this.showEmailModal = true;
    this.modalData = {
      id: emailTemplateId,
      type: 'email'
    };
  }

  previewEmailTemplate(emailTemplateId: any) {
    console.log(emailTemplateId);
    this.showPreviewSmsEmailModal = true;
    this.modalData = {
      id: emailTemplateId,
      type: 'email'
    };
  }

  onCloseModal(e: any) {
    console.log(e);
    this.showEmailModal = false;
    this.showSmsModal = false;
    this.showPreviewModal = false;
    this.showPreviewSmsEmailModal = false;
  }

  setTime(e: any, timeType: string, controls: any) {
    if (!controls[timeType].value) {
      controls[timeType].setErrors({ error: `${timeType} is required!` });
      return;
    } else {
      controls[timeType].setErrors(null);
    }
    if (controls['startTime'].value && controls['endTime'].value) {
      const startTime = moment(
        moment(controls['startTime'].value).format('YYYY-MM-DD HH:mm Z')
      );
      let endTime = moment(
        moment(controls['endTime'].value).format('YYYY-MM-DD HH:mm Z')
      );
      if (startTime.hour() > endTime.hour())
        endTime = moment(
          moment(endTime.toDate()).add(1, 'day').format('YYYY-MM-DD HH:mm Z')
        );
      if (startTime.isSame(endTime)) {
        controls[timeType].setErrors({
          error: 'Start time and End time should not be same'
        });
      }
    }
  }

  handleActionOptions(actionFor: string, isShow: boolean) {
    if (isShow) {
      this.increaseLineHHeigh++;
    } else {
      this.increaseLineHHeigh--;
    }
    this.actionObj[actionFor] = isShow;
  }

  openTemplatesModal(
    moduleName: string,
    triggerType: string,
    triggerTarget: string,
    indexPosition: any
  ) {
    this.templateModalData.moduleName = moduleName;
    this.templateModalData.triggerType =
      triggerType === 'EMAIL' ? 'Email' : triggerType;
    this.templateModalData.indexPosition = indexPosition;
    if (moduleName === this.LEAD_MODULE || moduleName === this.FORM_MODULE) {
      if (triggerType === 'EMAIL') {
        if (triggerTarget === 'lead') {
          this.templateModalData.templates = this.leadEmailTemplate;
        } else if (triggerTarget === 'Clinic' || triggerTarget === 'custom') {
          this.templateModalData.templates = this.clinicEmailTemplate;
        }
      } else if (triggerType === 'SMS') {
        if (triggerTarget === 'lead') {
          this.templateModalData.templates = this.leadSmsTemplate;
        } else if (triggerTarget === 'Clinic') {
          this.templateModalData.templates = this.clinicSmsTemplate;
        }
      }
    } else if (moduleName === this.APPOINTMENT_MODULE) {
      if (triggerType === 'EMAIL') {
        if (triggerTarget === 'AppointmentPatient') {
          this.templateModalData.templates =
            this.appointmentPatientEmailTemplate;
        } else if (
          triggerTarget === 'AppointmentClinic' ||
          triggerTarget === 'AppointmentCustom'
        ) {
          this.templateModalData.templates =
            this.appointmentClinicEmailTemplate;
        }
      } else if (triggerType === 'SMS') {
        if (triggerTarget === 'AppointmentPatient') {
          this.templateModalData.templates = this.appointmentPatientSMSTemplate;
        } else if (triggerTarget === 'AppointmentClinic') {
          this.templateModalData.templates = this.appointmentClinicSMSTemplate;
        }
      }
    }
    if (moduleName === this.PATIENT_MODULE) {
      if (triggerType === 'EMAIL') {
        if (triggerTarget === 'patient') {
          this.templateModalData.templates = this.patientEmailTemplate;
        } else if (triggerTarget === 'patientClinic') {
          this.templateModalData.templates = this.patientClinicEmailTemplate;
        }
      } else if (triggerType === 'SMS') {
        if (triggerTarget === 'patient') {
          this.templateModalData.templates = this.patientSmsTemplate;
        } else if (triggerTarget === 'patientClinic') {
          this.templateModalData.templates = this.patientClinicSmsTemplate;
        }
      }
    }
    this.showTemplatesModal = true;
  }

  showHideTemplatesDialog(e: any) {
    this.showTemplatesModal = e;
  }

  templateSelected(e: any) {
    if (e && e.id) {
      if (this.templateModalData.triggerType == 'Email') {
        this.getEmailTemplates(this.templateModalData.indexPosition, e.id);
      } else if (this.templateModalData.triggerType == 'SMS') {
        this.getSmsTemplate(this.templateModalData.indexPosition, e.id);
      }
    }
  }

  onCustomEmail(e: any, id: number) {
    console.log(e);
    const controlArray = <FormArray>this.triggerForm.controls['triggerData'];
    console.log(controlArray.controls[id]);
    controlArray.controls[id].patchValue({
      customEmail: e.map((obj: any) => obj.name).join(', ')
    });
  }

  checkInvalidControls() {
    const invalidControls = [];
    const controls = this.triggerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalidControls.push(name);
      }
    }
    console.log('Invalid Controls:', invalidControls);
    return invalidControls;
  }
}

export const SOURCE_ENUM: any = {
  leads: 'leads',
  appointment: 'Appointment',
  forms: 'forms',
  patient: 'patient'
};

export const lineHeightMap = {
  1: 'single',
  2: 'two',
  0: 'none'
};
