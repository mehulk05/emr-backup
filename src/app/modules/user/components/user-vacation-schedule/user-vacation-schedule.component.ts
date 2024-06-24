/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators
} from '@angular/forms';
import moment from 'moment';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { UserService } from '../../services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user-vacation-schedule',
  templateUrl: './user-vacation-schedule.component.html',
  styleUrls: ['./user-vacation-schedule.component.css']
})
export class UserVacationScheduleComponent implements OnInit {
  vacationScheduleForm: FormGroup;
  selectedFlag: string;
  clinicList: any;
  timeObj: any;
  clinicId: number;
  userId: number;
  name: string;
  providerId: number;
  userData: any;
  username: any;
  userClinics: any;
  currenUserSubscription: any;
  submitted: boolean;
  startAt: Date;
  endAt: Date;
  daysList: any[];
  hasDateError: boolean[] = [];
  timeError: boolean[][] = [];
  timeErrorExists: boolean;
  dateErrorExist: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: ToasTMessageService,
    private userService: UserService,
    private authenticationService: AuthService,
    private formBuilder: FormBuilder,
    private toastrService: ToasTMessageService
  ) {}

  ngOnInit() {
    const currentUser  = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.userId = this.activatedRoute.snapshot.params.userId ?? currentUser.id;
    this.name = currentUser.firstName + ' ' + currentUser.lastName;
    this.loadClinics();
    this.loadUser();
    if (this.userId) {
      if (this.userId == 0) {
        this.userId = null;
      } else {
        this.providerId = this.userId;
        this.loadUser();
      }
    } else {
      if (!currentUser) {
        this.currenUserSubscription =
          this.authenticationService.currentUser.subscribe((data: any) => {
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
    this.vacationScheduleForm = this.formBuilder.group({
      userId: [this.userId],
      user: [this.name, [Validators.required]],
      clinicId: ['', [Validators.required]],
      dates: this.formBuilder.array([])
    });
    this.daysList = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY'
    ];
  }

  get scheduleFormControls() {
    return this.vacationScheduleForm.controls;
  }

  get dates(): FormArray {
    return this.vacationScheduleForm.controls['dates'] as FormArray;
  }

  onChange(event: any) {
    this.loadVacationSchedule('vacation', event.value);
  }

  loadVacationSchedule(scheduleType: string, clinicId: any) {
    this.selectedFlag = scheduleType;
    if (scheduleType != '' && clinicId != null) {
      this.userService
        .getOptimizedUserClinicSchedule(this.providerId, clinicId, scheduleType)
        .then(
          (response: any) => {
            //

            let data = {};
            this.dates.clear();
            if (
              response != null &&
              response.length > 0 &&
              response[0]?.userScheduleTimings != null &&
              response[0]?.userScheduleTimings.length > 0
            ) {
              for (var i = 0; i < response.length; i++) {
                this.dates.push(this.addVacationDateSchedule(response[i]));
                for (
                  var j = 0;
                  j < response[i].userScheduleTimings.length;
                  j++
                ) {
                  this.time(i).push(
                    this.addVacationTimeSchedule(
                      response[i].userScheduleTimings[j]
                    )
                  );
                }
              }
              data = {
                userId: response[0].providerId,
                clinicId: response[0].clinicId,
                dates: this.dates.value,
                user: this.name
              };
              this.clinicId = response[0].clinicId;
            } else {
              this.dates.push(this.newVacationDate());
              this.time(0).push(this.newVacationTime());
              data = {
                userId: this.providerId,
                clinicId: clinicId,
                dates: this.dates.value,
                user: this.name
              };
              this.clinicId = clinicId;
            }
            this.vacationScheduleForm.setValue(data);
          },
          () => {
            this.alertService.error('Unable to load provider schedules.');
          }
        );
    }
  }

  loadUser() {
    console.log('call coming here');
    this.userService.getOptimziedUser(this.userId).then(
      (response: any) => {
        this.userData = response;
        this.username = response.email;
        this.name = response.firstName + ' ' + response.lastName;
        this.vacationScheduleForm.patchValue({
          userId: response.userId,
          user: response.firstName + ' ' + response.lastName
        });
        const clinicIds: any[] = [];
        this.userClinics = response.clinics;
        if (response.clinics.length == 0) {
          // this.loadClinics();
        } else {
          response.clinics.map((clinic: { id: any }) => {
            clinicIds.push(clinic.id);
          });
        }
        const clinicId = this.clinicList.filter(
          (object: any) => object.default
        )[0].id;

        // this.loadClinics();
        this.loadVacationSchedule('vacation', clinicId);
      },
      () => {
        this.alertService.error('Unable to load user.');
      }
    );
  }

  loadClinics() {
    this.userService.getAllOptimizedCinicList().then(
      (response: any) => {
        this.clinicList = response;
        this.vacationScheduleForm.patchValue({
          clinicId: this.clinicList?.filter((object: any) => object.default)[0]
            .id
        });
      },
      () => {
        this.alertService.error('Unable to load clinics.');
      }
    );
  }

  time(vacationDateIndex: number): FormArray {
    return this.dates.at(vacationDateIndex).get('time') as FormArray;
  }

  getTimeControl(slot: FormControl) {
    return slot as FormControl;
  }

  // add new Vacation div
  addVacation() {
    this.resetVacationScheduleParams();
    this.dates.push(this.newVacationDate());
    const size = this.dates.length;
    this.time(size - 1).push(this.newVacationTime());
  }

  removeVacationDate(vacationDateIndex: number) {
    this.resetVacationScheduleParams();
    this.dates.removeAt(vacationDateIndex);
  }

  addVacationTime(vacationDateIndex: number) {
    this.resetVacationScheduleParams();
    this.time(vacationDateIndex).push(this.newVacationTime());
  }

  removeVacationTime(vacationDateIndex: number, vacationTimeIndex: number) {
    this.resetVacationScheduleParams();
    this.time(vacationDateIndex).removeAt(vacationTimeIndex);
  }

  resetVacationScheduleParams() {
    this.submitted = false;
    this.startAt = new Date(2018, 3, 18, 0, 0);
    this.endAt = new Date(2018, 3, 18, 23, 0);
  }

  newVacationDate(): FormGroup {
    return this.formBuilder.group(
      {
        startDate: ['', Validators.required],
        endDate: ['', Validators.required],
        time: this.formBuilder.array([])
      },
      {
        validator: [this.fromToDate('startDate', 'endDate')]
      }
    );
  }

  logControl(control: AbstractControl) {
    console.log(control);
  }

  fromToDate(startDate: string, endDate: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      if (
        formGroup.get(startDate).value != '' &&
        formGroup.get(endDate).value != ''
      ) {
        const fromDate = formGroup.get(startDate).value;
        const toDate = formGroup.get(endDate).value;
        var currentDate = new Date();
        var formattedCurrentDate = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          currentDate.getDate(),
          0,
          0,
          0
        );
        if (fromDate < formattedCurrentDate) {
          //this.alertService.error("Start Date must be greater than or equal to Current Date");
          return { fromToDate: true };
        } else if (fromDate > toDate) {
          this.alertService.error(
            'End Date must be greater than or equal to Start Date'
          );
          return { fromToDate: true };
        }
      }
      return null;
    };
  }

  newVacationTime(): FormGroup {
    return this.formBuilder.group(
      {
        startTime: ['', Validators.required],
        endTime: ['', Validators.required]
      },
      {
        validator: [this.fromToTime('startTime', 'endTime')]
      }
    );
  }

  fromToTime(startTime: string, endTime: string): ValidatorFn {
    return (formGroup: AbstractControl): { [key: string]: boolean } | null => {
      if (
        formGroup.get(startTime).value != '' &&
        formGroup.get(endTime).value != ''
      ) {
        const fromTime = formGroup.get(startTime).value;
        const toTime = formGroup.get(endTime).value;
        if (fromTime > toTime) {
          this.alertService.error('End Time must be greater than Start Time');
          return { fromToTime: true };
        }
      }
      return null;
    };
  }

  addVacationDateSchedule(vacationSchedule: any): FormGroup {
    const startDate = moment
      .tz(vacationSchedule.fromDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ', 'UTC')
      .format('YYYY-MM-DD HH:mm:ss');
    // console.log(vacationSchedule.fromDate,startDate, moment.utc(startDate).format());
    // startDate = moment.utc(startDate).format();
    const endDate = moment
      .tz(vacationSchedule.toDate, 'YYYY-MM-DDTHH:mm:ss.SSSZ', 'UTC')
      .format('YYYY-MM-DD HH:mm:ss');
    return this.formBuilder.group(
      {
        startDate: [new Date(startDate), Validators.required],
        endDate: [new Date(endDate), Validators.required],
        time: this.formBuilder.array([])
      },
      {
        validator: [this.fromToDate('startDate', 'endDate')]
      }
    );
  }

  addVacationTimeSchedule(vacationScheduleTimings: any): FormGroup {
    var startTime = vacationScheduleTimings.timeFromDate.split(':');
    var endTime = vacationScheduleTimings.timeToDate.split(':');
    this.startAt = new Date(2018, 3, 18, startTime[0], startTime[1]);
    this.endAt = new Date(2018, 3, 18, endTime[0], endTime[1]);
    //console.log(this.startAt);
    return this.formBuilder.group(
      {
        startTime: [this.startAt, Validators.required],
        endTime: [this.endAt, Validators.required]
      },
      {
        validator: [this.fromToTime('startTime', 'endTime')]
      }
    );
  }

  // pankaj : Form submit button
  submitForm() {
    this.submitted = true;
    const dateArray: any = [];

    console.log('vacation', this.vacationScheduleForm.value);
    let isError = false;
    this.vacationScheduleForm.value.dates.forEach((obj: any) => {
      if (obj.time.length === 0) {
        this.toastrService.error(
          'Please add the start time and end time for dates without time'
        );
        isError = true;
        return;
      } else {
        obj.time.forEach((item: any) => {
          console.log(item);
          if (
            !item.startTime ||
            !item.endTime ||
            item.startTime === 'Invalid date' ||
            item.endTime === 'Invalid date'
          ) {
            this.toastrService.error(
              'Please add the start time and end time for dates without time'
            );
            isError = true;
          }
        });
      }
    });

    if (isError) {
      return;
    }
    this.vacationScheduleForm.value.dates.forEach((element: any) => {
      var timeArray: any = [];
      element.time.forEach((element: any) => {
        timeArray.push({
          startTime: moment(element.startTime).format('HH:mm'),
          //element.startTime.getHours() + ':' + element.startTime.getMinutes(),
          endTime: moment(element.endTime).format('HH:mm')
          //element.endTime.getHours() + ':' + element.startTime.getMinutes()
        });
      });

      dateArray.push({
        startDate:
          //element.startDate.toISOString(),
          moment(element.startDate).format('YYYY-MM-DD 00:00:00 ZZ'),
        endDate:
          //element.endDate.toISOString(),
          moment(element.endDate).format('YYYY-MM-DD 00:00:00 ZZ'),
        time: timeArray
      });

      // dateArray['time'] = timeArray
    });
    const obj = {
      providerId: this.userId,
      clinicId: this.vacationScheduleForm.value.clinicId,
      vacationSchedules: dateArray
    };

    console.log('formData==============>>', obj, 'user-id', this.userId);
    this.userService.createVacationSchedule(this.userId, obj).then(
      (res: any) => {
        console.log('res==>', res);
        this.toastrService.success('Vacation schedule updated successfully');
      },
      (error) => {
        this.alertService.error(
          'Please reschedule, existing appointments coinciding with your vacation period'
        );
      }
    );
  }

  handleDateSelect(
    e: any,
    controlName: string,
    index: number,
    timeIndex?: number
  ) {
    const dateFormArray = this.vacationScheduleForm.get('dates') as FormArray;
    const startDateControl = dateFormArray.at(index).get('startDate');
    const endDateControl = dateFormArray.at(index).get('endDate');

    if (
      controlName === 'startDate' &&
      endDateControl.value &&
      startDateControl.value > endDateControl.value
    ) {
      startDateControl.setErrors({ dateRangeError: true });
      this.hasDateError[index] = true;
    } else if (
      controlName === 'endDate' &&
      startDateControl.value &&
      endDateControl.value < startDateControl.value
    ) {
      endDateControl.setErrors({ dateRangeError: true });
      this.hasDateError[index] = true;
    } else {
      this.hasDateError[index] = false;
      startDateControl.setErrors(null);
      endDateControl.setErrors(null);
    }

    if (timeIndex !== undefined) {
      const timeFormArray = dateFormArray.at(index).get('time') as FormArray;
      const startTimeControl = timeFormArray.at(timeIndex).get('startTime');
      const endTimeControl = timeFormArray.at(timeIndex).get('endTime');

      if (
        startTimeControl.value &&
        endTimeControl.value &&
        startTimeControl.value >= endTimeControl.value
      ) {
        startTimeControl.setErrors({ timeRangeError: true });
        if (!this.timeError[index]) {
          this.timeError[index] = [];
        }
        this.timeError[index][timeIndex] = true;
        // this.hasDateError[index] = true;
      } else {
        startTimeControl.setErrors(null);
        endTimeControl.setErrors(null);
        if (!this.timeError[index]) {
          this.timeError[index] = [];
        }
        this.timeError[index][timeIndex] = false;
        // this.hasDateError[index] = false;
      }
    }

    let hasError = false;
    for (let i = 0; i < this.timeError.length; i++) {
      if (this.timeError[i] && this.timeError[i].indexOf(true) !== -1) {
        hasError = true;
        break;
      }
    }

    this.timeErrorExists = hasError;

    let hasDateError = false;
    for (let i = 0; i < this.hasDateError.length; i++) {
      if (this.hasDateError[i]) {
        hasDateError = true;
        break;
      }
    }
    this.dateErrorExist = hasDateError;
  }
}
