import { Component } from '@angular/core';

import { CustomerService } from '../../customer.service';
import { Customer } from '../../customer.service';
import * as XLSX from "xlsx"
import Swal from "sweetalert2"

interface StatusMessage {
  text: string;
  type: 'success' | 'warning' | 'error';
}

interface ExcelMapping {
  excelHeader: string
  databaseField: keyof Customer
}

@Component({
  selector: 'app-register-import',
  templateUrl: './register-import.component.html',
  styleUrl: './register-import.component.css'
})
export class RegisterImportComponent {
  validationWarnings: string[] = []
  rowsPerPage = 10
  excelData: any[] = [] // Initialize excelData
  previewData: any[] = [] // Initialize previewData
  totalRows = 0
  canProceed = false
  currentStep = 1
  selectedFile: File | null = null
  headers: string[] = []
  excelMapping: { excelHeader: string; databaseField: keyof Customer }[] = [
    { excelHeader: "No. Kontrak", databaseField: "noKontrak" },
    { excelHeader: "No. Pin", databaseField: "noPin" },
    { excelHeader: "Customer ID", databaseField: "customerID" },
    { excelHeader: "Nama Konsumen", databaseField: "namaKonsumen" },
    { excelHeader: "Tanggal Realisasi", databaseField: "tglRealisasi" },
    { excelHeader: "Tanggal Jatuh Tempo", databaseField: "tglJatuhTempo" },
    { excelHeader: "Tanggal Retensi", databaseField: "tglRetensi" },
    { excelHeader: "Fotocopy KTP", databaseField: "fcKTP" },
    { excelHeader: "Fotocopy Pasangan", databaseField: "fcPasangan" },
    { excelHeader: "Fotocopy Seluruh Pengurus", databaseField: "fcPengurus" },
    { excelHeader: "Fotocopy Kartu Keluarga", databaseField: "fcKK" },
    { excelHeader: "Fotocopy Akta Nikah/Cerai/Kematian", databaseField: "fcAkta" },
    { excelHeader: "Kepututsan Komite Kredit", databaseField: "k3" },
    { excelHeader: "Rekomendasi BCA", databaseField: "rekomendasi" },
    { excelHeader: "Form Survey", databaseField: "formSurvey" },
    { excelHeader: "Peta Lokasi", databaseField: "petaLokasi" },
    { excelHeader: "Formulir Aplikasi Pembiayaan", databaseField: "fap" },
    { excelHeader: "Resume", databaseField: "resume" },
    { excelHeader: "Tanda Daftar Perusahaan", databaseField: "tandaDaftarPerusahaan" },
    { excelHeader: "Surat Izin Usaha (SIUP)", databaseField: "siup" },
    { excelHeader: "No. Box", databaseField: "noBox" },
    { excelHeader: "No. Map", databaseField: "noMap" },
  ]
  importProgress = 0
  processedRows = 0
  statusMessages: StatusMessage[] = []

