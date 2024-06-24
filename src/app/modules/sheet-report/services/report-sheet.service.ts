import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReportSheetService {
  private apiKey: string = 'AIzaSyAmwP-svnejk4RLwuuB7Lw34x-9Tz_A0fI';
  private sheetId: string = '1HFqdxWFy6Blc5_mg_a39JLgzAHbQkhVAwekcRkIVqKk'; // Replace with your actual Sheet ID

  constructor(private http: HttpClient) {}

  public getSheetData(): Observable<any> {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}?key=${this.apiKey}&includeGridData=true`;
    return this.http.get(url);
  }
}
