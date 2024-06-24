import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { MenuConfigService } from '../../services/menu-config.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
  selector: 'app-business-menu-config',
  templateUrl: './business-menu-config.component.html',
  styleUrls: ['./business-menu-config.component.css']
})
export class BusinessMenuConfigComponent implements OnInit {
  menuList: any;
  result: any = [];
  businessId = '';

  isSidebarChanged: boolean = false;
  constructor(
    private alertService: ToastrService,
    private authenticationService: AuthService,
    private menuService: MenuConfigService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const userData = this.localStorageService.readStorage('businessInfo');
    console.log(userData);
    this.businessId = userData.id;
    this.loadDefaultMenus();
  }

  loadDefaultMenus() {
    // this.agencyService.getNewAgencyMenu(event).subscribe(response => {
    //   console.log(response)
    //   this.menuList = response;
    //   this.result = response.filter(item => item.enabled).map(item => item.id);
    // });

    this.result = [];

    this.menuService.getBusinessMenus(this.businessId).then(
      (response: any) => {
        this.menuList = response;

        for (let i = 0; i < response.length; i++) {
          console.log('MENUS==> ' + JSON.stringify(response));
          if (response[i].menuEnabled) {
            this.result.push(response[i].id);
          }
        }
      },
      () => {
        this.alertService.error('Unable to load default menus.');
      }
    );
  }

  updateResultArray(item: any) {
    console.log(item);
    if (item.menuEnabled) {
      this.result.push(item.id);
    } else {
      const index = this.result.indexOf(item.id);
      if (index !== -1) {
        this.result.splice(index, 1);
      }
    }
    this.saveMenu();
  }

  goBack() {
    // this.router.navigate(['/agency']);
  }

  saveMenu() {
    console.log(this.result);
    // this.menuService.updateBusinessMenuV1.then( this.result).subscribe(data=>{
    //   this.alertService.success("Updated Successfully");
    //   this.router.navigate(['/agency']);
    // }, error => {
    //     this.alertService.error("Getting some error while uploading menu");
    // });

    this.menuService
      .updateBusinessMenuV1(this.businessId, this.result)
      .then(() => {
        // this.alertService.success('Updated successfully.');
        this.localStorageService.removeStorage('sidebarData');
        this.authenticationService.isSidebarChanged.next(
          !this.isSidebarChanged
        );
        this.loadDefaultMenus();
      });
  }
}
