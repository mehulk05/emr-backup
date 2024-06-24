import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToasTMessageService } from 'src/app/shared/services/toast-message.service';
// import sizeof from 'object-sizeof';
// import { environment } from 'src/environments/environment';
import { WebsiteService } from '../../service/website.service';
import { QuestionarieService } from 'src/app/modules/pateint/services/questionarie.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from 'src/app/modules/authentication/services/auth.service';
import { HtmlEditorComponent } from 'src/app/shared/reusableComponents/html-editor/html-editor.component';

@Component({
  selector: 'app-add-edit-website-new',
  templateUrl: './add-edit-website-new.component.html',
  styleUrls: ['./add-edit-website-new.component.css']
})
export class AddEditWebsiteNewComponent implements OnInit {
  @ViewChild('htmlEditor') htmlEditorComponent: HtmlEditorComponent;
  id: any = null;
  websitePageForm: FormGroup;
  showLibrary = false;
  backgroundColor: any;
  foregroundColor: any;
  titleColor: any;
  buttonBackgroundColor: string = null;
  buttonForegroundColor: string = null;
  editorValue = 'newEditor';
  editorVal: any;
  private _editor: any;
  link: any = null;
  businessId: any = null;
  domain =
    location.protocol +
    '//' +
    location.hostname +
    (location.port ? ':' + location.port : '');
  publicQuestionnaireUrl: any = null;
  questionnaireId: any = null;
  templateVal: any = '';
  editorProjectData: any = {};
  constructor(
    public formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertService: ToasTMessageService,
    private websiteService: WebsiteService,
    private authenticationService: AuthService,
    private questionarieService: QuestionarieService
  ) {}

