import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CustomerService, user } from './customer.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import Swal from 'sweetalert2';
import { MatTooltip } from '@angular/material/tooltip';

// import { Router } from '@angular/router';
interface NavItem {
  path: string;
  label: string;
  disabled?: boolean;
  disabledMessage?: string;
  roles?: string[]; // Add roles array to specify which roles can access this item
}

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

navItems: NavItem[] = [
  { 
    path: '/home', 
    label: 'Home',
    roles: ['admin', 'register', 'sampling'] // All roles can access home
  },
  { 
    path: '/register', 
    label: 'Register',
    disabledMessage: 'Not available for sampling users',
    roles: ['admin', 'register']
  },
  { 
    path: '/sampling', 
    label: 'Sampling',
    disabledMessage: 'Not available for register users',
    roles: ['admin', 'sampling']
  },
  { 
    path: '/search', 
    label: 'Search',
    roles: ['admin', 'register', 'sampling']
  }
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


updateNavItemsAccess(): void {
  this.navItems = this.navItems.map(item => ({
    ...item,
    disabled: this.isNavItemDisabled(item)
  }));
}

isNavItemDisabled(item: NavItem): boolean {
  if (!this.userData || !item.roles) return true;
  return !item.roles.includes(this.userData.role);
}

getFilteredNavItems(): NavItem[] {
  if (!this.userData) return this.navItems;

  return this.navItems.filter(item => {
    if (this.userData?.role === 'sampling' && item.path === '/register') {
      return false; // Hide Register for Sampling users
    }
    if (this.userData?.role === 'register' && item.path === '/sampling') {
      return false; // Hide Sampling for Register users
    }
    return true; // Show all other items
  });
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
