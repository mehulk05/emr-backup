import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { PatientService } from '../../../services/patient.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileSaverService } from 'ngx-filesaver';
import { AppointmentDto } from 'src/app/shared/models/appointment/AppointmentDto';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { FormatTimeService } from 'src/app/shared/services/time-utils/formatTime.service';
import { PatientTagService } from 'src/app/modules/patient-tag/services/patient-tag.service';

@Component({
  selector: 'app-patient-detail-left-tab',
  templateUrl: './patient-detail-left-tab.component.html',
  styleUrls: ['./patient-detail-left-tab.component.css']
})
export class PatientDetailLeftTabComponent implements OnInit {
  @Output() loadAppointmentList: EventEmitter<any> = new EventEmitter();
  @Output() patientDetailsUpdated: EventEmitter<any> = new EventEmitter();
  patientId: any;
  patientData: any;
  patient_status = 'NEW';
  patientStatusOptions = ['New', 'Existing'];
  selectedTag: any;
  tagSelect: boolean;
  id: any = null;
  tags: any = [];
  tagId: any = [];
  patient: any;
  leadStatusForm: FormGroup;
  leadComments: any = [];
  questionnaires: any = [];
  appointments: any = [];
  rowData: AppointmentDto[] = [];
  showAddAppointment = false;
  businessId: any;
  isPatientStatusEditMode: any;
  initialPatientStatus: string;
  statusOptions = ['New', 'Existing'];
  leadStatusColorObj = leadStatusColorObj;
  initialLeadStatus: string;
  patientIds: any = [];
  currentIndex: any = null;
  showEditModal: boolean;

