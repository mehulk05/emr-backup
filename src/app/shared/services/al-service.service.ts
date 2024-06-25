import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { environment } from 'src/environments/environment';
import { ApiService } from './api.service';
import { HttpHelperService } from './HttpHelperService';
import oboe from 'oboe';

@Injectable({
  providedIn: 'root'
})
export class AlServiceService {
  private businessData = new BehaviorSubject<any>({});
  url = environment.SERVER_AI_API_URL;

  constructor(
    private httpHelperService: HttpHelperService,
    private apiService: ApiService
  ) {}

  getBusinessData() {
    return this.businessData.asObservable();
  }

  setData(data: any) {
    return this.businessData.next(data);
  }

  getAiStream(searchedTitle: any, callback: any, type: any) {
    const data = { text: searchedTitle };
    var config = {
      url: environment.SERVER_AI_API_URL + '/ai/chatgpt/stream',
      method: 'POST',
      body: data,
      cached: false
    };
    const oboeService = oboe(config);
    oboeService
      .node('!', (data: any) => {
        console.log(data);
        callback(data['data'], type);
      })
      .fail((data: any) => {
        console.log(data);
      });
  }

  getAiStreamImage(
    searchedTitle: any,
    imageSize: any,
    numberOfimages: any,
    callback: any,
    type: any
  ) {
    const data = {
      text: searchedTitle,
      size: imageSize,
      numImages: numberOfimages
    };
    var config = {
      url: environment.SERVER_AI_API_URL + '/ai/chatgpt/image',
      method: 'POST',
      body: data,
      cached: false
    };
    const oboeService = oboe(config);
    oboeService
      .node('!', (data: any) => {
        console.log(data);
        callback(data, type);
      })
      .fail((data: any) => {
        console.log(data);
      });
  }

  getAiStreamText(searchedTitle: any) {
    const apiUrl = `/api/ai/chatgpt/stream`;
    const data = {
      text: searchedTitle
    };
    return this.apiService.post(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }

  getAiStreamImageData(
    searchedTitle: any,
    imageSize: any,
    numberOfimages: any
  ) {
    const data = {
      text: searchedTitle,
      size: imageSize,
      numImages: numberOfimages
    };

    const apiUrl = `/api/ai/chatgpt/image`;
    return this.apiService.post(
      apiUrl,
      data,
      '',
      false,
      this.httpHelperService.getTenantHttpOptions()
    );
  }
}
