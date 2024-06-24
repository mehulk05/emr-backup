import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { PatientDetailRightTabComponent } from './patient-detail-right-tab/patient-detail-right-tab.component';
import { PreviousUrlService } from '../../services/previous-url.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  @ViewChild(PatientDetailRightTabComponent)
  patientDetailRightTab: PatientDetailRightTabComponent;
  @Input() patientId: any;
  @Output() changeTaskList: EventEmitter<any> = new EventEmitter();
  @Output() changeAppointmentList: EventEmitter<any> = new EventEmitter();
  id: any;
  patientIds: any;
  currentIndex: any;
  selectedIndex: any;
  source: any = 'pateint';
  businessInfo: any;
  sources = [
    'pateint',
    'questionarie',
    'task',
    'consents',
    'payments',
    'appointments',
    'timeline'
  ];
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: ToasTMessageService,
    private localStorageService: LocalStorageService,
    private previousUrlService: PreviousUrlService
  ) {}

  ngOnInit(): void {
    console.log('...');
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.id = data.params.patientId;

      this.patientIds = JSON.parse(localStorage.getItem('patientIds'));
      if (this.patientIds && this.patientIds.length > 0) {
        this.patientIds.sort(function (a: any, b: any) {
          return b - a;
        });
        this.currentIndex = this.patientIds.indexOf(Number(this.id));
      }
    });
    this.businessInfo = this.localStorageService.readStorage('businessData');

    this.patientId = this.activatedRoute.snapshot.params.patientId;
    this.activatedRoute.params.subscribe((data: any) => {
      this.patientId = data?.patientId;
    });
    if (!this.businessInfo?.showPatientDetailsOnSinglePage) {
      this.source =
        this.activatedRoute.snapshot.queryParams?.source ?? 'patient';
      if (this.source) {
        this.selectedIndex = this.sources.indexOf(this.source);
      }
      this.activatedRoute.queryParams.subscribe((data: any) => {
        this.source = data.source;
        if (this.source) {
          this.selectedIndex = this.sources.indexOf(this.source);
        }
      });
    } else {
      this.source = 'single-page';
      this.router.navigate(['patients', this.patientId, 'edit'], {
        queryParams: {
          source: 'single-page'
        },
        queryParamsHandling: 'merge'
      });
    }
  }

  goToPatients(flag: any) {
    this.previousUrlService.setPreviousUrl('/');
    console.log('current index', this.patientIds, this.currentIndex);
    if (this.currentIndex != -1) {
      if (flag == 'next') {
        if (this.currentIndex >= this.patientIds.length - 1) return;
        // this.router.navigate(['/leads/' + this.leadIds[this.currentIndex + 1]]);
        this.router.navigate(
          ['/patients/' + this.patientIds[this.currentIndex + 1] + '/edit'],
          {
            queryParams: { source: 'pateint' }
          }
        );
        this.currentIndex = this.currentIndex + 1;
      } else {
        // this.router.navigate(['/leads/' + this.leadIds[this.currentIndex - 1]]);
        this.router.navigate(
          ['/patients/' + this.patientIds[this.currentIndex - 1] + '/edit'],
          {
            queryParams: { source: 'pateint' }
          }
        );
        this.currentIndex = this.currentIndex - 1;
      }
    } else {
      this.alertService.warn(
        'Too many network calls, Please refresh the page '
      );
    }
  }

  loadTaskList(e: any) {
    this.changeTaskList.emit(e);
  }

  loadAppointmentList(e: any) {
    this.changeAppointmentList.emit(e);
  }

  patientDetailsUpdated(e: any) {
    this.patientDetailRightTab.updatePatientInfo(e, true);
  }
}