  // Add Tag Modal
  showTagTemplateModal: boolean = false;
  addTagId: any = null;
  submitted = false;
  patientTagForm: FormGroup;
  disabled = false;
  disableAdd: boolean = true;
  duplicateLabel: boolean = false;
  labels: any = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService,
    private toastService: ToasTMessageService,
    private router: Router,
    public formBuilder: FormBuilder,
    public fileSaverService: FileSaverService,
    private localStorageService: LocalStorageService,
    private authenticationService: AuthService,
    public formatTimeService: FormatTimeService,
    private patientTagService: PatientTagService,
    private alertService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.patientId = data.params.patientId;
      this.loadPatientInfo();
      this.loadPatienttag();
      this.getPaitentTagList();
      this.loadUpcomingAppointments();
      this.getUser();
      this.patientIds = JSON.parse(localStorage.getItem('patientIds'));
      if (this.patientIds && this.patientIds.length > 0) {
        this.patientIds.sort(function (a: any, b: any) {
          return b - a;
        });
        this.currentIndex = this.patientIds.indexOf(Number(this.patientId));
      }
    });
    this.leadStatusForm = this.formBuilder.group({
      tagId: [[], []]
    });

    this.patientTagForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern(/^(\s+\S+\s*)*(?!\s).*$/),
          Validators.pattern(/^[a-zA-Z0-9\s]+$/)
        ]
      ],
      isDefault: [false, []]
    });
  }

  openAddTagTemplateModal() {
    this.showTagTemplateModal = true;
  }
  closeAddTagTemplateModal() {
    this.showTagTemplateModal = false;
  }

  hideAddTagModal = () => (this.showTagTemplateModal = false);

  submitForm() {
    this.submitted = true;
    if (this.patientTagForm.invalid) {
      return;
    }
    if (this.duplicateLabel) {
      return;
    }

    if (this.addTagId) {
      const formData = this.patientTagForm.value;
      this.patientTagService.update(this.addTagId, formData).then(
        () => {
          //this.images.push(event.target.result);
          this.alertService.success('Tag updated successfully.');
          this.closeAddTagTemplateModal();
          this.getPaitentTagList();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    } else {
      const formData = this.patientTagForm.value;
      console.log(formData);
      this.patientTagService.create(formData).then(
        () => {
          this.alertService.success('Tag created successfully.');
          this.closeAddTagTemplateModal();
          this.getPaitentTagList();
        },
        (error: any) => {
          this.alertService.error(error.message);
        }
      );
    }
    this.patientTagForm.reset();
  }

  get f() {
    return this.patientTagForm.controls;
  }

  loadTag() {
    this.patientTagService.get(this.addTagId).then((response: any) => {
      this.patientTagForm.patchValue(response);
    });
  }

  loadTags() {
    this.patientTagService.list().then(
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

  async loadPatientInfo(fromModal?: boolean) {
    this.patientData = (await this.patientService.getPatientOptimized(
      this.patientId
    )) as any;
    this.patient_status = this.patientData.patientStatus;
    if (this.patientData && fromModal) {
      this.patientDetailsUpdated.emit(this.patientData);
    }
  }

  async loadPatienttag() {
    this.patientService
      .getPatientOptimized(this.patientId)
      .then((response: any) => {
        this.patient = response;
        this.leadStatusForm.patchValue({
          tagId: response.tag
        });

        this.tagId = response.tag;
        if (this.tagId) this.selectedTag = this.tagId.map((x: any) => x.id);
        if (response.tagId != null) {
          response.tagId.forEach((id: any) => {
            this.tagId.push(id);
          });
        }
      });
  }

  onSelectedValue(newStatus: string) {
    this.patient_status = newStatus;
    this.patientService
      .editInlinePaitent({ patientStatus: newStatus }, this.patientId)
      .then(() => {
        this.loadQuestionnaireSubmission();
      });
  }

  getUser() {
    this.authenticationService.currentUserSubject.subscribe((data) => {
      this.businessId = data?.businessId;
    });
  }

  goBack() {
    this.router.navigate(['/patients'], {
      state: { isDataModified: false }
    });
  }

  setPatientStatus(status: any) {
    this.patientService.updatePatientStatus(this.patientId, status).then(
      () => {
        this.loadPatientInfo();
      },
      () => {
        this.toastService.error('Error while updating the patient status');
      }
    );
  }

  OnInlineEditComplete(e: any) {
    console.log(e);
    this.loadPatientInfo();
  }
  loadQuestionnaireSubmission() {
    this.patientService
      .getPatientQuestionnaireOptimized(this.patientId)
      .then((response: any) => {
        this.questionnaires = response;
        console.log('res', this.questionnaires);
      });
  }
  loadPatientComments() {
    this.patientService.patientCommentList(this.patientId).then(
      (response: any) => {
        this.leadComments = response;
      },
      () => {
        this.toastService.error(
          'Unable to load the questionnaire submission comment.'
        );
      }
    );
  }
  onTagSelect(e: any) {
    this.selectedTag = e.value;
    console.log('selected', this.selectedTag);
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
    this.patientService.updateLeadTags(this.patientId, this.selectedTag).then(
      () => {
        this.toastService.success('Tag updated successfully');
      },
      () => {
        console.log('err');
        this.toastService.error('Unable to add tag');
      }
    );
  }

  getPaitentTagList() {
    this.patientService.patientTagList().then(
      (response: any) => {
        this.tags = response.reverse();
        console.log('tag', this.tags);
      },
      (error) => {
        this.toastService.error(error.message);
      }
    );

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.addTagId = params.get('id');
      if (this.addTagId) {
        this.loadTag();
      }
    });
    this.loadTags();
  }
  downloadAsPDF1() {
    this.patientService
      .downloadPatientDetailpdf(this.patientId)
      .then((data: any) => {
        this.fileSaverService.save(data, 'PatientDetail.pdf');
      })
      .catch(() => {
        this.toastService.error('Unable to download patient xlsx.');
      });
  }
  openEditModal() {
    this.showEditModal = true;
  }
  onEditModalClosed(event: any) {
    if (event.close) {
      this.showEditModal = false;
    }
    this.loadPatientInfo(true);
  }

  loadUpcomingAppointments() {
    this.patientService.getPatientAppointmentsOptimized(this.patientId).then(
      (response: any) => {
        const currentDate = new Date();

        this.appointments = response
          .map((data: any) => {
            data['serviceList'] = data.service
              .map((e: any) => e.serviceName)
              .join(',');
            return data;
          })
          .filter((data: any) => {
            const appointmentDate = new Date(data.appointmentDate);
            return appointmentDate >= currentDate;
          })
          .sort((a: any, b: any) => {
            const dateA = new Date(a.appointmentDate);
            const dateB = new Date(b.appointmentDate);
            return dateA.getTime() - dateB.getTime();
          });

        console.log('Upcoming Appointments', this.appointments);
      },
      () => {
        this.toastService.error('Unable to load patient appointments.');
      }
    );
  }

  EditAppointment(id: Number) {
    this.router.navigate(['/appointment/booking-history/', id, 'edit']);
  }
  addAppointment() {
    this.showAddAppointment = true;
  }
  afterAppointmentCreated(event: any) {
    console.log(event);
    this.showAddAppointment = false;
    if (this.patientId) {
      this.loadUpcomingAppointments();
    }
    if (event) {
      this.loadAppointmentList.emit(true);
    }
  }
  onEdit() {
    this.isPatientStatusEditMode = !this.isPatientStatusEditMode;
    if (!this.isPatientStatusEditMode) {
      this.patient_status = this.initialPatientStatus;
    } else {
      this.initialPatientStatus = this.patient_status;
    }
  }
  onStatusChange(newStatus: string) {
    console.log('New status:', newStatus);
    this.patientService
      .updatePatientStatus(this.patientId, newStatus)
      .then(() => {
        console.log('here');
        this.isPatientStatusEditMode = false;
        this.loadPatientInfo();
      });
  }
}

export const leadStatusColorObj = {
  new: '#01b700',
  existing: '#109bc7'
};
