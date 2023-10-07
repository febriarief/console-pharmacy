import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from 'src/app/helpers'
import { ModalService, RoleService, UserService } from 'src/app/services'

@Component({
  	templateUrl: './user.component.html'
})

export class UserComponent implements OnInit
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
    public viewMode: boolean
    public editMode: boolean
    public isSubmitting: boolean
    public isSecuredPassword: boolean

	constructor(
        private _bsModalService: BsModalService,
        private _modalService: ModalService,
        private _roleService: RoleService,
		private _toastrService: ToastrService,
		private _userService: UserService
	) {
        this.modulePermission = 'System.User.'
        this.loadingData = true
        this.data = []
        this.currentPage = 1
        this.totalItems = 0
        this.itemsPerPage = 10
        this.fakeArray = new Array(5)
        this.formTitle = 'Tambah Data Pengguna'
        this.viewMode = false
        this.editMode = false
        this.isSubmitting = false
        this.isSecuredPassword = true

        this.options = {
            roles: []
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

        this._loadRoles().then((roles) => {
            this.options.roles = roles
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
            sort: null,
            with: 'roles'
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
            role: null,
            email: null,
            password: null,
        }
	}

    /**
	 * Toggle secure password
	 *
	 * @return void
	 */
	toggelSecurePassword(): void {
		this.isSecuredPassword = !this.isSecuredPassword
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

		this._userService.get(this.filter)
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

        this.formTitle = 'Tambah Data Pengguna'
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
        this.formTitle = 'Ubah Data Pengguna'
        this.viewMode = false
        this.editMode = true
        this.form = { ...entry }

        if (entry?.roles?.length > 0) {
			this.form.role = entry.roles[0].name
			delete this.form.roles
		}

        this._openform()
    }

    /**
     * Displays a modal form in read-only view mode to show the details of a data entry.
     *
     * @param entry - The data entry to be viewed.
     * @returns void
     */
    viewData(entry: any): void {
        this.formTitle = 'Lihat Data Pengguna'
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

        this.isSecuredPassword = true
        
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
        this.clearForm()
        this.clearFormValidation()
        
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
            role: { valid: true, message: null },
            email: { valid: true, message: null },
            password: { valid: true, message: null }
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

		if (!this.form.role) {
            this.formValidation.role.valid = false
            this.formValidation.role.message = 'Kolom pilihan role tidak boleh kosong'
            valid = false
		}

		if (!this.form.email) {
            this.formValidation.email.valid = false
            this.formValidation.email.message = 'Kolom isian email tidak boleh kosong'
            valid = false
		}

        if (!this.editMode) {
            if (!this.form.password) {
                this.formValidation.password.valid = false
                this.formValidation.password.message = 'Kolom isian kata sandi tidak boleh kosong'
                valid = false
            }
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
            this._userService.update(this.form, this.form.id)
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

                    let errorMessage = 'Tidak dapat menyimpan data user.'
                    if (err.error && err.error.message) errorMessage = err.error.message
                    this._toastrService.error(errorMessage, 'Error')
                }
            })
        } else {
            this._userService.store(this.form)
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

                    let errorMessage = 'Tidak dapat menyimpan data user.'
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
                this._userService.delete(id)
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
     * Loads roles data from the API and returns it as a Promise.
     * 
     * @returns A Promise that resolves with the retrieved roles data or an empty array in case of an error.
     */
    private _loadRoles(): Promise<any> {
        return new Promise((resolve) => {
            this._roleService.get()
            .subscribe({
                next: (res: SUCCESS_API_RESPONSE) => {
                    if (res.data) {
                        resolve(res.data)
                        return
                    } else {
                        resolve([])
                        return
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
