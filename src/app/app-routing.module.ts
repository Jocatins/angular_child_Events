import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DepartmentDetailComponent } from './department-detail/department-detail.component';
import { DepartmentListComponent } from './department-list/department-list.component';
import { EmploymentListComponent } from './employment-list/employment-list.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  { path: '', redirectTo: '/department', pathMatch: 'full' },
  { path: 'department', component: DepartmentListComponent },
  { path: 'department/:id', component: DepartmentDetailComponent },
  { path: 'employees', component: EmploymentListComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
export const routingComponent = [
  DepartmentListComponent,
  EmploymentListComponent,
  PageNotFoundComponent,
  DepartmentDetailComponent,
];
