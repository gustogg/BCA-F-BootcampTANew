import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, NgForm } from '@angular/forms';

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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { SearchDetailComponent } from './search/search-detail/search-detail.component';
import { MatRadioModule } from '@angular/material/radio';



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
    SearchDetailComponent
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
    MatRadioModule
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
