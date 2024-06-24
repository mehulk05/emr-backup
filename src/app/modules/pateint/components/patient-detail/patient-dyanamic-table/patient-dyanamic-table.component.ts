import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patient-dyanamic-table',
  templateUrl: './patient-dyanamic-table.component.html',
  styleUrls: ['./patient-dyanamic-table.component.css']
})
export class PatientDyanamicTableComponent implements OnInit {
  constructor() {}
  tableData: any[][] = [];
  numColumns: number = 3;
  headerData: string[] = [];
  isFocused: boolean;
  ngOnInit(): void {
    this.headerData = this.getColumnHeaders();
  }

  getColumnHeaders() {
    const headers = [];
    for (let i = 0; i < this.numColumns; i++) {
      headers.push(`Column ${i + 1}`);
    }
    return headers;
  }

  onHeaderInput(event: any, i: number) {
    this.headerData[i] = (event.target as HTMLInputElement).value;
    console.log('header');
  }

  addRowAfter(rowIndex: number) {
    const newRow = [];
    for (let i = 0; i < this.numColumns; i++) {
      newRow.push('');
    }
    this.tableData.splice(rowIndex + 1, 0, newRow);
  }

  onCellInput(event: any, i: number, j: number) {
    this.tableData[i][j] = (event.target as HTMLInputElement).value;
  }

  addRow() {
    const newRow = [];
    for (let i = 0; i < this.numColumns; i++) {
      newRow.push('a');
    }
    this.tableData.push(newRow);
  }

  addColumn() {
    const numRows = this.tableData.length;
    const numCols = this.headerData[0].length;
    if (numCols < this.numColumns) {
      for (let i = 0; i < numRows; i++) {
        for (let j = numCols; j < this.numColumns; j++) {
          this.tableData[i].push('');
        }
      }
    } else if (numCols > this.numColumns) {
      for (let i = 0; i < numRows; i++) {
        this.tableData[i] = this.tableData[i].slice(0, this.numColumns);
      }
    }
  }

  onNumColumnsChange() {
    this.addColumn();
    this.headerData = this.getColumnHeaders();
  }
  removeRow(rowIndex: number) {
    this.tableData.splice(rowIndex, 1);
  }

  onSave() {
    const tableObj = [];

    for (let i = 0; i < this.tableData.length; i++) {
      const rowObj: any = {};

      for (let j = 0; j < this.headerData.length; j++) {
        rowObj[this.headerData[j]] = this.tableData[i][j];
      }

      tableObj.push(rowObj);
    }

    console.log(tableObj, this.tableData);
  }
}
