import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../customer.service';

@Component({
  selector: 'app-sampling-view',
  templateUrl: './sampling-view.component.html',
  styleUrls: ['./sampling-view.component.css']
})
export class SamplingViewComponent implements OnInit {
  customerDetails: any = {}; 

  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute // Inject ActivatedRoute to access route parameters
  ) {}

  ngOnInit(): void {
    const noBox = this.route.snapshot.paramMap.get('noBox'); // Get 'noBox' from the URL
  
    if (noBox) {
      this.customerService.getCustomerDetails(noBox).subscribe({
        next: (data) => {
          console.log('Customer details received:', data);
          this.customerDetails = data; // Assign data to customerDetails q
        },
        error: (err) => {
          console.error('Error fetching customer details', err);
        }
      });
    } else {
      console.error('No noBox parameter provided');
    }
  }
  
}
