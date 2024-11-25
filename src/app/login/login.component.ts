import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';  // Import your existing CustomerService

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';  // For displaying any login errors

  constructor(private customerService: CustomerService, private router: Router) {}

  // Login method triggered by form submission
  login() {
    // Call the CustomerService login method (you will need to implement this in CustomerService)
    this.customerService.login(this.username, this.password).subscribe(
      (response) => {
        // On success, store the token in localStorage
        localStorage.setItem('token', response.token); // Assuming your API returns a token

        // Redirect to home after successful login
        this.router.navigate(['/home']);
      },
      (error) => {
        // Handle login failure
        this.errorMessage = 'Invalid username or password';
        console.error('Login failed', error);
      }
    );
  }
}
