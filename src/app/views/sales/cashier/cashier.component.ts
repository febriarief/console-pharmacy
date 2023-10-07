import { AfterContentInit, Component, ElementRef, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr'
import { Subject, Subscription, debounceTime } from 'rxjs';
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from 'src/app/helpers'
import { CashierService, ItemService } from 'src/app/services'

@Component({
    moduleId: module.id,
    templateUrl: './cashier.component.html'
})

export class CashierComponent implements OnInit, AfterContentInit, OnDestroy
{
    @ViewChild('fullScreen') fullScreenElement: ElementRef;
    @ViewChild('modalConfirmation') public modalConfirmation: TemplateRef<any>
    
    elem: any

    public bsModalRef: BsModalRef
    public modalMessage: string
    public isFullscreen: boolean
    public isSubmitting: boolean
    public options: any
    public loading: any
    public form: any
    public valueChanged: Subject<any>
    public inputSub: Subscription
    public data: any
    public subTotal: number
    public total: number
    
    constructor(
        private _bsModalService: BsModalService,
        private _cashierService: CashierService,
        private _itemService: ItemService,
        private _toastrService: ToastrService,
    ) {
        this.isFullscreen = false
        this.valueChanged = new Subject<any>()

        this.options = {
            item: []
        }

        this.loading = {
            item: false
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
        this.clearForm();

        this._loadItems().then((items) => {
            this.options.item = items
        })
    }

    /**
     * A callback method that is invoked immediately after
     * Angular has completed initialization of all of the directive's
     * content.
     * It is invoked only once when the directive is instantiated.
     * 
     * @returns Promise<void>
     */
    async ngAfterContentInit(): Promise<void> {
        this.inputSub = this.valueChanged
        .pipe(debounceTime(600))
        .subscribe(data => {
            if (data) {
                let keyword = null
                if (data.value) keyword = data.value

                this._loadItems(keyword).then((items) => {
                    items.forEach((obj) => {
                        const isExist = this.options.item.find((item) => item.id === obj.id)
                        if (!isExist) this.options.item = [ ...this.options.item, obj ]
                    })
                })
            }
        })
    }

    clearForm() {
        this.form = {
            money_received: null,
            sales_detail: null
        }

        this.data = [{ id: 0, item_id: null, item_txt: null, qty: 1, price: 0, total: 0 }]

        this.subTotal = 0
        this.total = 0
    }

    toggleFullscreen() {
        const elem = this.fullScreenElement.nativeElement

        if (!document.fullscreenElement) {
            elem.requestFullscreen().then(() => {
                this.isFullscreen = true
            }).catch((err) => {
                console.error('Gagal masuk ke mode full screen:', err);
            })
        } else {
            document.exitFullscreen().then(() => {
                this.isFullscreen = false
            }).catch((err) => {
                console.error('Gagal keluar dari mode full screen:', err)
            })
        }
    }

    private _loadItems(name?: any): Promise<any> {
        return new Promise((resolve) => {
            this.loading.item = true

            this._itemService.get({ name })
            .subscribe({
                next: (res: any) => {
                    this.loading.item = false
                    resolve(res?.data || [])
                },
                error: (err: ERROR_API_RESPONSE) => {
                    let errorMessage = 'Cannot get resource data.'
                    if (err.error && err.error.message) errorMessage = err.error.message
                    this._toastrService.error(errorMessage, 'Error')
                    this.loading.item = false
                    resolve([])
                }
            })
        })
    }

    /**
     * Handler for the search functionality.
     * 
     * @param args An object containing search-related information.
     * @returns void
     */
    onSearchItem(args: any): void {
        if (args?.items?.length === 0) {
            this.valueChanged.next({ value: args.term })
        }
    }

    onSelectOptions(index: any, value: any) {
        this.data[index].item_id  = value?.id || null
        this.data[index].item_txt = value?.name || null
        this.data[index].price    = value?.price || null

        if (typeof this.data[index].qty !== 'undefined') {
            this.data[index].total = this.data[index].qty * this.data[index].price
        }
    }

    addItem() {
        this.data.push({ item_id: null, item_txt: null, qty: 1, price: 0, total: 0 })
        this.sumTotal()
    }
    
    removeItem(index: number) {
        this.data.splice(index, 1)
        this.sumTotal()
    }

    sumTotal() {
        setTimeout(() => {
            this.data.map((item) => {
                if (typeof item.qty === 'number' && typeof item.price === 'number' && item.qty !== 0 && item.price !== 0) {
                    item.total = item.qty * item.price
                } else {
                    item.total = 0
                }
    
                return item
            })
    
            this.total = this.subTotal = this.data.reduce((total, item) => total + (item.total || 0), 0)
        }, 300)
    }

    private _validate(): boolean {
        if (!this.form.money_received) {
            this._toastrService.error('Kolom isian uang diterima tidak boleh kosong.')
            return false
        }

        if (!this.data) {
            this._toastrService.error('Minimah harus ada 1 produk yang dipilih.')
            return false
        }
        
        let valid = true
        this.data.forEach((obj: any) => {
            if (!obj.item_id) {
                this._toastrService.error('Terdapat satu nama barang yang belum dipilih.')
                valid = false
                return 
            }

            if (!obj.qty) {
                this._toastrService.error('Terdapat satu barang yang belum di isi kolom qty.')
                valid = false
                return 
            }

            if (!obj.price) {
                this._toastrService.error('Terdapat satu barang yang belum di isi kolom harga.')
                valid = false
                return 
            }
        })

        return valid
    }

    submit(): void {
        if (!this._validate()) return
        
        this.isSubmitting = true
        this.modalMessage = null
        this.form.sales_detail = this.data

        this._cashierService.store(this.form)
        .subscribe({
            next: (res: SUCCESS_API_RESPONSE) => {
                this.isSubmitting = false
                this.modalMessage = res.message

                this.showModalConfirmation()
                this.clearForm()
            }, 
            error: (err: ERROR_API_RESPONSE) => {
                this.isSubmitting = false
                let errorMessage = 'Terdapat masalah saat menyimpan data penjualan'
				if (err.error && err.error.message) errorMessage = err.error.message
				this._toastrService.error(errorMessage, 'Error')
            }
        })
    }

    /**
	 * Show modal confirmation
	 *
	 * @return void
	 */
	showModalConfirmation(): void {
        this.bsModalRef = this._bsModalService.show(
            this.modalConfirmation,
            { class: "modal-md" }
        )
	}

    /**
	 * Close modal
	 *
	 * @return void
	 */
	closeModal(): void {
        this.bsModalRef.hide()
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
