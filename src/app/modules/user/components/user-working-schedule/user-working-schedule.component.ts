import { Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import moment from 'moment';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Dropdown } from 'primeng/dropdown';

@Component({
  selector: 'app-user-working-schedule',
  templateUrl: './user-working-schedule.component.html',
  styleUrls: ['./user-working-schedule.component.css']
})
export class UserWorkingScheduleComponent implements OnInit {
  @ViewChild('days') days?: Dropdown;
  userClinics: any = [];
  userId: any;
  scheduleForm!: FormGroup;
  daysList: any[];
  currentDate: Date;
  currenUserSubscription: any;
  username: any = null;
  name: string;
  clinicList: any;
  serviceList: any;
  serviceCategories: any;
  submitted: boolean;
  selectedSlots: any[];
  providerId: any;
  selectedFlag: any;
  providerScheduleType: any;
  schedulesArray: any;
  selectedClinicId = 0;

  constructor(
    private activatedRoute: ActivatedRoute,
    public formBuilder: FormBuilder,
    private userService: UserService,
    private authenticationService: AuthService,
    private alretService: ToasTMessageService
  ) {}

  ngOnInit() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    console.log('Current User', currentUser);
    this.userId = this.activatedRoute.snapshot.params.userId ?? currentUser.id;
    this.name = currentUser.firstName + ' ' + currentUser.lastName;
    if (this.userId) {
      if (this.userId == 0) {
        this.userId = null;
        this.loadClinics();
      } else {
        this.providerId = this.userId;
        this.loadUser();
      }
    } else {
      if (!currentUser) {
        this.currenUserSubscription =
          this.authenticationService.currentUser.subscribe((data) => {
            if (data) {
              this.userId = data?.id;
              this.providerId = this.userId;
              this.loadUser();
            }
          });
      } else {
        this.userId = currentUser?.id;
        this.providerId = this.userId;
        this.loadUser();
      }
    }

    this.scheduleForm = this.formBuilder.group(
      {
        userId: [''],
        user: ['', [Validators.required]],
        clinicId: [null, [Validators.required]],
        scheduleType: [''],

        dateFromDate: ['', [Validators.required]],
        dateToDate: ['', [Validators.required]],
        slots: this.formBuilder.array([]),
        selectedSlots: ['', '']
      },
      { validator: dateRangeValidator() }
    );

    if (this.userId && this.userId != 0) {
      this.scheduleForm.patchValue({
        userId: this.userId
      });
    }

