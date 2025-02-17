import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CustomerService, user } from './customer.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
// import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  user: any = {}; // Store the fetched user data here
  showNav = true;  // Controls visibility of the navbar based on the route
  showMobileNav = false;  // Controls visibility of the mobile navigation menu
  errorMessage: string = '';
  userlogin: user | null = null; 
  userData: user | null = null; // To store the user data fetched from API
  token: string = localStorage.getItem('token') || ''; // Get token from localStorage
  // username: string = localStorage.getItem('username') || ''; // Get userId from localStorage
  username: string | null = '';

  constructor(private router: Router, 
    private activatedRoute: ActivatedRoute, 
    private customerService: CustomerService,  
    private http: HttpClient, 
    private authService: AuthService) { }

ngOnInit() {
// Listen to route changes to hide the navbar on 'home' and 'login' routes
this.router.events.subscribe(event => {
if (event instanceof NavigationEnd) {
const currentRoute = this.router.url;
// Hide navbar on specific routes
this.showNav = currentRoute !== '/home' && currentRoute !== '/login';
}
});
// this.testToken();
// Get the username from localStorage
this.username = localStorage.getItem('username');

// Fetch the user data if the username exists
if (this.username) {
  this.getUserData(this.username);
}
// this.fetchUserData(); // Fetch user data when the component initializes
}

navItems = [
{ path: '/home', label: 'Home' },
{ path: '/register', label: 'Register' },
{ path: '/sampling', label: 'Sampling' },
{ path: '/search', label: 'Search' }
];

toggleMobileMenu(): void {
// Toggle the visibility of the mobile menu
this.showMobileNav = !this.showMobileNav;
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

// fetchUserData(): void {
//   const apiUrl = this.authService.getApiUrlUser(); // Get API URL from AuthService
//     if (this.userId && this.token) {
//       this.http.get(`${apiUrl}/${this.userId}`, {
//         headers: { Authorization: `Bearer ${this.token}` },
//         }).subscribe(
//         (response: any) => {
//       console.log('Response from API:', response); // Log the API response
//       this.user = response; // Assign the response to the user object
//       console.log('User data fetched:', this.user); // Log the fetched user data
//     },
// (error) => {
// console.error('Error fetching user data:', error);
// this.errorMessage = 'Error fetching user data. Please try again later.';
// }
// );
// } else {
// console.error('User ID or token not found');
// }
// }

}