  constructor(private customerService: CustomerService) {
    Swal.mixin({
      customClass: {
        confirmButton:
          "tw-px-6 tw-py-2 tw-rounded-lg tw-bg-blue-600 tw-text-white tw-transition-all tw-duration-200 hover:tw-bg-blue-700 hover:tw-shadow-lg",
        title: "tw-text-gray-900",
        popup: "tw-rounded-xl",
      },
      buttonsStyling: false,
    })
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    const dropZone = event.currentTarget as HTMLElement
    dropZone.classList.add("dragover")
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    const dropZone = event.currentTarget as HTMLElement
    dropZone.classList.remove("dragover")
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    event.stopPropagation()
    const dropZone = event.currentTarget as HTMLElement
    dropZone.classList.remove("dragover")

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      this.handleFile(files[0])
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0])
    }
  }

  async handleFile(file: File): Promise<void> {
    // Check file type
    if (!file.name.match(/\.(xlsx|xls)$/)) {
      this.addStatusMessage("Please select an Excel file", "error")
      return
    }

    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      this.addStatusMessage("File size must be less than 10MB", "error")
      return
    }

    try {
      const data = await this.readExcelFile(file)
      if (data && data.length > 0) {
        this.excelData = data
        this.headers = Object.keys(data[0])
        this.previewData = data.slice(0, this.rowsPerPage) // Show first batch of rows
        this.totalRows = data.length
        this.selectedFile = file
        this.canProceed = true
        this.validateData() // Add validation
        this.addStatusMessage("File loaded successfully", "success")
      }
    } catch (error) {
      this.addStatusMessage("Error reading file: " + (error as Error).message, "error")
    }


  }

  validateData(): void {
    this.validationWarnings = []

    this.excelData.forEach((row, index) => {
      // Validate required fields
      this.excelMapping.forEach((mapping) => {
        if (!row[mapping.excelHeader] && this.isRequiredField(mapping.databaseField)) {
          this.validationWarnings.push(`Row ${index + 1}: ${mapping.excelHeader} is required`)
        }
      })

      // Validate date fields
      ;["Tanggal Realisasi", "Tanggal Jatuh Tempo", "Tanggal Retensi"].forEach((dateField) => {
        if (row[dateField] && !this.isValidDate(row[dateField])) {
          this.validationWarnings.push(`Row ${index + 1}: ${dateField} has an invalid date format`)
        }
      })
    })
  }

  isRequiredField(field: keyof Customer): boolean {
    const requiredFields: (keyof Customer)[] = [
      "customerID",
      "namaKonsumen",
      "noKontrak",
      // Add other required fields here
    ]
    return requiredFields.includes(field)
  }

  isValidDate(dateString: string): boolean {
    return !isNaN(Date.parse(dateString))
  }

  isDateField(header: string): boolean {
    const dateFields = ["Tanggal Realisasi", "Tanggal Jatuh Tempo", "Tanggal Retensi"]
    return dateFields.includes(header)
  }

  formatDateForInput(value: any): string {
    if (!value) return ""

    // If it's an Excel date number (number of days since 1900-01-01)
    if (typeof value === "number") {
      const date = new Date(Math.round((value - 25569) * 86400 * 1000))
      return date.toISOString().split("T")[0]
    }

    // If it's already a date string
    if (typeof value === "string") {
      const date = new Date(value)
      if (!isNaN(date.getTime())) {
        return date.toISOString().split("T")[0]
      }
    }

    return String(value)
  }


  onCellEdit(rowIndex: number, header: string, event: Event): void {
    const input = event.target as HTMLInputElement
    const value = input.value

    // Update the data in both preview and main data arrays
    if (rowIndex < this.previewData.length) {
      if (this.isDateField(header)) {
        // For date fields, store as Date object
        this.previewData[rowIndex][header] = new Date(value)
      } else {
        this.previewData[rowIndex][header] = value
      }
    }

    // Update the main data array as well
    const mainDataIndex = rowIndex // Adjust if using pagination
    if (mainDataIndex < this.excelData.length) {
      if (this.isDateField(header)) {
        this.excelData[mainDataIndex][header] = new Date(value)
      } else {
        this.excelData[mainDataIndex][header] = value
      }
    }

    // Validate the updated data
    this.validateData()
  }

  async readExcelFile(file: File): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e: any) => {
        try {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: "array" })
          const firstSheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[firstSheetName]

          // Define the range starting from B2 to U last row
          const range = XLSX.utils.decode_range(worksheet["!ref"] || "B2:U1000")
          range.s.c = 1 // Start from column B (index 1)
          range.s.r = 1 // Start from row 2 (index 1)
          range.e.c = 20 // End at column U (index 20)

          // Get headers from row 2
          const headers: string[] = []
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const cell = worksheet[XLSX.utils.encode_cell({ r: 1, c: C })]
            headers.push(cell?.v || "")
          }

          // Get data starting from row 3
          const jsonData = []
          for (let R = range.s.r + 1; R <= range.e.r; ++R) {
            const row: any = {}
            let hasData = false

            for (let C = range.s.c; C <= range.e.c; ++C) {
              const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })]
              if (cell) {
                hasData = true
                row[headers[C - range.s.c]] = cell.v
              } else {
                row[headers[C - range.s.c]] = null
              }
            }

            if (hasData) {
              jsonData.push(row)
            }
          }

          resolve(jsonData)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = (error) => reject(error)
      reader.readAsArrayBuffer(file)
    })
  }

  updateHeaderMapping(excelHeader: string, databaseField: string): void {
    //This function is no longer needed with the new excelMapping
  }

  async startImport(): Promise<void> {
    this.processedRows = 0
    this.importProgress = 0
    this.statusMessages = []

  try{
    for (const row of this.excelData) {
      try {
        const customerData: Partial<Customer> = {}

        // Map Excel data to Customer interface using the mapping
        for (const mapping of this.excelMapping) {
          let value = row[mapping.excelHeader]

          // Handle date fields
          if (["tglRealisasi", "tglJatuhTempo", "tglRetensi"].includes(mapping.databaseField)) {
            if (value) {
              // Excel dates are stored as numbers representing days since 1900
              if (typeof value === "number") {
                value = new Date(Math.round((value - 25569) * 86400 * 1000))
              } else {
                value = new Date(value)
              }
            } else {
              value = null
            }
          }

          customerData[mapping.databaseField] = value
        }

        // Set default values for required fields if they're empty
        customerData.createdDate = new Date()
        customerData.sampled = customerData.sampled || "0"

        // Create customer record
        await this.customerService.createCustomer(customerData as Omit<Customer, "id">).toPromise()

        this.processedRows++
        this.importProgress = Math.round((this.processedRows / this.totalRows) * 100)
        this.addStatusMessage(`Successfully imported row ${this.processedRows}`, "success")
      } catch (error) {
        this.addStatusMessage(`Error importing row ${this.processedRows + 1}: ${(error as Error).message}`, "error")
      }
    }
    if (this.processedRows === this.totalRows) {
      // Add a 1.5 second delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      await Swal.fire({
        title: "Success!",
        text: `Successfully imported ${this.processedRows} records`,
        icon: "success",
        confirmButtonText: "OK",
      })
      window.location.reload()
    }
  } 
  catch (error) {
    this.addStatusMessage(`Import failed: ${(error as Error).message}`, "error")

    await Swal.fire({
      title: "Error!",
      text: "Import process failed",
      icon: "error",
      confirmButtonText: "OK",
    })
  }
    
  }

  nextStep(): void {
    if (this.currentStep < 3) {
      this.currentStep++
      if (this.currentStep === 3) {
        this.startImport()
      }
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--
    }
  }

  addStatusMessage(text: string, type: "success" | "warning" | "error"): void {
    this.statusMessages.unshift({ text, type })
  }

  loadMoreRows(): void {
    const currentLength = this.previewData.length
    const newRows = this.excelData.slice(currentLength, currentLength + this.rowsPerPage)
    this.previewData.push(...newRows)
  }


}
