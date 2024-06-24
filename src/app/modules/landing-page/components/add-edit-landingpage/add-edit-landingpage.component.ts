import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
// import sizeof from 'object-sizeof';
import { environment } from 'src/environments/environment';
import { LandingPageService } from '../../service/landing-page.service';
import { QuestionarieService } from 'src/app/modules/pateint/services/questionarie.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { OldEditorComponent } from 'src/app/shared/reusableComponents/old-editor/old-editor.component';
// import { HtmlEditorComponent } from 'src/app/shared/reusableComponents/html-editor/html-editor.component';
import { noWhitespaceValidator } from 'src/app/modules/authentication/whitespace-validator';

@Component({
  selector: 'app-add-edit-landingpage',
  templateUrl: './add-edit-landingpage.component.html',
  styleUrls: ['./add-edit-landingpage.component.css']
})
export class AddEditLandingpageComponent implements OnInit {
  @ViewChild('oldEditor') oldEditorComponent: OldEditorComponent;
  // @ViewChild('htmlEditor') htmlEditorComponent: HtmlEditorComponent;
  id: any = null;
  landingPageForm: FormGroup;
  showLibrary = false;
  backgroundColor: any;
  foregroundColor: any;
  titleColor: any;
  buttonBackgroundColor: string = null;
  buttonForegroundColor: string = null;
  editorValue = 'oldEditor';
  editorVal: any;
  private _editor: any;
  link: any = null;
  businessId: any = null;
  landingPage: any = null;
  domain =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
  publicQuestionnaireUrl: any = null;
  questionnaireId: any = null;
  templateVal: any = '';
  editorProjectData: any = {};
  ssrDomain = environment.SSR_DOMAIN;
  message = '';
  category = '';
  totalCharacterLength = 8000;
  showAiModal = false;
  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: ToasTMessageService,
    private landingPageService: LandingPageService,
    private authenticationService: AuthService,
    private questionarieService: QuestionarieService
  ) {}

  ngOnInit(): void {
    this.landingPageForm = this.formBuilder.group({
      name: ['', [Validators.required, noWhitespaceValidator()]],
      landingPageTemplate: [
        '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">',
        [Validators.required]
      ],
      active: [true, []],
      defaultLandingPage: [false, []],
      contactFormIntegration: ['popup', []],
      iframeUrl: ['', []],
      landingPageTrackCode: ['', []],
      showThankYouPage: [true, []],
      googleAnalyticsGlobalCode: ['', []],
      googleAnalyticsGlobalCodeUrl: ['', []],
      facebookPixelCode: ['', []],
      formUrl: ['', []],
      buttonCSS: ['', []],
      iframeCSS: ['', []],
      showPopupOnPageLoad: [false, []],
      isCustom: [false, []],
      isWebsite: [false, []],
      buttonForegroundColor: null,
      titleColor: null,
      buttonBackgroundColor: null,
      grapesjsStore: null
    });

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      if (this.authenticationService.currentUser) {
        this.authenticationService.currentUser.subscribe((currentUser) => {
          this.businessId = currentUser.businessId;
          this.loadBusiness();
          this.questionarieService
            .getLeadCaptureForm()
            .then((response: any) => {
              this.questionnaireId = response.id;
              this.publicQuestionnaireUrl =
                this.domain +
                '/assets/static/landing_page_form.html?bid=' +
                this.businessId +
                '&fid=' +
                this.questionnaireId;
              // var url = '<iframe style="height:610px;width:500px;border:0" src="' + this.publicQuestionnaireUrl + '" title="Contact Form"></iframe>';
              var url = this.publicQuestionnaireUrl;

              this.landingPageForm.patchValue({
                iframeUrl: url
              });
              this.landingPageForm.patchValue({
                formUrl: this.publicQuestionnaireUrl
              });
            });
        });
      }
      if (this.id) {
        this.getLandingPage();
      }
    });
  }

  changeEditor(edit: any) {
    if (edit === 'oldEditor') {
      this.editorValue = 'newEditor';
    } else {
      this.editorValue = 'oldEditor';
    }
  }

  back() {
    this.router.navigate(['/landingpage']);
  }

  get f() {
    return this.landingPageForm.controls;
  }

  resetTheme() {
    this.buttonBackgroundColor = null;
    this.buttonForegroundColor = null;
    this.backgroundColor = null;
    this.titleColor = null;
    this.landingPageForm.patchValue({
      // backgroundColor: event.color.hex,
      buttonBackgroundColor: this.buttonBackgroundColor,
      buttonForegroundColor: this.buttonForegroundColor,
      titleColor: this.titleColor
    });
  }

  selectTheme(bg: any, fg: any, title: any) {
    this.onBackgroundColorChange(bg);
    this.onForegroundColorChange(fg);
    this.ontitleColorChange(title);
  }

  onBackgroundColorChange(event: any) {
    if (event.color) {
      this.landingPageForm.patchValue({
        // backgroundColor: event.color.hex,
        buttonBackgroundColor: event.color.hex
      });
      this.buttonBackgroundColor = event.color.hex;
    } else {
      this.landingPageForm.patchValue({
        // backgroundColor: event.color.hex,
        buttonBackgroundColor: event
      });
      this.buttonBackgroundColor = event;
    }
  }

  onForegroundColorChange(event: any) {
    if (event.color) {
      this.landingPageForm.patchValue({
        buttonForegroundColor: event.color.hex
      });
      this.buttonForegroundColor = event.color.hex;
    } else {
      this.landingPageForm.patchValue({
        buttonForegroundColor: event
      });
      this.buttonForegroundColor = event;
    }
  }

  ontitleColorChange(event: any) {
    if (event.color) {
      this.landingPageForm.patchValue({
        titleColor: event.color.hex
      });
      this.titleColor = event.color.hex;
    } else {
      this.landingPageForm.patchValue({
        titleColor: event
      });
      this.titleColor = event;
    }
  }

  onFormSubmit() {
    // if (this.editorValue === 'oldEditor') {
    //   const editorData = this.htmlEditorComponent.getEditorData();
    //   this.landingPageForm.patchValue({
    //     landingPageTemplate: editorData.htmlData,
    //     grapesjsStore: {
    //       htmlStoreConfig: editorData.projectData ?? '{}'
    //     }
    //   });
    // } else {
    //   this.landingPageForm.controls.landingPageTemplate.patchValue(
    //     this.editorVal
    //   );
    // }

    if (this.editorValue === 'oldEditor') {
      this.editorVal =
        this.oldEditorComponent.editor.getHtml() +
        '<style>' +
        this.oldEditorComponent.editor.getCss() +
        '</style>';
    }

    this.landingPageForm.controls.landingPageTemplate.patchValue(
      this.editorVal
    );

    if (this.landingPageForm.value.buttonBackgroundColor) {
      let buttonCss = this.landingPageForm.value.buttonCSS;
      buttonCss = buttonCss.trim();
      var cleanedButtonCss = buttonCss.split('}\nbutton');

      cleanedButtonCss = cleanedButtonCss[0];
      cleanedButtonCss = cleanedButtonCss.split('}button')[0] + '}';
      const buttonCSS =
        cleanedButtonCss +
        'button {background:' +
        this.landingPageForm.value.buttonBackgroundColor +
        ' !important; color:' +
        this.landingPageForm.value.buttonForegroundColor +
        ' !important }';
      this.landingPageForm.controls.buttonCSS.patchValue(buttonCSS);
    } else {
      const buttonCss = this.landingPageForm.value.buttonCSS.split(
        'button {background:'
      );
      console.log(buttonCss);
      this.landingPageForm.controls.buttonCSS.patchValue(buttonCss[0]);
    }
    // this.landingPageForm.value.landingPageTemplate = this.editorVal;
    if (!this.landingPageForm.valid) {
      console.log('INVALid');
      let control;
      Object.keys(this.landingPageForm.controls)
        .reverse()
        .forEach((field) => {
          if (this.landingPageForm.get(field).invalid) {
            control = this.landingPageForm.get(field);
            control.markAsDirty();
          }
        });

      if (control) {
        const el = $('.ng-invalid:not(form):first');
        $('html,body').animate(
          { scrollTop: el.offset().top - 20 },
          'slow',
          () => {
            el.focus();
          }
        );
      }
      return;
    }
    // if (sizeof(this.landingPageForm.value) > environment.FORM_MAX_SIZE) {
    //   this.alertService.error('LandingPage size is greater than 2 MB');
    //   return;
    // } else {
    if (this.id) {
      // this.deleteLandingPage();
      this.submitFormUpdate();
    } else {
      this.submitFormCreate();
    }
    // }
  }

  deleteLandingPage() {
    this.landingPageService.deleteLandingPage(this.id).then(
      () => {
        this.submitFormCreate();
      },
      () => {
        this.alertService.success('Unable to updated Landing.');
      }
    );
  }

  //submitFormUpdate
  submitFormUpdate() {
    // if (this.landingPageForm.value.landingPageTemplate === undefined) {
    //   console.log('twmpl', this.templateVal);
    //   this.landingPageForm.value.landingPageTemplate = this.templateVal;
    // }
    const formData = this.landingPageForm.value;
    console.log('formdata', formData);
    this.landingPageService.update(this.id, formData).then(
      (result: any) => {
        console.log('res', result);
        this.alertService.success('Landing page Updated Successfully.');
        this.back();
      },
      () => {
        this.alertService.success('Unable to updated Landing.');
      }
    );
  }

  submitFormCreate() {
    const formData = this.landingPageForm.value;
    console.log('formdata......', formData);
    this.landingPageService.create(formData).then(
      () => {
        this.alertService.success('Landing page saved successfully.');
        this.back();
      },
      () => {
        this.alertService.error(
          'Landing page name already exist please change the name to save the page.'
        );
      }
    );
  }

  onGetEditor(e: any) {
    console.log('e', e);
    this.editorVal = e.editorVal;
  }

  onGetOldEditor(e: any) {
    console.log('eold', e);
    this.editorVal = e.oldEditorVal;
    console.log('eold', this.editorVal);
  }

  aiModelClose(event: any) {
    if (event?.replace) {
      this.templateVal = event?.replaceData;
    }
    this.showAiModal = false;
  }

  copyLink(lpName: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value =
      this.ssrDomain + '/service/' + this.replaceSpecialCharacter(lpName);
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.alertService.success('Copied!');
  }

  previewLink() {
    window.open(this.link, '_blank');
  }

  getLandingPage() {
    this.landingPageService.getEditLandingPage(this.id).then(
      (response: any) => {
        this.landingPage = response;
        this.landingPageForm.patchValue(response);
        this.backgroundColor = response.buttonBackgroundColor;
        this.templateVal = response.landingPageTemplate;
        //this._editor.setComponents(response.landingPageTemplate);
        this.landingPageForm.patchValue({
          grapesjsStore: response.grapesjsStore ?? {}
        });
        this.editorProjectData =
          response.grapesjsStore?.htmlStoreConfig ?? '{}';
        if (response.isWebsite) {
          this.link =
            this.domain +
            '/assets/static/website.html?bid=' +
            this.businessId +
            '&lpid=' +
            this.id;
        } else {
          // this.link = this.domain + "/assets/static/landingpage.html?bid=" + this.businessId + "&lpid=" + this.id;
          this.link =
            this.domain +
            '/service/' +
            response.name.replace(/[^a-zA-Z0-9_-]+/g, '');
        }
      },
      () => {
        this.alertService.error('Unable to load landing page.');
      }
    );
  }

  replaceSpecialCharacter(name: any) {
    var name1 = name ? name.replace(/[^a-zA-Z0-9_-]+/g, '') : name;
    //console.log(name1)
    return name1;
  }

  loadBusiness() {
    this.landingPageService
      .getBusinessData(this.businessId)
      .then((response: any) => {
        if (response.subDomainName != null) {
          this.ssrDomain =
            location.protocol +
            '//' +
            response.subDomainName +
            '.' +
            environment.SSR_HOST;
        }
      });
  }
}
