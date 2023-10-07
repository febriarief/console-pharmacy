import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { ERROR_API_RESPONSE, LOCAL_DATE_FORMAT, SUCCESS_API_RESPONSE, getFirebasePublicUrl } from 'src/app/helpers'
import { AuthenticationService, ItemService, ModalService, PurchaseRequestService, SupplierService, UtilsService } from 'src/app/services'

@Component({
  	templateUrl: './purchase-request.component.html'
})

export class PurchaseRequestComponent implements OnInit
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
    public isSubmitting: boolean
    public currentDate: string
    public loading: any
    public dataDetail: any
    public formDetailValidation: any
    public options: any

    private _user: any

	constructor(
        private _authenticationService: AuthenticationService,
        private _bsModalService: BsModalService,
        private _itemService: ItemService,
        private _modalService: ModalService,
		private _purchaseRequestService: PurchaseRequestService,
		private _supplierService: SupplierService,
		private _toastrService: ToastrService,
		private _utilsService: UtilsService
	) {
        this.modulePermission = 'Purchase.PurchaseRequest.'
        this._user = _authenticationService.getUser()

        this.loadingData = true
        this.data = []
        this.currentPage = 1
        this.totalItems = 0
        this.itemsPerPage = 10
        this.fakeArray = new Array(5)
        this.formTitle = 'Tambah Data PR'
        this.viewMode = false
        this.isSubmitting = false
        this.currentDate = null

        this.loading = {
            date: false
        }

        this.dataDetail = []
        this.formDetailValidation = []

        this.options = {
            item: [],
            supplier: []
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
        this.clearFormDetail()

        this.clearFormValidation()
        this.clearFormDetailValidation()

        this._loadDataItems().then((data) => {
            this.options.item = data
        })

        this._loadDataSuppliers().then((data) => {
            this.options.supplier = data
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
			id: null,
            with: 'purchaseRequestDetail', 
            sort: null,
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
            note: null,
            created_by: this._user.name
        }
	}

    /**
	 * Reset value of object form detail before making a request
	 * to add resources.
	 *
	 * @return void
	 */
	clearFormDetail(): void {
		this.dataDetail = [{
            id: 0,
            item_id: null,
            item_txt: null,
            supplier_id: null,
            supplier_txt: null,
            qty: null
        }]
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

		this._purchaseRequestService.get(this.filter)
		.subscribe({
			next: (res: any) => {
				if (res.data && res.data.data) {
					this.data = res.data.data.map((item) => {
                        return { ...item, created_at_parsed: LOCAL_DATE_FORMAT(item.created_at) }
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
     * Fetches and loads data items from the API.
     * 
     * @returns A Promise that resolves with the retrieved unit data or an empty array in case of an error.
     */
    private _loadDataItems(): Promise<any[]> {
        return new Promise((resolve) => {
            this._itemService.get()
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
    
    /**
     * Fetches and loads data supplier from the API.
     * 
     * @returns A Promise that resolves with the retrieved unit data or an empty array in case of an error.
     */
    private _loadDataSuppliers(): Promise<any[]> {
        return new Promise((resolve) => {
            this._supplierService.get()
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

    /**
     * Handles the selection of options based on the provided key and arguments.
     *
     * @param key The key identifying the type of option being selected (e.g., 'item', 'supplier').
     * @param args The selected option data.
     * @param index The index of the item in the dataDetail array.
     * @returns void
     */
    onSelectOptions(key: string, args: any, index: number): void {
        if (!key || !args) return
        switch(key) {
            case 'item':
                this.dataDetail[index].item_id  = args.id
                this.dataDetail[index].item_txt = args.name
                break
            case 'supplier':
                this.dataDetail[index].supplier_id  = args.id
                this.dataDetail[index].supplier_txt = args.name
                break
            default:
                break
        }
    }

    /**
     * Initiates the process of creating new data by displaying a modal form.
     * 
     * @returns void
     */
    createData(): void {
        this._getDate().then((rawDate: any) => {
            if (!rawDate) return
            this.currentDate = `${rawDate.date} ${rawDate.month_name} ${rawDate.year}`
        })

        this.clearForm()
        this.clearFormDetail()
             
        this.formTitle = 'Buat Data Permintaan'
        this.viewMode = false

        this._openform()
    }

    /**
     * Fetches a date from the API and returns it as a Promise.
     * 
     * @returns A Promise that resolves with the retrieved date or null in case of an error.
     */
    private _getDate(): Promise<any> {
        this.loading.date = true

        return new Promise((resolve) => {
            this._utilsService.getDate()
            .subscribe({
                next: (resp: SUCCESS_API_RESPONSE) => {
                    this.loading.date = false
                    resolve(resp?.data || null)
                },
                error: (err: ERROR_API_RESPONSE) => {
                    this.loading.date = false
                    let errorMessage = 'Cannot get resource data.'
                    if (err.error && err.error.message) errorMessage = err.error.message
                    this._toastrService.error(errorMessage, 'Error')
                    resolve(null)
                }
            })
        })
    }

    /**
     * Displays a modal form in read-only view mode to show the details of a data entry.
     *
     * @param entry - The data entry to be viewed.
     * @returns void
     */
    viewData(entry: any): void {
        this.formTitle = 'Lihat Data Permintaan'
        this.viewMode = true
        this.form = { ...entry }

        this.dataDetail = (entry.purchase_request_detail || []).map((detail) => {
            return  {
                id: detail.id,
                item_txt: detail?.item_name || null,
                supplier_txt: detail?.supplier_name || null,
                qty: detail?.qty || 0
            }
        }) 

        this.currentDate = LOCAL_DATE_FORMAT(entry.created_at)

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
        this.clearFormDetailValidation()

        this.bsModalRef = this._bsModalService.show(this.formModal, { 
            class: 'modal-xl',
            ignoreBackdropClick: true
        })

        this.bsModalRef.onHide.subscribe({
            next: () => {
                this.currentDate = null
                this.modalData = null
            }
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
		this.formValidation = {}
	}

    /**
	 * Reset value of object form detail before making a request
	 * to add resources.
	 *
	 * @return void
	 */
	clearFormDetailValidation(): void {
		this.formDetailValidation = []
	}

    /**
     * Adds a new item to the dataDetail array with default property values.
     * 
     * @returns void
     */
    addFormDetail(): void {
        this.dataDetail.push({
            id: this.dataDetail.length,
            item_id: null,
            item_txt: null,
            supplier_id: null,
            supplier_txt: null,
            qty: null
        })
    }

    /**
     * Deletes a data detail item from the dataDetail array at the specified index.
     * @param index The index of the item to be deleted.
     * 
     * @returns void
     */
    deleteFormDetail(index: number) {
        this.dataDetail.splice(index, 1)
        this.dataDetail.forEach((item, index) => {
            item.id = index + 1
        })
    } 

    /**
	 * Validate main form before submit data
	 *
	 * @returns boolean
	 */
	validate(): boolean {
        this.clearFormValidation()

        let valid = true
		return valid
	}

    /**
	 * Validate detail form before submit data
	 *
	 * @returns boolean
	 */
    vaildateDetail(): boolean {
        this.clearFormDetailValidation()

        let valid = true
        for(let i = 0; i < this.dataDetail.length; i++) {
            this.formDetailValidation[i] = {
                item_id: null,
                supplier_id: null,
                qty: null
            }

            const form = this.dataDetail[i]
            if (!form.item_id) {
                this.formDetailValidation[i].item_txt = 'Kolom pilihan barang tidak boleh kosong.'
                valid = false
            }

            if (!form.supplier_id) {
                this.formDetailValidation[i].supplier_txt = 'Kolom pilihan supplier tidak boleh kosong.'
                valid = false
            }

            if (!form.qty) {
                this.formDetailValidation[i].qty = 'Kolom isian qty tidak boleh kosong.'
                valid = false
            }

            if (form.qty && isNaN(Number(form.qty))) {
                this.formDetailValidation[i].qty = 'Kolom isian qty harus berupa angka.'
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
        if (!this.validate() || !this.vaildateDetail()) return
        const request = {
            ...this.form,
            detail: this.dataDetail.map((item) => {
                const { id, item_txt, supplier_txt, ...rest } = item
                return rest
            })
        }

        this.isSubmitting = true
        
        this._purchaseRequestService.store(request)
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

    /**
     * Initiates the download of a PDF file based on the provided identifier.
     * 
     * @param id The identifier of the PDF file to be downloaded.
     * @returns void
     */
    downloadPdf(id: string): void {
        const infoToastr = this._toastrService.info('Melakukan permintaan untuk mendownload file PDF.', 'Info')

        this._purchaseRequestService.downloadPDF(id)
        .subscribe({
            next: (res: SUCCESS_API_RESPONSE) => {
                if (infoToastr.toastId) {
                    this._toastrService.remove(infoToastr.toastId)
                }

                if (res.data?.filepath) {
                    const url = getFirebasePublicUrl(res.data.filepath, 'pdf')
                    window.open(url, "_blank")
                } else {
                    this._toastrService.error('Tidak dapat memuat url file PDF', 'Error')
                }
            },
            error: (err: ERROR_API_RESPONSE) => {
                if (infoToastr.toastId) {
                    this._toastrService.remove(infoToastr.toastId)
                }
                
                let errorMessage = 'Cannot get resource data.'
                if (err.error && err.error.message) errorMessage = err.error.message
                this._toastrService.error(errorMessage, 'Error')
            }
        })
    }
}
