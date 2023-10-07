import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { ERROR_API_RESPONSE } from 'src/app/helpers'
import { ModalService, PermissionService } from 'src/app/services'

@Component({
  	templateUrl: './permission.component.html'
})

export class PermissionComponent implements OnInit
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
    public viewMode: boolean
    public editMode: boolean
    public isSubmitting: boolean

	constructor(
        private _bsModalService: BsModalService,
        private _modalService: ModalService,
		private _permissionService: PermissionService,
		private _toastrService: ToastrService
	) {
        this.modulePermission = 'System.Permission.'
        this.loadingData = true
        this.data = []
        this.currentPage = 1
        this.totalItems = 0
        this.itemsPerPage = 10
        this.fakeArray = new Array(5)
        this.formTitle = 'Tambah Data Hak Akses'
        this.viewMode = false
        this.editMode = false
        this.isSubmitting = false
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
            sort: null
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
            name: null
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

		this._permissionService.get(this.filter)
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
             
        this.formTitle = 'Tambah Data Hak Akses'
        this.viewMode = false
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
        this.formTitle = 'Ubah Data Hak Akses'
        this.viewMode = false
        this.editMode = true
        this.form = { ...entry }

        this._openform()
    }

    /**
     * Displays a modal form in read-only view mode to show the details of a data entry.
     *
     * @param entry - The data entry to be viewed.
     * @returns void
     */
    viewData(entry: any): void {
        this.formTitle = 'Lihat Data Hak Akses'
        this.viewMode = true
        this.editMode = false
        this.form = { ...entry }

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
            class: 'modal-md'
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
            name: { valid: true, message: null }
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
            this._permissionService.update(this.form, this.form.id)
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
                }
            })
        } else {
            this._permissionService.store(this.form)
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
                this._permissionService.delete(id)
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
}
