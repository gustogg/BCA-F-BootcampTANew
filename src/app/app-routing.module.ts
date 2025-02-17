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
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard]  },
  { path: 'register-box', component: RegisterBoxComponent, canActivate: [AuthGuard]  },
  { path: 'register-customer', component: RegisterCustomerComponent, canActivate: [AuthGuard]  },
  { path: 'register-import', component: RegisterImportComponent, canActivate: [AuthGuard]  },
  { path: 'register-import-customize', component: RegisterImportCustomizeComponent, canActivate: [AuthGuard]  },
  { path: 'sampling', component: SamplingComponent, canActivate: [AuthGuard]  },
  { path: 'sampling-do', component: SamplingDoComponent, canActivate: [AuthGuard]  },
  { path: 'sampling-do/:noBox', component: SamplingDoComponent, canActivate: [AuthGuard]  },
  { path: 'sampling-view', component: SamplingViewComponent, canActivate: [AuthGuard]  },
  { path: 'sampling-view/:noBox', component: SearchDetailComponent, canActivate: [AuthGuard]  },
  { path: 'sampling-print', component: SamplingPrintComponent, canActivate: [AuthGuard]  },
  { path: 'sampling-print/:noBox', component: SamplingPrintComponent, canActivate: [AuthGuard]  },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard]  },
  { path: 'search-detail/:noBox', component: SearchDetailComponent, canActivate: [AuthGuard]  },
  { path: 'customer-list', component: CustomerListComponent, canActivate: [AuthGuard]  },
  { path: 'maintenance', component: MaintenanceComponent, canActivate: [AuthGuard]  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
