import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Import LoginComponent
import { SearchComponent } from './search/search.component';
import { SearchDetailComponent } from './search/search-detail/search-detail.component';
import { HomeComponent } from './home/home.component';
import { SamplingComponent } from './sampling/sampling.component';
import { SamplingDoComponent } from './sampling/sampling-do/sampling-do.component';
import { SamplingViewComponent } from './sampling/sampling-view/sampling-view.component';
import { SamplingPrintComponent } from './sampling/sampling-print/sampling-print.component';
import { RegisterComponent } from './register/register.component';
import { RegisterBoxComponent } from './register/register-box/register-box.component';
import { RegisterCustomerComponent } from './register/register-customer/register-customer.component';
import { CustomerListComponent } from './customer-list/customer-list.component';
import { AuthGuard } from './auth.guard';
import { MaintenanceComponent } from './maintenance/maintenance.component';
import { RegisterImportComponent } from './register/register-import/register-import.component';
import { RegisterImportCustomizeComponent } from './register/register-import/register-import-customize/register-import-customize.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect root path to login
  { path: 'login', component: LoginComponent },  // Set LoginComponent for '/login'
  
  // Protect the 'home' route with authGuard
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },  

  // Other routes
  { path: 'register', component: RegisterComponent },
  { path: 'register-box', component: RegisterBoxComponent },
  { path: 'register-customer', component: RegisterCustomerComponent },
  { path: 'register-import', component: RegisterImportComponent },
  { path: 'register-import-customize', component: RegisterImportCustomizeComponent },
  { path: 'sampling', component: SamplingComponent },
  { path: 'sampling-do', component: SamplingDoComponent },
  { path: 'sampling-do/:noBox', component: SamplingDoComponent },
  { path: 'sampling-view', component: SamplingViewComponent },
  { path: 'sampling-view/:noBox', component: SearchDetailComponent },
  { path: 'sampling-print', component: SamplingPrintComponent },
  { path: 'sampling-print/:noBox', component: SamplingPrintComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search-detail/:noBox', component: SearchDetailComponent },
  { path: 'customer-list', component: CustomerListComponent },
  { path: 'maintenance', component: MaintenanceComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
