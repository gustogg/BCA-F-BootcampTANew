import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';  // Import Router and ActivatedRoute

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  showNav: boolean = true;  // Variable to control the visibility of the nav

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    // Listen to route changes and check if the current route is 'home' or 'login'
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = this.router.url;
        this.showNav = currentRoute !== '/home' && currentRoute !== '/login';
      }
    });
  }
}
