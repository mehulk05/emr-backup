import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lead-dyanamic-table',
  templateUrl: './lead-dyanamic-table.component.html',
  styleUrls: ['./lead-dyanamic-table.component.css']
})
export class LeadDyanamicTableComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    console.log('here');
  }

  tableData: any[][] = [];
  numColumns: number = 3;
  columnHeaders: string[] = [];

  getColumnHeaders() {
    const headers = [];
    for (let i = 0; i < this.numColumns; i++) {
      headers.push(this.columnHeaders[i] || `Column ${i + 1}`);
    }
    return headers;
  }

  onHeaderInput(event: any, i: number) {
    this.tableData[0][i] = (event.target as HTMLInputElement).value;
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
      newRow.push('');
    }
    this.tableData.push(newRow);
  }

  addColumn() {
    const numRows = this.tableData.length;
    const numCols = this.tableData[0].length;
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
  }
  removeRow(rowIndex: number) {
    this.tableData.splice(rowIndex, 1);
  }
}
