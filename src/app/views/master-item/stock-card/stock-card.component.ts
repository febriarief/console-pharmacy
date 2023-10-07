import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { ERROR_API_RESPONSE, LOCAL_DATE_FORMAT, MYSQL_DATE_FORMAT, UTC_TO_LOCAL_TIME } from 'src/app/helpers'
import { StockCardService } from 'src/app/services'
import { environment } from 'src/environments/environment'

@Component({
  	templateUrl: './stock-card.component.html'
})

export class StockCardComponent implements OnInit
{
    @ViewChild('formModal') public formModal: TemplateRef<any>
    @ViewChild('exportModal') public exportModal: TemplateRef<any>
    
    public modulePermission: string
    public bsModalRef: BsModalRef
    public isSubmitting: boolean
    public loadingData: boolean
    public loading: any
    public filter: any
    public fakeArray: Array<any>
    public data: any
    public currentPage: number
    public totalItems: number
    public itemsPerPage: number
    public form: any
    public modalForm: any
    public formTitle: string
    public editMode: boolean
    public formValidation: any
    public modalFormValidation: any
    public options: any

	constructor(
        private _bsModalService: BsModalService,
		private _toastrService: ToastrService,
		private _stockCardService: StockCardService
	) {
        this.modulePermission = 'MasterItem.Item.'
        this.loadingData = true
        this.loading = {
            export: false
        }
        this.data = []
        this.currentPage = 1
        this.totalItems = 0
        this.itemsPerPage = 10
        this.fakeArray = new Array(5)
        this.formTitle = 'Tambah Data Barang'
        this.editMode = false
        this.options = {
            type: [
                { name: 'IN' },
                { name: 'OUT' }
            ]
        }
	}

    /**
     * A callback method that is invoked immediately after the
     * default change detector has checked the directive's
     * data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     * It is invoked only once when the directive is instantiated.
     * 
     * @returns void
     */
    ngOnInit(): void {
        this.clearFilter()
        this.loadData()
        this.clearForm()
    }

    /**
	 * Reset value of param filter before making a request
	 * to fetch resources.
	 *
	 * @return void
	 */
	clearFilter(): void {
		this.filter = {
            sort: null,
            page: 1
		}
	}

    /**
     * Toggles the sorting behavior of a list of items based on the provided sorting key.
     *
     * @param key - The sorting key to apply.
     * @returns void
     */
    sort(key: string): void {
        if (this.filter.sort === key) {
            this.filter.sort = null
        } else {
            this.filter.sort = key
        }

        this.loadData()
    }

    /**
	 * Load resource from main service
	 *
	 * @param page any
	 * @return void
	 */
	loadData(page: any = 1): void {
		this.loadingData = true
		this.filter.page = page

		this._stockCardService.get(this.filter)
		.subscribe({
			next: (res: any) => {
				if (res.data && res.data.data) {
					this.data = res.data.data.map((obj) => {
                        return { ...obj, updated_at_parsed: `${LOCAL_DATE_FORMAT(obj.updated_at)} - ${UTC_TO_LOCAL_TIME(obj.updated_at)}` }
                    })
					this.currentPage = page
					this.totalItems = res.data.total
				}

				this.loadingData = false

			},
			error: (err: ERROR_API_RESPONSE) => {
				let errorMessage = 'Cannot get resource data.'
				if (err.error && err.error.message) errorMessage = err.error.message
				this._toastrService.error(errorMessage, 'Error')
				this.loadingData = false
			}
		})
	}

    /**
	 * Reset value of object form before making a request
	 * to add resources.
	 *
	 * @return void
	 */
	clearForm(): void {
		this.form = {
            stock_card_id: null,
            name: null,
            unit: null,
            type: null,
            qty: null
        }

        this.modalForm = {
            from: null,
            to: null
        }
	}

    /**
     * Initiates the process of editing existing data by displaying a modal form.
     *
     * @param entry - The data entry to be edited.
     * @returns void
     */
    adjustData(entry: any): void {
        this.formTitle = 'Sesuaikan Stok Barang'
        this.editMode = true
        this.form = {
            ...entry,
            stock_card_id: entry.id,
            type: null,
            qty: null
        }

        this._openform()
    }