  ngOnInit(): void {
    this.websitePageForm = this.formBuilder.group({
      name: ['', [Validators.required]],
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
      isWebsite: [true, []],
      buttonForegroundColor: null,
      titleColor: null,
      buttonBackgroundColor: null,
      grapesjsStore: null
    });

    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.id = params.get('id');
      this.authenticationService.currentUser.subscribe((currentUser) => {
        this.businessId = currentUser.businessId;
        this.questionarieService.getLeadCaptureForm().then((response: any) => {
          this.questionnaireId = response.id;
          this.publicQuestionnaireUrl =
            this.domain +
            '/assets/static/landing_page_form.html?bid=' +
            this.businessId +
            '&fid=' +
            this.questionnaireId;
          // var url = '<iframe style="height:610px;width:500px;border:0" src="' + this.publicQuestionnaireUrl + '" title="Contact Form"></iframe>';
          var url = this.publicQuestionnaireUrl;

          this.websitePageForm.patchValue({
            iframeUrl: url
          });
          this.websitePageForm.patchValue({
            formUrl: this.publicQuestionnaireUrl
          });
        });
      });
      if (this.id) {
        this.getLandingPage();
        this.generateLandingPageUrl();
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
    this.router.navigate(['/website']);
  }

  get f() {
    return this.websitePageForm.controls;
  }

  resetTheme() {
    this.buttonBackgroundColor = null;
    this.buttonForegroundColor = null;
    this.backgroundColor = null;
    this.titleColor = null;
    this.websitePageForm.patchValue({
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
      this.websitePageForm.patchValue({
        // backgroundColor: event.color.hex,
        buttonBackgroundColor: event.color.hex
      });
      this.buttonBackgroundColor = event.color.hex;
    } else {
      this.websitePageForm.patchValue({
        // backgroundColor: event.color.hex,
        buttonBackgroundColor: event
      });
      this.buttonBackgroundColor = event;
    }
  }

  onForegroundColorChange(event: any) {
    if (event.color) {
      this.websitePageForm.patchValue({
        buttonForegroundColor: event.color.hex
      });
      this.buttonForegroundColor = event.color.hex;
    } else {
      this.websitePageForm.patchValue({
        buttonForegroundColor: event
      });
      this.buttonForegroundColor = event;
    }
  }

  ontitleColorChange(event: any) {
    if (event.color) {
      this.websitePageForm.patchValue({
        titleColor: event.color.hex
      });
      this.titleColor = event.color.hex;
    } else {
      this.websitePageForm.patchValue({
        titleColor: event
      });
      this.titleColor = event;
    }
  }

  onFormSubmit() {
    console.log('we', this.editorVal);
    // if (this.editorValue === 'oldEditor') {
    //   const editorData = this.htmlEditorComponent.getEditorData();
    //   this.websitePageForm.patchValue({
    //     landingPageTemplate: editorData.htmlData,
    //     grapesjsStore: {
    //       ...this.websitePageForm.value.grapesjsStore,
    //       htmlStoreConfig: editorData.projectData ?? '{}'
    //     }
    //   });
    // } else {
    //   this.websitePageForm.controls.landingPageTemplate.patchValue(
    //     this.editorVal
    //   );
    // }

    this.websitePageForm.value.landingPageTemplate = this.editorVal;
    console.log('form', this.websitePageForm.value);
    if (this.websitePageForm.value.buttonBackgroundColor) {
      console.log('form2', this.websitePageForm.value);
      let buttonCss = this.websitePageForm.value.buttonCSS;
      buttonCss = buttonCss.trim();
      var cleanedButtonCss = buttonCss.split('}\nbutton');

      cleanedButtonCss = cleanedButtonCss[0];
      cleanedButtonCss = cleanedButtonCss.split('}button')[0] + '}';
      console.log(cleanedButtonCss);
      const buttonCSS =
        cleanedButtonCss +
        'button {background:' +
        this.websitePageForm.value.buttonBackgroundColor +
        ' !important; color:' +
        this.websitePageForm.value.buttonForegroundColor +
        ' !important }';
      this.websitePageForm.controls.buttonCSS.patchValue(buttonCSS);
    } else {
      const buttonCss = this.websitePageForm.value.buttonCSS.split(
        'button {background:'
      );
      console.log(buttonCss);
      this.websitePageForm.controls.buttonCSS.patchValue(buttonCss[0]);
    }
    // this.websitePageForm.value.landingPageTemplate = this.editorVal;
    console.log('form23', this.websitePageForm.value);
    console.log('Entered in submit', this.websitePageForm.valid);
    if (!this.websitePageForm.valid) {
      console.log('INVALid');
      let control;
      Object.keys(this.websitePageForm.controls)
        .reverse()
        .forEach((field) => {
          if (this.websitePageForm.get(field).invalid) {
            control = this.websitePageForm.get(field);
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
    // if (sizeof(this.websitePageForm.value) > environment.FORM_MAX_SIZE) {
    //   this.alertService.error('LandingPage size is greater than 2 MB');
    //   return;
    // } else {
    if (this.id) {
      this.submitFormUpdate();
    } else {
      this.submitFormCreate();
    }
    // }
  }

  //submitFormUpdate
  submitFormUpdate() {
    if (this.websitePageForm.value.landingPageTemplate === undefined) {
      console.log('twmpl', this.templateVal);
      this.websitePageForm.value.landingPageTemplate = this.templateVal;
    }
    const formData = this.websitePageForm.value;
    console.log('formdata', formData);
    this.websiteService.update(this.id, formData).then(
      (result: any) => {
        console.log('res', result);
        this.alertService.success('Website updated successfully.');
        this.back();
      },
      () => {
        this.alertService.success('Unable to updated Website.');
      }
    );
  }

  submitFormCreate() {
    const formData = this.websitePageForm.value;
    console.log('formdata......', formData);
    this.websiteService.create(formData).then(
      () => {
        this.alertService.success('Website saved successfully.');
        this.back();
      },
      () => {
        this.alertService.error('Website unable to save.');
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

  copyLink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.link;
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
    this.websiteService.getEditLandingPage(this.id).then(
      (response: any) => {
        console.log('res', response);
        this.websitePageForm.patchValue(response);
        this.backgroundColor = response.buttonBackgroundColor;
        this.templateVal = response.landingPageTemplate;
        this.websitePageForm.patchValue({
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
          this.link =
            this.domain +
            '/assets/static/landingpage.html?bid=' +
            this.businessId +
            '&lpid=' +
            this.id;
        }
      },
      (error: any) => {
        console.log('err', error);
        this.alertService.error('Unable to load landing page.');
      }
    );
  }

  generateLandingPageUrl() {
    try {
      this.link =
        this.domain +
        '/assets/static/landingpage.html?bid=' +
        this.businessId +
        '&lpid=' +
        this.id;
    } catch (error) {}
  }
}
