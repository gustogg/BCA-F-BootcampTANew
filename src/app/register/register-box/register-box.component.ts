import { Component, inject } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { CustomerService } from '../../customer.service';
import { ListBox } from '../../customer.service';
import {FloatLabelType, MatFormFieldModule} from '@angular/material/form-field';
import {FormBuilder, FormControl, FormsModule, NgForm, ReactiveFormsModule} from '@angular/forms';
import {toSignal} from '@angular/core/rxjs-interop';
import {map} from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register-box.component.html',
  styleUrls: ['./register-box.component.scss']
})
export class RegisterBoxComponent {
  listboxes: ListBox[] = [];
  customerdata: CustomerService[] = [];
  selectedTabIndex = 0;
  hideRequiredControl = new FormControl(false);
  floatLabelControl = new FormControl('auto' as FloatLabelType);
  boxNumber: string = '';
  
  options = inject(FormBuilder).group({
    hideRequired: this.hideRequiredControl,
    floatLabel: this.floatLabelControl,
  });

  hideRequired = toSignal(this.hideRequiredControl.valueChanges);
  floatLabel = toSignal(
    this.floatLabelControl.valueChanges.pipe(map((v) => v || 'auto')),
    { initialValue: 'auto' }
  );

  onSubmit(form: NgForm): void {
    if (form.valid) {
      // Show SweetAlert with Add and Cancel options
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this box?',
        icon: 'warning',
        showCancelButton: true,  // Show Cancel button
        confirmButtonText: 'Add',
        cancelButtonText: 'Cancel'
      }).then(result => {
        if (result.isConfirmed) {
          // User clicked Add - Proceed with creating the ListBox
          createdDate: Date;
          const listBox: Omit<ListBox, 'id' | 'createdDate' > = {
            no_box: this.boxNumber,
            approved: '0', // Set approved to 0
            sampled: '0',   // Set sampled to 0
          };
  
          console.log('Calling createListBox with:', listBox);
  
          // Call the service to create the ListBox
          this.CustomerService.createListBox(listBox).subscribe(
            response => {
              console.log('Box created successfully:', response);
              
              // Show success SweetAlert
              Swal.fire({
                title: 'Success!',
                text: 'The box was added successfully.',
                icon: 'success',
                confirmButtonText: 'OK'
              }).then(() => {
                // Refresh the page after showing the success message
                this.refreshList();
              });
            },
            error => {
              console.error('Error creating box:', error);
              
              // Show SweetAlert error message
              Swal.fire({
                title: 'Error!',
                text: 'There was an error creating the box. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
              });
            }
          );
        } else if (result.isDismissed) {
          // User clicked Cancel - Do nothing or display a message
          console.log('User canceled the action.');
        }
      });
    }
  }

  refreshList(): void {
    window.location.reload();
  }
  

  floatLabelValue(): FloatLabelType {
    return this.floatLabelControl.value || 'auto';
  }
  constructor(private CustomerService: CustomerService) {
    this.loadBoxes();
  }

  loadBoxes() {
    this.CustomerService.getAllListBoxes().subscribe(
      (data) => {
        this.listboxes = data;
      },
      (error) => {
        console.error('Error fetching boxes:', error);
      }
    );
  }

  onBoxAdded() {
    this.loadBoxes();
  }

  onBoxLocked() {
    this.loadBoxes();
  }
}