    /**
     * Opens a modal form for creating or editing data.
     * Initializes the form, clears any previous form data and validation messages,
     * and displays the modal dialog.
     * 
     * @returns void
     */
    private _openform(): void {
        this.clearFormValidation()

        this.bsModalRef = this._bsModalService.show(this.formModal, { 
            class: 'modal-md',
            ignoreBackdropClick: true
        })
    }

    /**
     * Closes the currently open modal.
     * 
     * @returns void
     */
	closeForm(): void {
        this.bsModalRef.hide()
	}

    /**
	 * Reset value of object form before making a request
	 * to add resources.
	 *
	 * @return void
	 */
	clearFormValidation(): void {
		this.formValidation = {
            type: { valid: true, message: null },
            qty: { valid: true, message: null }
        }

		this.modalFormValidation = {
            from: { valid: true, message: null },
            to: { valid: true, message: null }
        }
	}

    /**
	 * Validate main form before submit data
	 *
	 * @returns boolean
	 */
	validate(): boolean {
        this.clearFormValidation()

        let valid = true
		if (!this.form.type) {
            this.formValidation.type.valid = false
            this.formValidation.type.message = 'Kolom isian tipe tidak boleh kosong.'
            valid = false
		}

		if (!this.form.qty) {
            this.formValidation.qty.valid = false
            this.formValidation.qty.message = 'Kolom isian qty tidak boleh kosong.'
            valid = false
		}

		if (this.form.qty && isNaN(Number(this.form.qty))) {
            this.formValidation.qty.valid = false
            this.formValidation.qty.message = 'Kolom isian qty harus berupa angka.'
            valid = false
		}

		return valid
	}

    /**
     * Saves the form data by updating an existing entry (in edit mode) or creating a new entry (in creation mode).
     * 
     * @returns void
     */
    save(): void {
        if (!this.validate()) return
        this.isSubmitting = true

        const request = { stock_card_id: this.form.stock_card_id, type: this.form.type, qty: this.form.qty }
        this._stockCardService.store(request)
        .subscribe({
            next: () => {
                this.isSubmitting = false
                this.closeForm()
                this._toastrService.success('Data berhasil disimpan.', 'Berhasil')
                setTimeout(() => this.loadData(), 600)
            },
            error: (err: ERROR_API_RESPONSE) => {
                this.isSubmitting = false
                        
                const respErr = Object.keys(err.error.errors)
                for (let i = 0; i < respErr.length; i++) {
                    this.formValidation[respErr[i]].message = err.error.errors[respErr[i]][0]
                }

                let errorMessage = 'Tidak dapat menyimpan data kartu stok.'
                if (err.error && err.error.message) errorMessage = err.error.message
                this._toastrService.error(errorMessage, 'Error')
            }
        })
    }

    /**
     * Opens a modal dialog for exporting data.
     * Clears the form and form validation state before opening the modal.
     * The modal is displayed with a small size.
     * 
     * @returns void
     */
    openModalExport(): void {
        this.clearForm()
        this.clearFormValidation()

        this.bsModalRef = this._bsModalService.show(this.exportModal, { 
            // class: 'modal-sm'
        })
    }

    /**
     * Initiates the export of data to an Excel file by opening a new browser window.
     * Displays an informational toast message before initiating the export request.
     * 
     * @returns void
     */
    exportExcel(): void {
        this.clearFormValidation()

        let valid = true
		if (!this.modalForm.from) {
            this.modalFormValidation.from.valid = false
            this.modalFormValidation.from.message = 'Kolom isian dari tanggal tidak boleh kosong.'
            valid = false
		}

		if (!this.modalForm.to) {
            this.modalFormValidation.to.valid = false
            this.modalFormValidation.to.message = 'Kolom isian sampai tanggal tidak boleh kosong.'
            valid = false
		}

        if (!valid) return

        this.loading.export = true
        
        const from = MYSQL_DATE_FORMAT(this.modalForm.from)
        const to = MYSQL_DATE_FORMAT(this.modalForm.to)
        const url = `${environment.webUrl}/master-item/stock-card/export-excel?from=${from}&to=${to}`        
        window.open(url, "_blank")
        this.loading.export = false

        setTimeout(() => this.closeForm(), 600)
    }
}
