import { Component, type OnInit, ViewChild, type AfterViewInit, type TemplateRef } from "@angular/core"
import { CustomerService, Customer } from "../../../customer.service";
import { ListBox } from "../../../customer.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { firstValueFrom, from } from "rxjs";
import { FormControl } from "@angular/forms";
import { FormGroup, FormBuilder, Validators } from "@angular/forms"
// import { CustomerDetailDialogComponent } from "./customer-detail-dialog.component"
import { MatDialog } from '@angular/material/dialog'; // Type-only import
import { Inject } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SelectionModel } from "@angular/cdk/collections"
import jsPDF from "jspdf"
import "jspdf-autotable"



@Component({
  selector: 'app-register-import-customize',
  templateUrl: './register-import-customize.component.html',
  styleUrl: './register-import-customize.component.css'
})
export class RegisterImportCustomizeComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ["select", "noKontrak", "customerID", "namaKonsumen", "tglRealisasi", "noBox", "noMap", "actions"]
  dataSource: MatTableDataSource<Customer>
  isLoading = true
  totalRecords = 0
  bulkNoBoxControl = new FormControl("")
  isUpdating = false
  // selectedCustomer: Customer | null = null
  selectedCustomer: Partial<Customer> = {};
  editMode = false
  selection = new SelectionModel<Customer>(true, [])
  listboxes: ListBox[] = [];  
  boxNumber: string = '';
  // customerForm: FormGroup

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort
  @ViewChild("customerDetailsModal") customerDetailsModal!: TemplateRef<any>
  customerForm: FormGroup = new FormGroup({})
  constructor(
    private customerService: CustomerService,
    public dialog: MatDialog, // Change from private to public
    private fb: FormBuilder
  ) {
    this.dataSource = new MatTableDataSource<Customer>([])
    this.initForm()
  }

  private initForm(): void {
    this.customerForm = this.fb.group({
      noKontrak: ["", Validators.required],
      customerID: ["", Validators.required],
      namaKonsumen: ["", Validators.required],
      noPin: [""],
      tglRealisasi: [""],
      tglJatuhTempo: [""],
      tglRetensi: [""],
      fcKTP: [""],
      fcPasangan: [""],
      fcPengurus: [""],
      fcKK: [""],
      fcAkta: [""],
      k3: [""],
      rekomendasi: [""],
      formSurvey: [""],
      petaLokasi: [""],
      fap: [""],
      resume: [""],
      tandaDaftarPerusahaan: [""],
      siup: [""],
      noBox: [""],
      noMap: [""],
      sampled: [""],
    })
  }

  ngOnInit(): void {
    this.loadCustomerData()
  }

  ngAfterViewInit() {
    if (this.dataSource) {
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    }
  }
