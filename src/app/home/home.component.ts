import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { AuthService } from '../auth.service';  // If needed
import { user } from '../customer.service';  // Assuming user interface is exported
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

@Injectable({
  providedIn: 'root'
})

export class HomeComponent {
  username: string | null = '';
  userData: user | null = null; // To store the user data fetched from API
  errorMessage: string = '';


  constructor(
    private customerService: CustomerService, // Inject the CustomerService
    private authService: AuthService // Inject the AuthService if needed
  ) {}

  
  ngOnInit(): void {
   // Get the username from localStorage
   this.username = localStorage.getItem('username');

   // Fetch the user data if the username exists
   if (this.username) {
     this.getUserData(this.username);
   }
  }

  getUserData(username: string): void {
    const token = localStorage.getItem('token'); // Get the token from localStorage
    if (token) {
      this.customerService.getUser(username).subscribe(
        (data: user) => {
          this.userData = data; // Store user data
          console.log('User data fetched:', this.userData);
        },
        (error) => {
          this.errorMessage = 'Error fetching user data.';
          console.error('Error fetching user data:', error);
        }
      );
    } else {
      console.error('Token not found');
    }
  }

}
