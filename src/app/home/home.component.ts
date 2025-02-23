import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { AuthService } from '../auth.service';  // If needed
import { user } from '../customer.service';  // Assuming user interface is exported
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

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
    private authService: AuthService, // Inject the AuthService if needed
    private activatedRoute: ActivatedRoute, 
    private http: HttpClient, 
    private router: Router
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

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out of the system!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, logout!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Perform logout
        console.log('User logging out');
        localStorage.removeItem('token');
        
        // Show success message
        Swal.fire({
          title: 'Logged Out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        }).then(() => {
          // Navigate to login page after the success message
          this.router.navigate(['/login']);
        });
      }
    });
  }
  canSeeSamplingButton(): boolean {
    return this.userData?.role !== 'register';
  }

  canSeeRegisterButton(): boolean {
    return this.userData?.role !== 'sampling';
  }

  canApproveButton(): boolean {
    return this.userData?.role !== 'admin';
  }

}
