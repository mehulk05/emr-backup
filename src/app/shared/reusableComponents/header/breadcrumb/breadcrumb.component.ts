import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { isEqual } from 'lodash';
import { combineLatest, Subscription } from 'rxjs';
import { filter, distinctUntilChanged } from 'rxjs/operators';
import { MenuService } from 'src/app/shared/services/sidebar-menu.service';

export interface IBreadCrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.css']
})
export class BreadcrumbComponent implements OnInit {
  public breadcrumbs: IBreadCrumb[];

  breadCrumbFromParent: any = null;

  subscription = new Subscription();
  constructor(
    private router: Router,
    private sidebarService: MenuService,
    private activatedRoute: ActivatedRoute
  ) {
    this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
  }

  ngOnInit(): void {
    this.subscription.add(
      combineLatest(
        this.sidebarService.breadCrumbFromComponent,
        this.router.events.pipe(
          filter((event: any) => event instanceof NavigationEnd),
          distinctUntilChanged(isEqual)
        )
      )
        // this.sidebarService.breadCrumbFromComponent

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .subscribe(([breadCrumbData, _]: [any, any]) => {
          this.sidebarService.currentUrlSubject.next(this.router.url);
          this.breadcrumbs = this.buildBreadCrumb(this.activatedRoute.root);
          this.breadCrumbFromParent = breadCrumbData;
        })
    );
  }

  /**
   * Recursively build breadcrumb according to activated route.
   * @param route
   * @param url
   * @param breadcrumbs
   */
  buildBreadCrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: IBreadCrumb[] = []
  ): IBreadCrumb[] {
    route.data.pipe(distinctUntilChanged(isEqual)).subscribe((data) => {
      console.log('#63 breadycrym', data);
      if (data && Object.keys(data).length > 0) {
        this.sidebarService.sideBarInfoSubject.next(data);
      }
      return;
    });
    //If no routeConfig is avalailable we are on the root path
    const label =
      route.routeConfig && route.routeConfig.data
        ? route.routeConfig.data.breadcrumb
        : '';
    let path: any =
      route.routeConfig && route.routeConfig.data ? route.routeConfig.path : '';

    // If the route is dynamic route such as ':id', remove it
    const lastRoutePart: any = path.split('/').pop();

    const isDynamicRoute: any = lastRoutePart.startsWith(':');
    if (isDynamicRoute && !!route.snapshot) {
      const paramName = lastRoutePart.split(':')[1];
      path = path.replace(lastRoutePart, route.snapshot.params[paramName]);
      // label = route.snapshot.params[paramName];
    }

    //In the routeConfig the complete path is not available,
    //so we rebuild it each time
    const nextUrl = path ? `${url}/${path}` : url;

    const breadcrumb: IBreadCrumb = {
      label: label,
      url: nextUrl
    };
    // Only adding route with non-empty label
    const newBreadcrumbs = breadcrumb.label
      ? [...breadcrumbs, breadcrumb]
      : [...breadcrumbs];
    if (route.firstChild) {
      //If we are not on our current path yet,
      //there will be more children to look after, to build our breadcumb
      return this.buildBreadCrumb(route.firstChild, nextUrl, newBreadcrumbs);
    }
    if (route.routeConfig && route.routeConfig.data?.hideParent) {
      newBreadcrumbs.splice(0, 1);
    }
    console.log(route.routeConfig);
    // Disable parent breadcrumb link if parenClickable is false
    if (
      route.routeConfig &&
      route.routeConfig.data?.parenClickable === false &&
      newBreadcrumbs.length > 1
    ) {
      newBreadcrumbs[newBreadcrumbs.length - 2].url = null; // Disable clickable
    }
    if (route.routeConfig && route.routeConfig.data?.parentName) {
      newBreadcrumbs[0].label = route.routeConfig.data.parentName;

      /* -------------------------------------------------------------------------- */
      /*                   if parent breadcrumb has differnet url                   */
      /* -------------------------------------------------------------------------- */
    }
    if (route.routeConfig && route.routeConfig.data?.parentUrl) {
      let parentUrl = route.routeConfig.data.parentUrl;

      const id = route.snapshot.params['id'];
      parentUrl = parentUrl.replace(':id', id);

      newBreadcrumbs[0].url = parentUrl;
    }

    if (this.breadCrumbFromParent && newBreadcrumbs.length > 1) {
      // console.log(newBreadcrumbs);
      newBreadcrumbs[1].label = this.breadCrumbFromParent;
    }
    return newBreadcrumbs;
  }
}
