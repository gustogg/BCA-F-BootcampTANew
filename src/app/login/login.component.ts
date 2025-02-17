import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';  // Import your existing CustomerService
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  // username: string = '';
  // password: string = '';
  // errorMessage: string = '';  // For displaying any login errors

  // constructor(private customerService: CustomerService, private router: Router) {}

  // Login method triggered by form submission
  // login() {
  //   // Call the CustomerService login method (you will need to implement this in CustomerService)
  //   this.customerService.login(this.username, this.password).subscribe(
  //     (response) => {
  //       // On success, store the token in localStorage
  //       localStorage.setItem('token', response.token); // Assuming your API returns a token

  //       // Redirect to home after successful login
  //       this.router.navigate(['/home']);
  //     },
  //     (error) => {
  //       // Handle login failure
  //       this.errorMessage = 'Invalid username or password';
  //       console.error('Login failed', error);
  //     }
  //   );
  // }

  username = ""
  password = ""
  role = ""
  errorMessage = ""
  isLoading = false

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  async login(): Promise<void> {
    if (!this.username || !this.password) {
      this.errorMessage = "Please enter both username and password"
      return
    }

    try {
      this.isLoading = true
      this.errorMessage = ""

      console.log("Logging in with:", this.username, this.role)
      const response = await this.authService.login(this.username, this.password, this.role).toPromise()

      if (response?.token) {
        console.log("Login successful, token received:", response.token)
        localStorage.setItem("token", response.token)
        localStorage.setItem("username", this.username);
        this.router.navigate(["/home"]).then(() => {
          window.location.reload();  // Forces a page reload
        });
      } else {
        throw new Error("No token received")
      }
    } catch (error) {
      console.error("Login failed:", error)
      this.errorMessage = "Invalid username or password"
    } finally {
      this.isLoading = false
    }
  }

  
}
