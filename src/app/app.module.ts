import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormBuilder, FormsModule, NgForm } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { RegisterDetailComponent } from './register/register-detail/register-detail.component';
import { RegisterNewComponent } from './register/register-new/register-new.component';
import { SamplingComponent } from './sampling/sampling.component';
import { SamplingDoComponent } from './sampling/sampling-do/sampling-do.component';
import { SamplingViewComponent } from './sampling/sampling-view/sampling-view.component';
import { SearchComponent } from './search/search.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldControl, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SearchDetailComponent } from './search/search-detail/search-detail.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner"
import { SamplingPrintComponent } from './sampling/sampling-print/sampling-print.component';
import { RegisterBoxComponent } from './register/register-box/register-box.component';
import { RegisterCustomerComponent } from './register/register-customer/register-customer.component';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { RegisterImportComponent } from './register/register-import/register-import.component';
import { CustomerService } from "./customer.service"
import { Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { RegisterImportCustomizeComponent } from './register/register-import/register-import-customize/register-import-customize.component';
import { MatPaginatorModule } from "@angular/material/paginator"
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DashboardComponent } from './login/dashboard/dashboard.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    RegisterComponent,
    RegisterDetailComponent,
    RegisterNewComponent,
    SamplingComponent,
    SamplingDoComponent,
    SamplingViewComponent,
    SearchComponent,
    CustomerListComponent,
    SearchDetailComponent,
    SamplingPrintComponent,
    RegisterBoxComponent,
    RegisterCustomerComponent,
    MaintenanceComponent,
    RegisterImportComponent,
    RegisterImportCustomizeComponent,
    DashboardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatRadioModule,
    MatListModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatTableModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTooltip,
    MatCheckboxModule
  ],
  providers: [
    provideAnimationsAsync(),
    CustomerService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
