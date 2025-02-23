import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../customer.service';

@Component({
  selector: 'app-sampling-do',
  templateUrl: './sampling-do.component.html',
  styleUrls: ['./sampling-do.component.css']
})
export class SamplingDoComponent implements OnInit {
  // customerDetails: any = {}; 
  customerDetails: any = null; // Initialize as null for better state management
  errorMessage: string = '';

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
          this.customerDetails = data; // Assign data to customerDetails
        },
        error: (err) => {
          this.errorMessage = 'Error fetching customer details';
          console.error('Error fetching customer details', err);
        }
      });
    } else {
      console.error('No noBox parameter provided');
    }
  }
  // Method to update the 'sampled' column to 'yes'
  startSampling(customerId: number): void {
    const customerToUpdate = this.customerDetails.find(
      (customer: any) => customer.id === customerId
    );
  
    if (customerToUpdate) {
      Swal.fire({
        title: 'Confirm Sampling',
        text: `Are you sure you want to sample customer ${customerToUpdate.noBox}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, proceed!',
      }).then((result) => {
        if (result.isConfirmed) {
          customerToUpdate.sampled = 'yes'; // Update sampled status locally
  
          // Step 1: Update the customer database
          this.customerService.updateCustomer(customerId, customerToUpdate).subscribe({
            next: (updatedCustomer) => {
              console.log('Customer successfully updated:', updatedCustomer);
  
              // Step 2: Update the list_box database
              this.customerService.updateListBoxSampled(customerToUpdate.noBox, '1').subscribe({
                next: (response) => {
                  console.log('ListBox update response:', response);
  
                  Swal.fire(
                    'Success!',
                    `Sampling status for customer ${customerToUpdate.noBox} has been updated successfully.`,
                    'success'
                  );
                },
                error: (err) => {
                  console.error('Error updating list_box:', err);
  
                  Swal.fire(
                    'Error!',
                    `Failed to update sampling status in list_box. Error: ${err.message || err.statusText}`,
                    'error'
                  );
                },
              });
            },
            error: (err) => {
              console.error('Error updating customer:', err);
  
              Swal.fire(
                'Error!',
                `Failed to update sampling status for customer. Error: ${err.message || err.statusText}`,
                'error'
              );
            },
          });
        }
      });
    } else {
      Swal.fire(
        'Error!',
        'Customer not found. Please refresh the page and try again.',
        'error'
      );
      console.error('Customer not found with ID:', customerId);
    }
  }
  
  
  
  
  
  
  

}