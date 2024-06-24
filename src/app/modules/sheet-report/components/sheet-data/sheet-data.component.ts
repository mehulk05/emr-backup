import { Component, OnInit } from '@angular/core';
import { ReportSheetService } from '../../services/report-sheet.service';

@Component({
  selector: 'app-sheet-data',
  templateUrl: './sheet-data.component.html',
  styleUrls: ['./sheet-data.component.css']
})
export class SheetDataComponent implements OnInit {
  sheetData: any[] = [];
  headers: any = [];

  supportDataInfo: any = [];
  supportHeaders: any = [];
  constructor(private googleSheetService: ReportSheetService) {}

  //   ngOnInit() {
  //     this.googleSheetService.getSheetData().subscribe((data) => {
  //       const rows = data.sheets[1].data[0].rowData;
  //       // Extract headers from the first row
  //       this.headers = rows[0].values.map((cell: any) => cell.formattedValue);
  //       // Map and filter out rows containing only undefined values
  //       this.sheetData = rows
  //         .slice(1) // Skip the header row
  //         .map((row: any) => row.values.map((cell: any) => cell.formattedValue))
  //         .filter((row: any) => !row.every((cell: any) => !cell)); // Filter out completely empty rows
  //     });
  //     console.log(this.sheetData);
  //   }
  // }

  ngOnInit() {
    this.googleSheetService.getSheetData().subscribe((data) => {
      const { sheetData, headers } = this.getSheetData(
        data.sheets[1].data[0].rowData
      );

      console.log(sheetData, headers);
      this.sheetData = sheetData;
      this.headers = headers;

      const { sheetData: supportData, headers: supportHeaders } =
        this.getSheetData(data.sheets[2].data[0].rowData);

      this.supportDataInfo = supportData;
      this.supportHeaders = supportHeaders;
    });
  }

  getSheetData(rows: any) {
    // Map and filter out rows containing only undefined values
    const sheetData = rows
      .map((row: any) =>
        this.cleanRowData(row.values.map((cell: any) => cell.formattedValue))
      )
      .filter((row: any) => row.length > 0)
      .filter((row: any) => !row.every((cell: any) => !cell)); // Filter out completely empty rows

    // const headers = this.sheetData[0].map((cell: any) => cell.formattedValue);
    const headers = sheetData.length > 0 ? sheetData.slice(0, 1)[0] : [];
    console.log(sheetData, headers);

    return { sheetData, headers };
  }

  cleanRowData(row: any[]): any[] {
    // Find the index of the last non-null value
    let lastIndex = row.length - 1;
    while (
      lastIndex >= 0 &&
      (row[lastIndex] === null ||
        row[lastIndex] === undefined ||
        row[lastIndex] === '')
    ) {
      lastIndex--;
    }
    // Return the slice of the row array up to lastIndex
    return row.slice(0, lastIndex + 1);
  }
}
