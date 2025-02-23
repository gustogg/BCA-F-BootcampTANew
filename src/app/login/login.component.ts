import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer.service';  // Import your existing CustomerService
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {
  username = ""
  password = ""
  role = ""
  errorMessage = ""
  isLoading = false
  showSuccessAlert = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
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
        
        // Show success alert
        this.showSuccessAlert = true;
        
        // Hide alert and navigate after 5 seconds
        setTimeout(() => {
          this.showSuccessAlert = false;
          this.router.navigate(["/home"]).then(() => {
            window.location.reload();
          });
        }, 2000);
        
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

  hideAlert() {
    this.showSuccessAlert = false;
    this.router.navigate(["/home"]).then(() => {
      window.location.reload();
    });
  }
}
