import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from '@angular/core';

@Component({
  selector: 'app-any-provider-image',
  templateUrl: './any-provider-image.component.html',
  styleUrls: ['./any-provider-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnyProviderImageComponent implements OnInit {
  providers: any;
  imgUrlForAnyProvider: any[];
  @Input() set providerList(value: any) {
    this.providers = value;
  }
  @Input() provider: any;
  @Input() activeLinkStyle: any;
  constructor() {}

  ngOnInit(): void {
    this.getAnyProviderImage(this.providers);
  }

  getAnyProviderImage(providers: any[]) {
    const imgUrlForAnyProvider: any[] = [];
    providers.forEach(function (provider: any) {
      if (provider.profileImageUrl && imgUrlForAnyProvider.length < 2) {
        imgUrlForAnyProvider.push(provider.profileImageUrl);
      }
    });
    this.imgUrlForAnyProvider = imgUrlForAnyProvider;
  }
}
