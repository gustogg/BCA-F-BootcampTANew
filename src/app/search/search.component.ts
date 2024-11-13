import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  masterboxData: any[] = [];

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.getMasterboxData();
  }

  getMasterboxData(): void {
    this.customerService.getMasterboxData().subscribe(
      (data) => {
        this.masterboxData = data;
        console.log('Masterbox data:', data);
      },
      (error) => {
        console.error('Error fetching masterbox data:', error);
      }
    );
  }
  
}
