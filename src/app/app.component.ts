import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNav = true;  // Controls visibility of the navbar based on the route
  showMobileNav = false;  // Controls visibility of the mobile navigation menu

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Listen to route changes to hide the navbar on 'home' and 'login' routes
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        // Hide navbar on specific routes
        this.showNav = currentRoute !== '/home' && currentRoute !== '/login';
      }
    });
  }

  toggleMobileMenu(): void {
    // Toggle the visibility of the mobile menu
    this.showMobileNav = !this.showMobileNav;
  }
}
