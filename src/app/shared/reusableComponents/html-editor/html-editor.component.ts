import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
// @ts-ignore
import grapesjs from 'grapesjs';
import { plugin } from './pluginsConfig/plugin';
import StyleConfig from './pluginsConfig/styleConfig';
import LayoutMap from './pluginsConfig/layoutConfig';
import { LocalStorageService } from '../../services/local-storage.service';
import { HelperSharableService } from '../../services/helperService/helper-sharable.service';
import 'grapesjs-plugin-ckeditor';
import { environment } from 'src/environments/environment';
import { ToasTMessageService } from '../../services/toast-message.service';

@Component({
  selector: 'app-html-editor',
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.css']
})
export class HtmlEditorComponent implements OnInit, OnChanges, OnDestroy {
  @Input() projectData: any = '{}';
  @Input() htmlTemplateValue: any = '';
  @Input() showSaveCancelButton: boolean = true;
  @ViewChild('blocksTab') blocksTab!: ElementRef;
  @ViewChild('stylesTab') stylesTab!: ElementRef;
  editor: any = {};
  LAYOUTMAP: any = LayoutMap;
  businessInfo: any;
  defaultClinic: any;
  isEditorVisible: boolean = true;
  ckeditorScriptId: string = 'gjs-ckeditor-script';
  publicForms: any[] = [];
  assets: any[] = [];
  showSelectReviewsPopup = false;
  reviewsData = {};
  reviewSelectId: any;
  constructor(
    private localStorageService: LocalStorageService,
    private helperSharableService: HelperSharableService,
    private toastService: ToasTMessageService
  ) {}
  ngOnInit(): void {
    const ckeditorScript = document.createElement('script');
    ckeditorScript.setAttribute(
      'src',
      'https://cdn.ckeditor.com/4.16.1/full-all/ckeditor.js'
    );
    ckeditorScript.setAttribute('id', this.ckeditorScriptId);
    document.head.appendChild(ckeditorScript);
    ckeditorScript.addEventListener('load', () => {
      this.businessInfo = this.localStorageService.readStorage('businessInfo');
      this.defaultClinic =
        this.localStorageService.readStorage('defaultClinic');
      this.initializeDataAndEditor();
      setTimeout(() => {
        this.switchToBlocksTab();
      }, 1000);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.editor.editor) {
      if (changes['htmlTemplateValue']) {
        this.editor.setComponents(this.htmlTemplateValue);
        this.resetEditorVisibility();
      }
      if (
        changes['projectData'] &&
        Object.keys(changes['projectData']).length > 0
      ) {
        this.editor.loadProjectData(JSON.parse(this.projectData));
      }
    }
  }

  ngOnDestroy(): void {
    document.getElementById(this.ckeditorScriptId).remove();
  }

  @HostListener('window:message', ['$event'])
  onMessage(event: any) {
    if (event.origin !== window.location.origin) {
      return;
    }
    if (event.data?.type === 'select-review') {
      this.showSelectReviewsPopup = true;
      this.reviewSelectId = event.data.id;
    }
  }

  initializeDataAndEditor() {
    const promises: any[] = [];
    if (this.businessInfo && !this.defaultClinic) {
      promises.push({
        promise: this.helperSharableService.getDefaultCinic(),
        callback: (defaultClinic: any) => {
          this.defaultClinic = defaultClinic;
          this.localStorageService.storeItem('defaultClinic', defaultClinic);
          this.initializeReviews();
        }
      });
    } else {
      this.initializeReviews();
    }
    promises.push({
      promise: this.helperSharableService.getQuestionnairesByType('PUBLIC'),
      callback: (forms: any[]) => {
        const publicForms =
          forms?.map((form) => {
            return { id: form.id, label: form.name };
          }) ?? [];
        this.publicForms = publicForms;
      }
    });
    promises.push({
      promise: this.helperSharableService.getEditorAssets(),
      callback: (response: any) => {
        this.assets = response ?? [];
      }
    });

    if (promises.length == 0) {
      this.initializeEditor();
    } else {
      Promise.all(promises.map((p) => p.promise)).then((responses) => {
        responses.forEach((response, i) => {
          promises[i].callback.apply(this, [response]);
        });
        this.initializeEditor();
      });
    }
  }

  initializeReviews() {
    this.fetchReviews('', 1);
  }

  fetchReviews(searchText: string, pagNumber: number) {
    this.helperSharableService
      .searchClinicReviews(this.defaultClinic.id, searchText, pagNumber)
      .subscribe((response: any) => {
        this.reviewsData = response;
      });
  }

  searchReview(e: any) {
    this.fetchReviews(e.searchText, e.pageNumber);
  }

  setEvents(editor: any) {
    editor.on('canvas:drop', (e: any, model: any) => {
      editor.select(model);
    });
    editor.on('component:selected', () => {
      this.switchToStyles();
    });
  }

  initializeEditor(): any {
    const formUrl = `${environment.OLD_EMR_DOMAIN}/assets/static/form.html?bid=${this.businessInfo.id}&agencyId=${this.businessInfo.agency.id}&fid=`;
    const businessInfo = {
      businessName: this.businessInfo.name,
      businessLogo: this.businessInfo.logoUrl,
      agencyName: this.businessInfo.agency.name,
      agencyLogo: this.businessInfo.agency.logoUrl
    };
    const clinicInfo = {
      clinicAbout: this.defaultClinic.about,
      clinicAddress: this.defaultClinic.address,
      clinicContactNumber: this.defaultClinic.contactNumber,
      clinicWebsite: this.defaultClinic.website
    };
    const formData = {
      formUrl,
      formList: this.publicForms
    };
    const config: grapesjs.EditorConfig = {
      container: '#editor',
      height: '600px',
      storageManager: { type: null },
      autorender: true,
      forceClass: false,
      keepEmptyTextNodes: true,
      components: '',
      style: '',
      colorPicker: { appendTo: 'parent', offset: { top: 26, left: -166 } },
      blockManager: {
        appendTo: '#blocks',
        blocks: []
      },
      traitManager: {
        appendTo: '#traits-container'
      },
      styleManager: {
        appendTo: '#styles-manager-container',
        sectors: StyleConfig.styleManagerSectors
      },
      layerManager: {
        appendTo: '#layers-container',
        extend: {
          handleEdit() {
            console.log('Non Editable');
          }
        }
      },
      assetManager: {
        assets: this.assets,
        uploadText: 'Add image through link or upload image',
        modalTitle: 'Select Image',
        openAssetsOnDrop: 1,
        inputPlaceholder: 'http://url/to/the/image.jpg',
        addBtnText: 'Add image',
        uploadFile: (e: any) => {
          const file = e.dataTransfer
            ? e.dataTransfer.files[0]
            : e.target.files[0];
          const formData = new FormData();
          formData.append('file', file);

          this.helperSharableService.uploadEditorAsset(formData).then(
            (response: any) => {
              this.editor.AssetManager.add(response.location);
            },
            () => {
              this.toastService.error('Unable to upload the file.');
            }
          );
        },
        handleAdd: (textFromInput: any) => {
          this.editor.AssetManager.add(textFromInput);
        }
      },
      // Enable undo and redo functionality
      undoManager: true,
      panels: {
        defaults: [
          {
            id: 'basic-actions',
            el: '.panel-actions',
            buttons: [
              {
                id: 'visibility',
                active: true,
                attributes: { title: 'Visibility' },
                className: 'fas fa-expand',
                command: 'sw-visibility' // Built-in command
              },
              {
                id: 'preview',
                active: true,
                attributes: { title: 'Preview' },
                className: 'fa fa-eye',
                command: (e: any) => e.runCommand('preview')
              },
              {
                id: 'expt',
                active: true,
                className: 'fa fa-code',
                command: 'export-template',
                attributes: { title: 'View code' }
              },
              {
                id: 'undo-btn',
                active: true,
                attributes: { title: 'Undo' },
                className: 'fa fa-undo',
                command: (e: any) => e.runCommand('core:undo')
              },
              {
                id: 'redo-btn',
                active: true,
                attributes: { title: 'Redo' },
                className: 'fa fa-redo',
                command: (e: any) => e.runCommand('core:redo')
              },
              {
                id: 'canvas-clear',
                active: true,
                attributes: { title: 'Clear canvas' },
                className: 'fa fa-trash',
                command: (e: any) => e.runCommand('core:canvas-clear')
              }
            ]
          },
          {
            id: 'panel-devices',
            el: '.panel-devices',
            buttons: [
              {
                id: 'device-desktop',
                label:
                  '<span class="header-icon" title="Desktop" style="color: #ffffff"><i class="fas fa-laptop" aria-hidden="true"></i></span>',
                command: 'set-device-desktop',
                active: true,
                togglable: false
              },
              {
                id: 'device-tablet',
                label:
                  '<span class="header-icon" title="Tablet" style="color: #ffffff"><i class="fas fa-tablet-alt" aria-hidden="true"></i></span>',
                command: 'set-device-tablet',
                active: true,
                togglable: false
              },
              {
                id: 'device-mobile',
                label:
                  '<span class="header-icon" title="Mobile" style="color: #ffffff"><i class="fas fa-mobile-alt" aria-hidden="true"></i></span>',
                command: 'set-device-mobile',
                togglable: false
              }
            ]
          }
        ]
      },
      deviceManager: {
        devices: [
          {
            name: 'Desktop',
            width: ''
          },
          {
            name: 'Tablet',
            width: '800px',
            widthMedia: '810px'
          },
          {
            name: 'Mobile',
            width: '320px',
            widthMedia: '480px'
          }
        ]
      },
      plugins: ['gjs-plugin-ckeditor', plugin],
      pluginsOpts: {
        'gjs-plugin-ckeditor': {
          onToolbar: (el: any) => {
            el.style.minWidth = '350px';
          },
          options: {
            startupFocus: true,
            extraAllowedContent: '*(*);*{*}', // Allows any class and any inline style
            allowedContent: true, // Disable auto-formatting, class removing, etc.
            enterMode: 2, // CKEDITOR.ENTER_BR,
            extraPlugins: 'sharedspace,justify,colorbutton,panelbutton,font',
            toolbar: [
              { name: 'styles', items: ['Font', 'FontSize'] },
              ['Bold', 'Italic', 'Underline', 'Strike'],
              { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
              { name: 'links', items: ['Link', 'Unlink'] },
              { name: 'colors', items: ['TextColor', 'BGColor'] }
            ]
          }
        },
        // @ts-ignore
        [plugin]: {
          businessInfo,
          clinicInfo,
          formData
        }
      }
    } as any;
    const editor = grapesjs.init(config);

    // Events
    this.setEvents(editor);

    this.editor = editor;
    this.editor?.SelectorManager.setComponentFirst(true);
    this.editor.Parser.getConfig().keepEmptyTextNodes = true;
    if (this.htmlTemplateValue) {
      this.editor.setComponents(this.htmlTemplateValue);
      this.resetEditorVisibility();
    }
    if (this.projectData && Object.keys(this.projectData).length > 0) {
      this.editor.loadProjectData(JSON.parse(this.projectData));
    }
    // this.resetEditorVisibility();
  }

  layoutSelected(layout: any) {
    const container = this.LAYOUTMAP[layout];

    this.editor.addComponents(container, {
      at: this.editor?.Components.getComponents().size() ?? 0
    });
    this.resetEditorVisibility();
  }

  switchToBlocksTab() {
    this.blocksTab.nativeElement.click();
  }

  switchToStyles() {
    this.stylesTab.nativeElement.click();
  }

  getEditorData() {
    const html = this.editor.getHtml();
    let css = this.editor.getCss({ keepUnusedStyles: true });
    if (css) {
      css = `<style>${css}</style>`;
    }
    let htmlData = '';
    htmlData += html ?? '';
    htmlData += css ?? '';
    return {
      htmlData,
      projectData: JSON.stringify(this.editor.getProjectData())
    };
  }

  performSave(): void {
    const editorData = this.getEditorData();
    console.log(editorData.htmlData);
  }

  performCancel(): void {
    console.log('Cancelled');
  }

  resetEditorVisibility() {
    if (this.editor && this.editor.Components?.getComponents().size() > 0) {
      this.isEditorVisible = true;
      !this.editor.Commands.isActive('sw-visibility') &&
        this.editor.runCommand('sw-visibility');
    } else {
      this.isEditorVisible = false;
    }
  }

  closeSelectReviewsPopup(e: any) {
    this.showSelectReviewsPopup = false;
    if (e.isSelected) {
      const reviewComponent = this.editor.getSelected();
      reviewComponent.set('customReview', {
        id: this.reviewSelectId,
        review: e.selectReview
      });
    }
  }
}
