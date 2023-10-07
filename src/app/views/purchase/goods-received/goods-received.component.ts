import { AfterContentInit, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ToastrService } from 'ngx-toastr'
import { Subject, Subscription, debounceTime } from 'rxjs'
import { ERROR_API_RESPONSE, LOCAL_DATE_FORMAT, SUCCESS_API_RESPONSE, getFirebasePublicUrl } from 'src/app/helpers'
import { AuthenticationService, GoodReceivedService, PurchaseOrderService, UtilsService } from 'src/app/services'

@Component({
  	templateUrl: './goods-received.component.html'
})

export class GoodsReceivedComponent implements OnInit, AfterContentInit, OnDestroy
{
    @ViewChild('formModal') public formModal: TemplateRef<any>
    
    public modulePermission: string
    public bsModalRef: BsModalRef
    public modalData: any
    public loadingData: boolean
    public filter: any
    public fakeArray: Array<any>
    public valueChanged: Subject<any>
    public inputSub: Subscription
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
    public selectedPO: any

    private _user: any

	constructor(
        private _authenticationService: AuthenticationService,
        private _bsModalService: BsModalService,
        private _goodReceivedService: GoodReceivedService,
		private _purchaseOrderService: PurchaseOrderService,
		private _toastrService: ToastrService,
		private _utilsService: UtilsService
	) {
        this.modulePermission = 'Purchase.GoodReceived.'
        this._user = _authenticationService.getUser()
        this.valueChanged = new Subject<any>()
        
        this.loadingData = true
        this.data = []
        this.currentPage = 1
        this.totalItems = 0
        this.itemsPerPage = 10
        this.fakeArray = new Array(5)
        this.formTitle = 'Tambah Data PO'
        this.viewMode = false
        this.isSubmitting = false
        this.currentDate = null

        this.loading = {
            date: false,
            purchase_order: false
        }

        this.dataDetail = []
        this.formDetailValidation = []

        this.options = {
            purchase_order: []
        }

        this.selectedPO = null
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

        this._loadDataPO().then((data) => {
            this.options.purchase_order = data
        })
    }

