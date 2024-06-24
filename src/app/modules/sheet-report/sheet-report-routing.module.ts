import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SheetDataComponent } from './components/sheet-data/sheet-data.component';

const routes: Routes = [
  {
    path: '',
    component: SheetDataComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SheetReportRoutingModule {}
