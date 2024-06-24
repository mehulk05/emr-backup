import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { VirtualConsulationService } from '../../../services/virtual-consulation.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-add-dental-symptom-modal',
  templateUrl: './add-dental-symptom-modal.component.html',
  styleUrls: ['./add-dental-symptom-modal.component.css']
})
export class AddDentalSymptomModalComponent implements OnInit {
  isLoading: boolean;
  showModal: boolean = true;
  addSymptomForm: FormGroup;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onModalClose: any = new EventEmitter();
  constructor(
    private formBuilder: FormBuilder,
    private dentalVc: VirtualConsulationService
  ) {}

  ngOnInit(): void {
    this.addSymptomForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      imgUrl: ['', []]
    });
  }

  addNewSymptom() {
    const formData = new FormData();
    formData.append('name', this.f.name.value);
    formData.append('imgUrl', this.dataURItoBlob(this.croppedImage));

    from(this.dentalVc.createSymptomModel(formData)).subscribe(
      (response) => {
        console.log('Form submitted successfully', response);
        this.isLoading = false;
        this.showModal = false;
        this.onModalClose.emit({ close: true, type: 'save' });
      },
      (error) => {
        console.error('Error submitting form', error);
        this.isLoading = false;
      }
    );
  }

  onCancel() {
    this.onModalClose.emit({ close: true, type: 'cancel' });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  get f() {
    return this.addSymptomForm.controls;
  }

  dataURItoBlob(dataURI: string): Blob {
    const byteString = atob(dataURI.split(',')[1]);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }

    return new Blob([int8Array], { type: 'image/jpeg' });
  }
}