toggleEditMode(): void {
    this.editMode = !this.editMode
    if (this.editMode) {
      this.customerForm.patchValue(this.selectedCustomer)
    }
  }

  async saveCustomerDetails(): Promise<void> {
    if (!this.selectedCustomer.id || !this.customerForm.valid) return

    try {
      const updatedCustomer = {
        ...this.selectedCustomer,
        ...this.customerForm.value,
      }

      await firstValueFrom(this.customerService.updateCustomer(this.selectedCustomer.id, updatedCustomer))

      await Swal.fire({
        title: "Success!",
        text: "Customer details updated successfully",
        icon: "success",
        confirmButtonText: "OK",
      })

      // Update the selected customer with new values
      this.selectedCustomer = updatedCustomer
      this.editMode = false

      // Reload the table data
      await this.loadCustomerData()
    } catch (error) {
      console.error("Error updating customer details:", error)
      await Swal.fire({
        title: "Error!",
        text: "Failed to update customer details",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  // Add delete method
  async deleteCustomer(customer: Customer): Promise<void> {
    if (!customer.id) return

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Do you want to delete the customer record for ${customer.namaKonsumen || "Unknown"}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626", // Red color for delete confirmation
    })

    if (result.isConfirmed) {
      try {
        await firstValueFrom(this.customerService.deleteCustomer(customer.id))

        await Swal.fire({
          title: "Deleted!",
          text: "Customer record has been deleted successfully",
          icon: "success",
          confirmButtonText: "OK",
        })

        // Reload the data
        await this.loadCustomerData()
      } catch (error) {
        console.error("Error deleting customer:", error)
        await Swal.fire({
          title: "Error!",
          text: "Failed to delete customer record",
          icon: "error",
          confirmButtonText: "OK",
        })
      }
    }
  }

  // Add new method to handle bulk update
  async setBulkNoBox(): Promise<void> {
    const noBoxValue = this.bulkNoBoxControl.value
    if (!noBoxValue) {
      await Swal.fire({
        title: "Error!",
        text: "Please enter a box number",
        icon: "error",
        confirmButtonText: "OK",
      })
      return
    }

    // Get selected data that doesn't have a box number
    const dataToUpdate = this.selection.selected.filter((customer) => !customer.noBox)

    if (dataToUpdate.length === 0) {
      await Swal.fire({
        title: "Info",
        text: "No selected records found that need updating",
        icon: "info",
        confirmButtonText: "OK",
      })
      return
    }

    // Show confirmation dialog
    const result = await Swal.fire({
      title: "Confirm Update",
      text: `Are you sure you want to set Box Number to "${noBoxValue}" for ${dataToUpdate.length} selected records?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update selected",
      cancelButtonText: "Cancel",
    })

    if (result.isConfirmed) {
      
      try {
        this.isUpdating = true
        let successCount = 0
        let errorCount = 0
        // First, check if ListBox entry exists
        try {
          // const existingListBox = await firstValueFrom(this.customerService.getListBox(noBoxValue))
          // if (!existingListBox) {
            // Create new ListBox entry
            const listBox: Omit<ListBox, 'id' | 'createdDate' > = {
              no_box: noBoxValue,
              approved: '0', // Set approved to 0
              sampled: '0',   // Set sampled to 0
            };
            console.log('Calling createListBox with:', listBox);
            
            this.customerService.createListBox(listBox).subscribe(
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
          // }
        } catch (error) {
          console.error("Error creating box:", error)
          const result = await Swal.fire({
            title: "Error!",
            text: "Could not create box entry in the system. Do you want to continue updating customer records?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Continue",
            cancelButtonText: "Cancel",
          })

          if (!result.isConfirmed) {
            return
          }
        }

        // Update each selected record
        for (const customer of dataToUpdate) {
          if (customer.id) {
            try {
              const updatedCustomer = {
                ...customer,
                noBox: noBoxValue,
              }
              await firstValueFrom(this.customerService.updateCustomer(customer.id, updatedCustomer))
              successCount++
            } catch (error) {
              console.error("Error updating customer:", error)
              errorCount++
            }
          }
        }

        // Show success message
        await Swal.fire({
          title: "Update Complete",
          text: `Successfully created box and updated ${successCount} records${errorCount > 0 ? `, ${errorCount} failed` : ""}`,
          icon: successCount > 0 ? "success" : "error",
          confirmButtonText: "OK",
        })

        // Refresh the list after successful update
        await this.refreshList()

        // Clear selection
        this.selection.clear()

        // Reload the data
        await this.loadCustomerData()

        // Clear the input
        this.bulkNoBoxControl.setValue("")
      } finally {
        this.isUpdating = false
      }
    }
  }

  async loadCustomerData(): Promise<void> {
    try {
      this.isLoading = true
      // Use firstValueFrom instead of toPromise()
      const customers = await firstValueFrom(this.customerService.getAllCustomers())

      if (customers) {
        // Filter customers where noBox or noMap is null
        const filteredCustomers = customers.filter((customer) => !customer.noBox || !customer.noMap)
        this.totalRecords = filteredCustomers.length
        this.dataSource = new MatTableDataSource(filteredCustomers)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort

        // Custom filter predicate for better searching
        this.dataSource.filterPredicate = (data: Customer, filter: string) => {
          const searchStr = JSON.stringify([data.noKontrak, data.customerID, data.namaKonsumen]).toLowerCase()
          return searchStr.includes(filter.toLowerCase())
        }
      }
    } catch (error) {
      console.error("Error loading customer data:", error)
      await Swal.fire({
        title: "Error!",
        text: "Failed to load customer data",
        icon: "error",
        confirmButtonText: "OK",
      })
    } finally {
      this.isLoading = false
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  async updateCustomer(customer: Customer): Promise<void> {
    try {
      const { value: formValues } = await Swal.fire({
        title: "Update Customer Data",
        html:
          '<div class="tw-space-y-4">' +
          `<div class="tw-flex tw-flex-col">
            <label class="tw-text-sm tw-font-medium tw-mb-1">Box Number</label>
            <input id="swal-input-box" class="tw-border tw-rounded tw-px-3 tw-py-2" value="${customer.noBox || ""}">
           </div>` +
          `<div class="tw-flex tw-flex-col">
            <label class="tw-text-sm tw-font-medium tw-mb-1">Map Number</label>
            <input id="swal-input-map" class="tw-border tw-rounded tw-px-3 tw-py-2" value="${customer.noMap || ""}">
           </div>` +
          "</div>",
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        preConfirm: () => {
          return {
            noBox: (document.getElementById("swal-input-box") as HTMLInputElement).value,
            noMap: (document.getElementById("swal-input-map") as HTMLInputElement).value,
          }
        },
      })

      if (formValues && customer.id) {
        const updatedCustomer = {
          ...customer,
          noBox: formValues.noBox,
          noMap: formValues.noMap,
        }

        // Use firstValueFrom instead of toPromise()
        await firstValueFrom(this.customerService.updateCustomer(customer.id, updatedCustomer))

        await Swal.fire({
          title: "Success!",
          text: "Customer data updated successfully",
          icon: "success",
          confirmButtonText: "OK",
        })

        // Reload the data
        await this.loadCustomerData()
      }
    } catch (error) {
      console.error("Error updating customer:", error)
      await Swal.fire({
        title: "Error!",
        text: "Failed to update customer data",
        icon: "error",
        confirmButtonText: "OK",
      })
    }
  }

  showCustomerDetails(customer: Customer): void {
    this.selectedCustomer = customer
    const dialogRef = this.dialog.open(this.customerDetailsModal, {
      panelClass: "tw-bg-transparent",
    })
  }

  formatDate(date: Date | string | number | undefined): string {
    if (!date) return "Not Set"
    return new Date(date).toLocaleDateString()
  }

  formatValue(value: string | undefined): string {
    if (value === undefined || value === null) return "Not Set"
    return value === "1" ? "Yes" : value === "0" ? "No" : value
  }

  showDetails(customer: Customer): void {
    this.selectedCustomer = customer
    this.dialog.open(this.customerDetailsModal, {
      width: "900px",
      maxHeight: "90vh",
      panelClass: "custom-dialog-container",
    })
  }
  onSubmit() {
    console.log(this.customerForm.value)
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length
    const numRows = this.dataSource.data.length
    return numSelected === numRows
  }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
      this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach((row) => this.selection.select(row))
    }

    checkboxLabel(row?: Customer): string {
      if (!row) {
        return `${this.isAllSelected() ? "select" : "deselect"} all`
      }
      return `${this.selection.isSelected(row) ? "deselect" : "select"} row`
    }


    generatePDF(): void {
      if (this.selection.selected.length === 0) {
        Swal.fire({
          title: "Error!",
          text: "Please select at least one record to generate report",
          icon: "error",
          confirmButtonText: "OK",
        })
        return
      }
  
      const doc = new jsPDF("landscape", "mm", "a4")
      const columns = [
        "NO",
        "NO Kontrak",
        "NO PIN",
        "CUSTOMER ID",
        "NAMA KONSUMEN",
        "TGL REALISASI",
        "TGL DATA MASUK"
      ]
  
      const rows = this.selection.selected.map((customer: Customer, index: number) => [
        index + 1, // NO
        customer.noKontrak || "-",
        customer.noPin || "-",
        customer.customerID || "-",
        customer.namaKonsumen || "-",
        customer.tglRealisasi ? new Date(customer.tglRealisasi).toLocaleDateString() : "-",
        customer.createdDate ? new Date(customer.createdDate).toLocaleDateString() : "-",
      ])
  
      // Title
      doc.setFontSize(16)
      const title = `Report Balancing - Archive Management`
      const pageWidth = doc.internal.pageSize.width
      const titleWidth = doc.getStringUnitWidth(title) * doc.internal.scaleFactor
      const titleX = pageWidth / 2
  
      doc.text(title, titleX, 15, { align: "center" })
  
      // Box Numbers
      doc.setFontSize(11)
      const boxNumbers = this.selection.selected
        .map((customer) => customer.noBox)
        .filter((value, index, self) => value && self.indexOf(value) === index) // Get unique box numbers
        .join(", ")
      const date = new Date().toLocaleDateString();
      const keterangan = `Dengan ini diberitahukan per tanggal ${date}, bahwa berikut adalah daftar konsumen yang dokumennya belum diterima secara resmi oleh Unit Archive\n\nManagement.`;
      doc.text(keterangan, 10, 35, { align: "left" })
  
      // Generate table
      doc.autoTable(columns, rows, {
        startY: 53,
        margin: { horizontal: 10 },
        styles: { fontSize: 8, cellPadding: 3, overflow: "linebreak" },
        headStyles: {
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
          fontSize: 8,
          halign: "left",
          valign: "middle",
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
        },
        bodyStyles: {
          fillColor: [255, 255, 255],
          lineWidth: 0.1,
          lineColor: [0, 0, 0],
          textColor: 0,
        },
        theme: "grid",
      })
  
      // Add date and signature
      const today = new Date().toLocaleDateString("id-ID", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
      const dateY = doc.lastAutoTable.finalY + 25
      doc.setFontSize(11)
      doc.text(`Jakarta, ${today}`, 280, dateY, { align: "right" })
  
      // Add company logo if available
      try {
        const img = "/assets/BCA_Finance.png"
        doc.addImage(img, "PNG", 230, dateY + 12, 50, 7)
      } catch (error) {
        console.warn("Company logo not found:", error)
      }
  
      doc.text(`Archive Management Unit`, 280, dateY + 30, { align: "right" })
  
      // Save the PDF
      const fileName = `AM-BalancingReport-${new Date().toISOString().slice(0, 10)}.pdf`
      doc.save(fileName)
    }
    async refreshList(): Promise<void> {
      await this.loadCustomerData()
    }
}
