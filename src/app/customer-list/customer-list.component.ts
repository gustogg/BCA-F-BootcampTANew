import { Component, OnInit } from '@angular/core';
import { Customer, CustomerService } from '../customer.service';
import Swal from 'sweetalert2';
import { trigger, style, animate, transition } from '@angular/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})

export class CustomerListComponent implements OnInit {

  faPen = faPen;
  customers: Customer[] = [];
  isEditModalOpen = false;   // Modal open/close state
  editableCustomer: Partial<Customer> = {}; // Data for editing

  constructor(private customerService: CustomerService) { }
  
  ngOnInit(): void {
    this.customerService.getAllCustomers().subscribe(
      data => {
        console.log('Fetched data:', data); // Verify if data is received correctly
        this.customers = data;
      },
      error => {
        console.error('Error fetching customers:', error);
      }
    );
  }

  // Open Edit Modal
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
  

  

  deleteCustomer(id: number): void {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: true
    });
  
    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteCustomer(id).subscribe(() => {
          this.customers = this.customers.filter(customer => customer.id !== id);
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success"
          });
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        swalWithBootstrapButtons.fire({
          title: "Cancelled",
          text: "Your imaginary file is safe :)",
          icon: "error"
        });
      }
    });
  }
}