    this.daysList = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ];
    this.currentDate = new Date();
    this.currentDate.setHours(0, 0, 0, 0);
  }

  filterByDays(): void {
    if (this.days) {
      (this.days.filterBy as any) = {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        split: (_: any) => [(item: any) => item]
      };
    }
  }

  get slotsArray(): FormArray {
    return this.scheduleForm.get('slots') as FormArray;
  }
  get scheduleFormControls() {
    return this.scheduleForm.controls;
  }

  loadUser() {
    this.userService.getOptimziedUser(this.userId).then(
      (response: any) => {
        this.scheduleForm.patchValue({
          userId: response.userId,
          user: response.firstName + ' ' + response.lastName
        });
        this.username = response.email;
        this.name = response.firstName + ' ' + response.lastName;
        const clinicIds: any[] = [];
        this.userClinics = response.clinics;
        if (!response.clinics.length) {
          this.loadClinics();
        } else {
          this.selectedClinicId = response.clinics?.filter(
            (object: any) => object.isDefault
          )[0]?.id;
          response.clinics.map((clinic: { id: any }) => {
            clinicIds.push(clinic.id);
          });
        }

        this.loadClinics();
        this.onChangeScheduleTypeloadScehdule('working', this.selectedClinicId);
      },
      () => {
        this.alretService.error('Unable to load user.');
      }
    );
  }

  addSlots() {
    this.slotsArray.push(this.addSlotsGroup());
    console.log('this', this.slotsArray);
  }

  removeSlots(index: any) {
    this.slotsArray.removeAt(index);
  }

  addSlotsGroup(): FormGroup {
    return this.formBuilder.group({
      timeFromDate: ['', [Validators.required]],
      timeToDate: ['', [Validators.required]],
      days: ['', [Validators.required]],
      fullTime: [true, '']
    });
  }

  loadClinics() {
    this.userService.getAllOptimizedCinicList().then(
      (response: any) => {
        this.clinicList = response;
        this.selectedClinicId = this.clinicList?.filter(
          (object: any) => object.default
        )[0].id;
        this.scheduleForm.patchValue({
          clinicId: this.selectedClinicId
        });
      },
      () => {
        this.alretService.error('Unable to load clinics.');
      }
    );
  }

  submitWorkingScheduleForm = () => {
    this.submitted = true;

    if (this.scheduleForm.invalid) {
      return;
    }

    this.selectedSlots = [];
    this.slotsArray.controls.forEach((element) => {
      var daysArray = [];
      for (var i = 0; i < element.value.days.length; i++) {
        if (element.value.days[i].id != null)
          daysArray.push(element.value.days[i].id);
        else daysArray.push(element.value.days[i]);
      }

      this.selectedSlots.push({
        timeFromDate: moment(element.value.timeFromDate).format('HH:mm'),
        timeToDate: moment(element.value.timeToDate).format('HH:mm'),
        days: daysArray
      });
    });

    const formData = JSON.parse(JSON.stringify(this.scheduleForm.value));
    formData.dateFrom = moment(formData.dateFromDate).format(
      'YYYY-MM-DD 00:00:00 ZZ'
    ); // Z
    formData.dateTo = moment(formData.dateToDate).format(
      'YYYY-MM-DD 00:00:00 ZZ'
    ); // Z
    formData.providerId = this.providerId;
    formData.selectedSlots = this.selectedSlots;
    console.log(formData);
    delete formData['user'];
    this.userService.createProviderSchedule(this.providerId, formData).then(
      () => {
        this.alretService.success('Provider Schedule updated Successfully.');
        this.loadUser();
      },
      () => {
        this.alretService.error('Unable to create provider schedule.');
      }
    );
  };

  onChangeScheduleTypeloadScehdule(schedyleType: any, clinicId: any) {
    this.scheduleForm.patchValue({
      clinicId: clinicId
    });
    this.selectedFlag = schedyleType;
    this.providerScheduleType = schedyleType;
    if (schedyleType != '' && this.scheduleForm.value.clinicId != '') {
      this.userService
        .getOptimizedUserClinicSchedule(
          this.providerId,
          this.scheduleForm.value.clinicId,
          schedyleType
        )
        .then(
          (response: any) => {
            console.log('res', response);
            while (this.slotsArray.length !== 0) {
              this.slotsArray.removeAt(0);
            }

            if (
              response != null &&
              response[0]?.userScheduleTimings != null &&
              response[0]?.userScheduleTimings.length > 0
            ) {
              this.scheduleForm.patchValue({
                clinicId: response[0].clinicId,
                dateFromDate: new Date(response[0].fromDate),
                dateToDate: new Date(response[0].toDate),
                userId: response[0].providerId,
                scheduleType: response[0].scheduleType
              });
              for (var i = 0; i < response[0].userScheduleTimings.length; i++) {
                console.log('i', i);
                this.slotsArray.push(
                  this.addSlotsGroup1(response[0].userScheduleTimings[i])
                );
                console.log(this.slotsArray);
              }
            } else {
              this.slotsArray.push(this.addSlotsGroup());
              this.scheduleForm.patchValue({
                dateFromDate: '',
                dateToDate: ''
              });
            }
          },
          () => {
            this.alretService.error('Unable to load provider schedules.');
          }
        );
    }

    this.scheduleForm.patchValue({
      scheduleType: schedyleType
    });
  }

  addSlotsGroup1(userScheduleTimings: any): FormGroup {
    var timeFrom = userScheduleTimings.timeFromDate.split(':');
    var timeTo = userScheduleTimings.timeToDate.split(':');
    const now = new Date();

    return this.formBuilder.group({
      timeFromDate: [
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          timeFrom[0],
          timeFrom[1]
        ),
        [Validators.required]
      ],
      timeToDate: [
        new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          timeTo[0],
          timeTo[1]
        ),
        [Validators.required]
      ],
      days: [userScheduleTimings.days, [Validators.required]],
      fullTime: [userScheduleTimings.allclinic, '']
    });
  }

  handleDateSelect(e: any, controlName: string, index: number) {
    const slotsArray = this.scheduleForm.get('slots') as FormArray;
    const slotGroup = slotsArray.at(index);

    const fromTime = slotGroup.get('timeFromDate').value;
    const toTime = slotGroup.get('timeToDate').value;

    if (fromTime && toTime && fromTime > toTime) {
      // set error message on form control
      slotGroup.get('timeToDate').setErrors({ invalidTimeRange: true });

      // disable submit button
      this.scheduleForm.get('selectedSlots').disable();
    } else {
      // clear error message on form control
      slotGroup.get('timeToDate').setErrors(null);

      // enable submit button if all time ranges are valid
      const allValid = slotsArray.controls.every(
        (control) => !control.get('timeToDate').errors
      );
      if (allValid) {
        this.scheduleForm.get('selectedSlots').enable();
      }
    }
  }

  onClinicSelect(event: any) {
    this.selectedClinicId = event.value;
    this.onChangeScheduleTypeloadScehdule('working', this.selectedClinicId);
  }

  printFormErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key: string) => {
      const control = formGroup.get(key);

      if (control instanceof FormGroup) {
        this.printFormErrors(control); // recursive call for nested form groups
      } else {
        console.log(`Control: ${key}`);
        console.log(`Valid: ${control.valid}`);

        if (control.errors) {
          console.log(`Errors:`);
          Object.keys(control.errors).forEach((errorKey: string) => {
            console.log(`- ${errorKey}: ${control.getError(errorKey)}`);
          });
        }
      }
    });
  }
}

function dateRangeValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const fromDate = control.get('dateFromDate').value;
    const toDate = control.get('dateToDate').value;
    const matchingControl = control.get('dateFromDate');
    console.log(matchingControl);
    // check if fromDate is greater than toDate
    if (fromDate && toDate && fromDate > toDate) {
      console.log(fromDate, toDate);
      matchingControl.setErrors({ dateRangeError: true });
      return { dateRangeError: true };
    } else {
      matchingControl.setErrors(null);
    }
    return null;
  };
}
