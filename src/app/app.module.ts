import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponent } from './app-routing.module';
import { AppComponent } from './app.component';
import { UsersComponent } from './users/users.component';
import { JocaListComponent } from './joca-list/joca-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import { EmployeeDetailComponent } from './employee-detail/employee-detail.component';
import { EmployeeService } from './employee.service';
import { HttpClientModule } from '@angular/common/http';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DepartmentDetailComponent } from './department-detail/department-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    UsersComponent,
    JocaListComponent,
    EmployeeListComponent,
    EmployeeDetailComponent,

    routingComponent,

    PageNotFoundComponent,

    DepartmentDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [EmployeeService],
  bootstrap: [AppComponent],
})
export class AppModule {}
