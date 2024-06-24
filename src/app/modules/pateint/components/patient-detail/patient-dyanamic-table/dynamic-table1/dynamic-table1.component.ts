import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dynamic-table1',
  templateUrl: './dynamic-table1.component.html',
  styleUrls: ['./dynamic-table1.component.css']
})
export class DynamicTable1Component implements OnInit {
  ngOnInit(): void {
    console.log('');
  }
  numColumns = 3;
  numFixedColumns = 3;
  columnNames = Array.from(
    { length: this.numColumns },
    (_, i) => `Column ${i + 1}`
  );
  rows: any = [{ 1: '', 2: '', 3: '' }];
  displayedColumns: any = this.columnNames.slice(0, this.numColumns);

  onNumColumnsChanged(e: any) {
    this.numColumns = parseInt(e.target.value, 10);
    this.columnNames = Array.from(
      { length: this.numColumns },
      (_, i) => `Column ${i + 1}`
    );
    this.displayedColumns = this.columnNames.slice(0, this.numColumns);

    this.rows.forEach((row: any) => {
      for (let i = this.numColumns + 1; i <= Object.keys(row).length; i++) {
        delete row[i];
      }
    });
  }

  addRow() {
    this.rows.push({});
  }

  submit() {
    const data = this.rows.map((row: any) => {
      const rowData: any = {};
      this.displayedColumns.forEach((column: any) => {
        rowData[column] = row[column];
      });
      return rowData;
    });
    console.log(data);
  }

  removeRow(index: number) {
    this.rows.splice(index, 1);
  }
  addRowByIndex(index: number) {
    this.rows.splice(index + 1, 0, {});
  }
}
