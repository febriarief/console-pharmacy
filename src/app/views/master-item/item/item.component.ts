import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from 'src/app/helpers'
import { ModalService, ItemService, UnitService } from 'src/app/services'

@Component({
  	templateUrl: './item.component.html'
})

export class ItemComponent implements OnInit
{
    @ViewChild('formModal') public formModal: TemplateRef<any>
    
    public modulePermission: string
    public bsModalRef: BsModalRef
    public modalData: any
    public loadingData: boolean
    public filter: any
    public fakeArray: Array<any>
    public data: any
    public currentPage: number
    public totalItems: number
    public itemsPerPage: number
    public form: any
    public formValidation: any
    public formTitle: string
    public options: any
    public editMode: boolean
    public isSubmitting: boolean

	constructor(
        private _bsModalService: BsModalService,
        private _modalService: ModalService,
		private _itemService: ItemService,
		private _toastrService: ToastrService,
		private _unitService: UnitService
	) {
        this.modulePermission = 'MasterItem.Item.'
        this.loadingData = true
        this.data = []
        this.currentPage = 1
        this.totalItems = 0
        this.itemsPerPage = 10
        this.fakeArray = new Array(5)
        this.formTitle = 'Tambah Data Barang'
        this.editMode = false
        this.isSubmitting = false

        this.options = {
            units: []
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
        this.clearFormValidation()

        this._loadDataUnit().then((data) => {
            this.options.units = data
        })
    }

    /**
	 * Reset value of param filter before making a request
	 * to fetch resources.
	 *
	 * @return void
	 */
	clearFilter(): void {
		this.filter = {
			name: null,
            with: 'unit',
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
	 * Reset value of object form before making a request
	 * to add resources.
	 *
	 * @return void
	 */
	clearForm(): void {
		this.form = {
            name: null,
            unit_id: null,
            unit_name: null,
            price: null
        }
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

		this._itemService.get(this.filter)
		.subscribe({
			next: (res: any) => {
				if (res.data && res.data.data) {
					this.data = res.data.data
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
     * Initiates the process of creating new data by displaying a modal form.
     * 
     * @returns void
     */
    createData(): void {   
        this.clearForm()
             
        this.formTitle = 'Tambah Data Barang'
        this.editMode = false

        this._openform()
    }

    /**
     * Initiates the process of editing existing data by displaying a modal form.
     *
     * @param entry - The data entry to be edited.
     * @returns void
     */
    editData(entry: any): void {
        this.formTitle = 'Ubah Data Barang'
        this.editMode = true
        this.form = { ...this.form, ...entry }

        if (this.form.unit.id) {
            this.form.unit_id = this.form.unit?.id || null
            this.form.unit_name = this.form.unit?.short || null
            
            delete this.form.unit
            delete this.form.created_at
            delete this.form.updated_at
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
        this.modalData = null
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
            name: { valid: true, message: null },
            unit_id: { valid: true, message: null },
            price: { valid: true, message: null }
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
		if (!this.form.name) {
            this.formValidation.name.valid = false
            this.formValidation.name.message = 'Kolom isian nama tidak boleh kosong'
            valid = false
		}

		if (!this.form.unit_id) {
            this.formValidation.unit_id.valid = false
            this.formValidation.unit_id.message = 'Kolom isian satuan tidak boleh kosong'
            valid = false
		}

		// if (!this.form.price) {
        //     this.formValidation.price.valid = false
        //     this.formValidation.price.message = 'Kolom isian harga tidak boleh kosong'
        //     valid = false
		// }

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

        if (this.editMode) {
            this._itemService.update(this.form, this.form.id)
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

                    let errorMessage = 'Tidak dapat menyimpan data barang.'
                    if (err.error && err.error.message) errorMessage = err.error.message
                    this._toastrService.error(errorMessage, 'Error')
                }
            })
        } else {
            this._itemService.store(this.form)
            .subscribe({
                next: () => {
                    this.isSubmitting = false
                    this.closeForm()
                    this._toastrService.success('Data berhasil dibuat.', 'Berhasil')
                    setTimeout(() => this.loadData(), 600)
                },
                error: (err: ERROR_API_RESPONSE) => {
                    this.isSubmitting = false
                            
                    const respErr = Object.keys(err.error.errors)
                    for (let i = 0; i < respErr.length; i++) {
                        this.formValidation[respErr[i]].message = err.error.errors[respErr[i]][0]
                    }

                    let errorMessage = 'Tidak dapat menyimpan data barang.'
                    if (err.error && err.error.message) errorMessage = err.error.message
                    this._toastrService.error(errorMessage, 'Error')
                }
            })
        }
    }

    /**
     * Deletes a data entry based on the provided ID.
     *
     * @param id - The ID of the data entry to be deleted.
     * @returns void
     */
    deleteData(id: any): void {
        this._modalService.confirm('Apakah Anda yakin akan menghapus data ini?', 'Konfirmasi')
		.then((res: any) => {
            if (res) {
                this._itemService.delete(id)
                .subscribe({
                    next: () => {
                        this._toastrService.success('Data berhasil dihapus.', 'Berhasil')
                        this.loadData()
                    },
                    error: (err: ERROR_API_RESPONSE) => {
                        let errorMessage = 'Cannot get resource data.'
                        if (err.error && err.error.message) errorMessage = err.error.message
                        this._toastrService.error(errorMessage, 'Error')
                    }
                })
            } 
		})
    }

    /**
     * Fetches and loads unit data from the API.
     * 
     * @returns A Promise that resolves with the retrieved unit data or an empty array in case of an error.
     */
    private _loadDataUnit(): Promise<any[]> {
        return new Promise((resolve) => {
            this._unitService.get()
            .subscribe({
                next: (res: SUCCESS_API_RESPONSE) => {
                    if (res.data?.length > 0) {
                        resolve(res.data)
                    } else if (res.data?.data?.length > 0) {
                        resolve(res.data.data)
                    } else {
                        resolve([])
                    }
                },
                error: (err: ERROR_API_RESPONSE) => {
                    let errorMessage = 'Cannot get resource data.'
                    if (err.error && err.error.message) errorMessage = err.error.message
                    this._toastrService.error(errorMessage, 'Error')
                    resolve([])
                }
            })
        })
    }
}
