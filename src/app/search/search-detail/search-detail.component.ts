import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../customer.service';
import { Customer } from '../../customer.service';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search-detail',
  templateUrl: './search-detail.component.html',
  styleUrls: ['./search-detail.component.css']
})
export class SearchDetailComponent implements OnInit {
  customerDetails: any = {}; // Initialize as an object since it will be a single customer object
  faPen = faPen;
  customers: Customer[] = [];
  isEditModalOpen = false;   // Modal open/close state
  editableCustomer: Partial<Customer> = {}; // Data for editing
  
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

  openEditModal(customer: Customer): void {
    this.isEditModalOpen = true;
    this.editableCustomer = { ...customer };  // Clone customer data to avoid direct binding
  }

  // Close Edit Modal
  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.editableCustomer = {};
  }

  // Save Customer (update the record)
  
  saveCustomer(): void {
    Swal.fire({
      title: "Do you want to save the changes?",
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: "Save",
      denyButtonText: "Don't save"
    }).then((result) => {
      if (result.isConfirmed) {  
        if (this.editableCustomer && this.editableCustomer.id !== undefined) {
          // Update existing customer
          this.customerService.updateCustomer(this.editableCustomer.id, this.editableCustomer as Customer).subscribe(
            (updatedCustomer) => {
              // Update the local customer list with the modified customer details
              const index = this.customers.findIndex(c => c.id === updatedCustomer.id);
              if (index !== -1) {
                this.customers[index] = updatedCustomer;
              }
              Swal.fire("Saved!", "Your changes have been saved.", "success");
              this.closeEditModal(); // Ensure this method closes the modal
            },
            (error) => {
              console.error('Error updating customer:', error);
              Swal.fire("Error", "Failed to save changes. Please try again.", "error");
            }
          );
        } else {
          // Handle case for a new customer if needed (e.g., call a create method)
          console.error('Editable customer data is missing or invalid.');
          Swal.fire("Error", "No customer data to save.", "error");
        }
      } else if (result.isDenied) {
        Swal.fire("Changes are not saved", "", "info");
      }
    });
  }
  
}