    /**
     * A callback method that is invoked immediately after
     * Angular has completed initialization of all of the directive's
     * content.
     * It is invoked only once when the directive is instantiated.
     * 
     * @return void
     */
    ngAfterContentInit(): void {
        this.inputSub = this.valueChanged
        .pipe(debounceTime(600))
        .subscribe(data => {
            if (data) {
                let keyword = null
                if (data.value) keyword = data.value

                this._loadDataPO(keyword).then((data) => {
                    this.options.purchase_order = data
                })
            }
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
            with: 'goodReceivedDetail.purchaseOrder', 
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
		this.dataDetail = []
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

		this._goodReceivedService.get(this.filter)
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
     * Fetches and loads data purchase order from the API.
     * 
     * @returns A Promise that resolves with the retrieved unit data or an empty array in case of an error.
     */
    private _loadDataPO(id?: string): Promise<any[]> {
        this.loading.purchase_order = true

        return new Promise((resolve) => {
            id = typeof id === 'undefined' ? null : id

            this._purchaseOrderService.get({ id, with: 'purchaseOrderDetail', page: 1 })
            .subscribe({
                next: (res: SUCCESS_API_RESPONSE) => {
                    this.loading.purchase_order = false

                    if (res.data?.data?.length > 0) {
                        resolve(res.data.data)
                    } else if (res.data?.length > 0) {
                        resolve(res.data)
                    } else {
                        resolve([])
                    }
                },
                error: (err: ERROR_API_RESPONSE) => {
                    this.loading.purchase_order = false

                    let errorMessage = 'Cannot get resource data.'
                    if (err.error && err.error.message) errorMessage = err.error.message
                    this._toastrService.error(errorMessage, 'Error')
                    resolve([])
                }
            })
        })
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
             
        this.formTitle = 'Buat Data Penerimaan'
        this.viewMode = false
        this.selectedPO = null

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
        this.formTitle = 'Lihat Data Order'
        this.viewMode = true
        this.form = { ...entry }

        let dataDetail = []
        const details = entry?.good_received_detail || []
        for(let i = 0; i < details.length; i++) {
            const detail = details[i]
            const indexDetail = dataDetail.findIndex((obj) => obj.id === detail.purchase_order_id)

            if (indexDetail === -1) {
                dataDetail[dataDetail.length] = {
                    id: detail?.purchase_order?.id || null,
                    note: detail?.purchase_order?.note || null,
                    purchase_order_detail: [{
                        item_name: detail.item_name,
                        supplier_name: detail.supplier_name,
                        qty_order: detail.qty_order,
                        qty: detail.qty
                    }]
                }
            } else {
                dataDetail[indexDetail].purchase_order_detail.push({
                    item_name: detail.item_name,
                    supplier_name: detail.supplier_name,
                    qty_order: detail.qty_order,
                    qty: detail.qty
                })
            }
        }

        this.currentDate = LOCAL_DATE_FORMAT(entry.created_at)
        this.dataDetail = dataDetail

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
        if (!this.selectedPO) {
            this._toastrService.error('Pilih 1 data PO terlebih dahulu')
            return
        }

        let selectedItem = this.options.purchase_order.find((obj) => obj.id === this.selectedPO)
        if (selectedItem?.purchase_order_detail) {
            selectedItem.purchase_order_detail = selectedItem.purchase_order_detail.map((obj) => {
                return { ...obj, qty_order: obj.qty, qty: null }
            })
        }

        this.dataDetail.push(selectedItem)
        
        this.selectedPO = null
    }

    /**
     * Deletes a data detail item from the dataDetail array at the specified index.
     * @param index The index of the item to be deleted.
     * 
     * @returns void
     */
    deleteFormDetail(index: number) {
        this.dataDetail.splice(index, 1)
    } 

    /**
     * Handler for the search functionality.
     * 
     * @param args An object containing search-related information.
     * @returns void
     */
    onSearchPO(args: any): void {
        if (args?.items?.length === 0) {
            this.valueChanged.next({ value: args.term })
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
        const purchasOrders = this.dataDetail
        for (let i = 0; i < purchasOrders.length; i++) {

            const po = purchasOrders[i]
            const detail = po?.purchase_order_detail || []

            if (!this.formDetailValidation[po.id]) {
                this.formDetailValidation[po.id] = {}
            }
            
            for (let o = 0; o < detail.length; o++) {
                this.formDetailValidation[po.id][o] = { qty: null }

                const form = detail[o]
                if (form.qty === null) {
                    this.formDetailValidation[po.id][o].qty = 'Kolom isian qty tidak boleh kosong.'
                    valid = false
                }

                if (form.qty && isNaN(Number(form.qty))) {
                    this.formDetailValidation[po.id][o].qty = 'Kolom isian qty harus berupa angka.'
                    valid = false
                }
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

        const detail = this.dataDetail.map((obj) => {
            return {
                purchase_order_id: obj.id,
                items: (obj?.purchase_order_detail || []).map((item) => {
                    return { 
                        purchase_order_detail_id: item.id,
                        qty: item.qty
                    }
                })
            }
        })

        const request = { ...this.form, detail }
        this.isSubmitting = true

        this._goodReceivedService.store(request)
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

    downloadPdf(id: string): void {
        const infoToastr = this._toastrService.info('Melakukan permintaan untuk mendownload file PDF.', 'Info')

        this._goodReceivedService.downloadPDF(id)
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

    /**
     * A callback method that performs custom clean-up, invoked immediately
     * before a directive, pipe, or service instance is destroyed.
     * 
     * @returns void
     */
    ngOnDestroy(): void {
        this.inputSub.unsubscribe()
    }
}
