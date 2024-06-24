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
import { LeadDetailTab1RightComponent } from '../lead-detail-tab1-right/lead-detail-tab1-right.component';
import { UserService } from 'src/app/modules/user/services/user.service';
import { LeadsService } from '../../service/leads.service';
import { FormBuilder, FormGroup } from '@angular/forms';

interface UserData {
  name: string;
  email: string;
  id: any;
}

@Component({
  selector: 'app-lead-detail-tab1',
  templateUrl: './lead-detail-tab1.component.html',
  styleUrls: ['./lead-detail-tab1.component.css']
})
export class LeadDetailTab1Component implements OnInit {
  @ViewChild(LeadDetailTab1RightComponent)
  leadDetailRightTab: LeadDetailTab1RightComponent;
  id: any;
  leadIds: any;
  currentIndex: any;
  @Output() handleCallQuestionaireApiCallback = new EventEmitter<any>();
  @Input() leadQuestionarieResponse: any;

  leadUserEmailForm: FormGroup;
  predefinedList: UserData[] = [];
  providerList: any = [];
  selectedUser: UserData;
  selectedUserId: any = 0;
  isUserSelected: boolean = false;
  isLeadDetailUpdated: boolean;
  userSelected: EventEmitter<UserData> = new EventEmitter<UserData>();

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: ToasTMessageService,
    public userService: UserService,
    private leadService: LeadsService,
    public formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    console.log('...');
    this.activatedRoute.paramMap.subscribe((data: any) => {
      this.id = data.params.leadId;

      this.leadIds = JSON.parse(localStorage.getItem('leadIds'));
      if (this.leadIds && this.leadIds.length > 0) {
        this.leadIds.sort(function (a: any, b: any) {
          return b - a;
        });
        this.currentIndex = this.leadIds.indexOf(Number(this.id));
      }
    });

    this.leadUserEmailForm = this.formBuilder.group({
      leadId: ['', []],
      userId: ['', []]
    });

    this.getAllUsers();
    this.loadSelectedUser(this.id);
  }

  getAllUsers() {
    this.userService.getAllUsers().then(
      (response: any) => {
        this.providerList = response;
        console.log(this.providerList);
        for (const user of this.providerList) {
          console.log(`Name: ${user.name}, Email: ${user.email}`);
          this.predefinedList.push({
            name: user.firstName + ' ' + user.lastName,
            email: user.email,
            id: user.id
          });
        }
      },
      () => {
        this.alertService.error(
          'Unable to load the questionnaire submission comment.'
        );
      }
    );
  }

  goToLeads(flag: any) {
    console.log('current index', this.leadIds, this.currentIndex);
    if (this.currentIndex != -1) {
      if (flag == 'next') {
        if (this.currentIndex >= this.leadIds.length - 1) return;
        // this.router.navigate(['/leads/' + this.leadIds[this.currentIndex + 1]]);
        this.router.navigate(
          ['/leads/' + this.leadIds[this.currentIndex + 1] + '/edit'],
          {
            queryParams: { source: 'leadDetail' }
          }
        );
        this.currentIndex = this.currentIndex + 1;
        this.loadSelectedUser(this.leadIds[this.currentIndex]);
      } else {
        // this.router.navigate(['/leads/' + this.leadIds[this.currentIndex - 1]]);
        this.router.navigate(
          ['/leads/' + this.leadIds[this.currentIndex - 1] + '/edit'],
          {
            queryParams: { source: 'leadDetail' }
          }
        );
        this.currentIndex = this.currentIndex - 1;
        this.loadSelectedUser(this.leadIds[this.currentIndex]);
      }
    } else {
      this.alertService.warn(
        'Too many network callls, Please refresh the page '
      );
    }
  }

  leadDetailsUpdated(e: any) {
    this.leadDetailRightTab.updateQuestionnaireSubmission(e, true);
  }

  onCallQuestionaireApi() {
    this.handleCallQuestionaireApiCallback.emit();
  }

  loadSelectedUser(leadId: any) {
    this.selectedUserId = '';
    console.log(leadId);
    this.leadService.getQuestionnaireSubmission(leadId).then(
      (response: any) => {
        if (response && response.selectedUserId) {
          console.log(response);
          this.selectedUserId = response.selectedUserId;
          console.log('Selected User ID:', this.selectedUserId);
        } else {
          console.log('No user assigned');
        }
      },
      () => {
        this.alertService.error('Unable to load selected user.');
      }
    );
  }

  onUserSelected(event: any) {
    this.selectedUserId = event.target.value;
    this.isUserSelected = true;
    console.log(this.selectedUserId);
  }

  updateUser() {
    if (this.selectedUserId) {
      console.log('Selected UserId:', this.selectedUserId);
      this.leadService.updateUser(this.id, this.selectedUserId).then(
        () => {
          this.alertService.success('User updated successfully');
          console.log(this.selectedUserId);
          if (this.isUserSelected) {
            this.sendEmail(this.selectedUserId);
            this.isUserSelected = false;
          }
        },
        () => {
          this.alertService.error('Unable to update User');
        }
      );
    } else {
      this.alertService.error('No user selected');
    }
  }

  sendEmail(selectedUserId: any) {
    this.leadUserEmailForm.patchValue({
      leadId: this.id,
      userId: selectedUserId
    });
    console.log(this.leadUserEmailForm.value);
    var formData = this.leadUserEmailForm.value;
    this.leadService.sendLeadUserEmail(formData).then(
      () => {
        this.alertService.success('Email Sent Successfully.');
      },
      () => {
        this.alertService.error('Unable to send Email.');
      }
    );
  }
}
