import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';  // Import LoginComponent
import { SearchComponent } from './search/search.component';
import { SearchDetailComponent } from './search/search-detail/search-detail.component';
import { HomeComponent } from './home/home.component';
import { SamplingComponent } from './sampling/sampling.component';
import { RegisterComponent } from './register/register.component';
import { CustomerListComponent } from './customer-list/customer-list.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },  // Redirect root path to login
  { path: 'login', component: LoginComponent },  // Set LoginComponent for '/login'
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'sampling', component: SamplingComponent },
  { path: 'search', component: SearchComponent },
  { path: 'search-detail/:noBox', component: SearchDetailComponent },
  { path: 'customer-list', component: CustomerListComponent },


  // You can add more routes as needed
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
