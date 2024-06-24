import { Component, OnInit } from '@angular/core';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
import { DataStudioService } from '../../service/data-studio.service';

@Component({
  selector: 'app-appointment-reports',
  templateUrl: './appointment-reports.component.html',
  styleUrls: ['./appointment-reports.component.css']
})
export class AppointmentReportsComponent implements OnInit {
  appointment: any;

  constructor(
    private dataStudioService: DataStudioService,
    private toastService: ToasTMessageService
  ) {}

  ngOnInit(): void {
    this.getOptimizedData();
  }

  getOptimizedData() {
    this.dataStudioService.getOptimizedAppointments().then(
      (data: any) => {
        this.appointment = data.appointmentDTOList;
        //console.log('data.....', data);
        // this.getLeadsCountForMonthAndWeek(data);
      },
      () => {
        this.toastService.error('Unable to load appointments.');
      }
    );
  }
}
