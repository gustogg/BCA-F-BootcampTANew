import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { ListBox } from '../listbox.model';
import { ListBoxSampled } from '../listboxsampled.model';
import { jsPDF } from 'jspdf';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowUp, faArrowDown } from '@fortawesome/free-solid-svg-icons';
import { trigger, style, animate, transition } from '@angular/animations';


@Component({
  selector: 'app-sampling',
  templateUrl: 'sampling.component.html',
  styleUrls: ['sampling.component.css']
})
export class SamplingComponent implements OnInit {
  listBoxes: ListBox[] = [];
  listSampledBoxes: ListBoxSampled[] = [];
  filteredListBoxes: ListBox[] = [];
  searchTerm: string = '';
  filterByNoBox: boolean = true; // Default to filter by no_box
  filterByCreatedDate: boolean = false;
  selectedDate: string | null = null;
  sortDirection: boolean = true; // true = ascending, false = descending
  sortColumn: keyof ListBox | '' = ''; // Track the currently sorted column
  faArrowUp = faArrowUp;
  faArrowDown = faArrowDown;
  isDateFocused: boolean = false;  // State to manage the input type
  countSampledZero: number = 0;
  countApprovedZero: number = 0;
  displayedDataCount: number = 0;



  constructor(
    private customerService: CustomerService,
    private route: ActivatedRoute
  ) {}

  updateDisplayedDataCount(): void {
    this.displayedDataCount = this.filteredListBoxes.length;
  }

  ngOnInit() {
    this.loadListBoxes();
    this.updateDisplayedDataCount();
  }

  // Fetch all ListBox items
  
  getListBoxes(): void {
    this.customerService.getAllListBoxes().subscribe(
      (data: ListBox[]) => {
        this.listBoxes = data.map((item) => ({
          ...item,
          sampled: item.sampled === '1' ? 'Yes' : 'No',
          approved: item.approved === '1' ? 'Yes' : 'No',
        }));
        this.filteredListBoxes = this.listBoxes;
        this.updateSampledZeroCount();
      },
      (error) => {
        console.error('Error fetching list boxes:', error);
      }
    );
  }
  
  sortData(column: keyof ListBox): void {
    // Toggle sort direction if the same column is clicked again
    if (this.sortColumn === column) {
      this.sortDirection = !this.sortDirection;
    } else {
      this.sortDirection = true;
    }
    
    this.sortColumn = column;
    const direction = this.sortDirection ? 1 : -1;

    this.filteredListBoxes.sort((a, b) => {
      if (a[column] < b[column]) {
        return -1 * direction;
      } else if (a[column] > b[column]) {
        return 1 * direction;
      }
      return 0;
    });
  }

  onSortColumnChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedColumn = selectElement.value as keyof ListBox;
    this.sortData(selectedColumn);
  }

  // Filter list boxes based on search term
  search(): void {
    this.filteredListBoxes = this.listBoxes.filter((listBox) => {
      let matchesNoBox = true;
      let matchesCreatedDate = true;
  
      // Filter by No Box if checked and search term is provided
      if (this.filterByNoBox && this.searchTerm) {
        matchesNoBox = listBox.no_box.toLowerCase().includes(this.searchTerm.toLowerCase());
      }
  
      // Filter by Created Date if checked and date is selected
      if (this.filterByCreatedDate && this.selectedDate) {
        // Format the created_date from the database to YYYY-MM-DD for comparison
        const formattedCreatedDate = new Date(listBox.createdDate).toISOString().split('T')[0];
        matchesCreatedDate = formattedCreatedDate === this.selectedDate;
      }
  
      return matchesNoBox && matchesCreatedDate;
    });
  }

  onCreatedDateFilterChange(): void {
    // Reset search term and selected date when toggling created date filter
    this.searchTerm = '';
    this.selectedDate = null;
    this.search();
  }

  toggleFilter(filter: 'no_box' | 'created_date'): void {
    if (filter === 'no_box') {
      this.filterByNoBox = true;
      this.filterByCreatedDate = false;
      this.searchTerm = ''; // Reset date input if switching to No Box filter
    } else if (filter === 'created_date') {
      this.filterByNoBox = false;
      this.filterByCreatedDate = true;
      this.selectedDate = null; // Reset text input if switching to Created Date filter
    }
    this.search(); // Trigger the search to update results
  }

  // View details of a selected ListBox
  viewListBox(listBox: ListBox): void {
    Swal.fire({
      title: 'ListBox Details',
      html: `<p><strong>ID:</strong> ${listBox.id}</p>
             <p><strong>No Box:</strong> ${listBox.no_box}</p>
             <p><strong>Created Date:</strong> ${new Date(listBox.createdDate).toLocaleDateString()}</p>
             <p><strong>Approved:</strong> ${listBox.approved}</p>`,
      icon: 'info',
    });
  }

  // Delete a ListBox item
  deleteListBox(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this item?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.customerService.deleteListBox(id).subscribe(
          () => {
            Swal.fire('Deleted!', 'The item has been deleted.', 'success');
            this.getListBoxes(); // Refresh the list
          },
          (error) => {
            console.error('Error deleting list box:', error);
            Swal.fire('Error!', 'Could not delete the item.', 'error');
          }
        );
      }
    });
  }

  onFocus() {
    this.isDateFocused = true;  // Switch type to 'date' on focus
  }

  onBlur() {
    this.isDateFocused = false;  // Switch type back to 'text' on blur
  }

  updateSampledZeroCount(): void {
    this.countSampledZero = this.listBoxes.filter(
      (listBox) => listBox.sampled === 'No'
    ).length;
  }

  

  getProgressBox(listBox: ListBox): string {
    if (listBox.sampled === '1' && listBox.approved === '1') {
      return 'Complete'; // Progress complete
    } else if (listBox.sampled === '1' && listBox.approved === '0') {
      return 'Approval'; // Sampling is done, waiting for approval
    } else if (listBox.sampled === '0' && listBox.approved === '0') {
      return 'Sampling'; // Only started, needs sampling
    }
    return 'Registered'; // Default case if none match
  }
  
  

  getProgressLabel(listBox: ListBox): string {
    if (listBox.sampled === 'Yes' && listBox.approved === 'Yes') {
      return 'COMPLETE';
    } else if (listBox.sampled === 'Yes' && listBox.approved === 'No') {
      return 'PENDING APPROVAL';
    } else if (listBox.sampled === 'No' && listBox.approved === 'No') {
      return 'PENDING SAMPLING';
    }
    return 'NO PROGRESS';
  }
  
  approveListBox(listBox: ListBox): void {
    Swal.fire({
      title: 'Approve this item?',
      text: `Are you sure you want to approve No Box: ${listBox.no_box}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedListBox = { ...listBox, approved: '1' }; // Create a copy of the listBox object with updated approved value
        this.customerService.updateListBoxApproved(updatedListBox).subscribe({
          next: () => {
            Swal.fire('Approved!', `No Box: ${listBox.no_box} has been approved.`, 'success');
            this.getListBoxes(); // Refresh the list to update UI
          },
          error: (error) => {
            console.error('Error approving ListBox:', error);
            Swal.fire('Error!', 'Could not approve this item.', 'error');
          },
        });
      }
    });
  }
  

  handleAction(event: Event): void {
    const selectElement = event.target as HTMLSelectElement; // Typecasting the target
    const action = selectElement.value; // Now you can safely access 'value'
  
    switch (action) {
      case 'sampling':
        console.log('Sampling action selected');
        // Implement sampling logic here
        break;
      case 'approve':
        console.log('Approve action selected');
        // Implement approve logic here
        break;
      case 'complete':
        console.log('Complete action selected');
        // Implement complete logic here
        break;
      default:
        console.log('No action selected');
        break;
    }
  }
 
  currentFilter: string = 'ALL';
  filterList(status: string) {
  this.currentFilter = status; 
    switch (status) {
      case 'ALL':
        this.filteredListBoxes = [...this.listBoxes];
        break;
      case 'SAMPLING':
        this.filteredListBoxes = this.listBoxes.filter(
          (item) => (item.sampled === '0' || item.sampled === null) && (item.approved === '0' || item.approved === null)
        );
        break;
      case 'APPROVE':
        this.filteredListBoxes = this.listBoxes.filter(
          (item) => item.sampled === '1' && (item.approved === '0' || item.approved === null)
        );
        break;
      case 'COMPLETE':
        this.filteredListBoxes = this.listBoxes.filter(
          (item) => item.sampled === '1' && item.approved === '1'
        );
        break;
      default:
        this.filteredListBoxes = [...this.listBoxes];
    }
  
    this.updateDisplayedDataCount();
  }

  getHeadingText(filter: string): string {
    switch (filter) {
      case 'ALL':
        return 'All Progress';
      case 'SAMPLING':
        return 'List to Sampling';
      case 'APPROVE':
        return 'List to Approve';
      case 'COMPLETE':
        return 'Complete List';
      default:
        return 'All Progress'; // Fallback for unexpected filter values
    }
  }
  
  saveAsPDF(noBox: string): void {
    // Optional: Perform any actions before routing
    console.log(`Navigating to sampling-print with noBox: ${noBox}`);
    // Router navigation already handled by [routerLink]
  }
  
  loadListBoxes() {
    this.customerService.getAllListBoxes().subscribe((data) => {
      this.listBoxes = data;
      this.filteredListBoxes = data;  // Initially show all
    });
  }

  

}
