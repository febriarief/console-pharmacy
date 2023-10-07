import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { ERROR_API_RESPONSE, LOCAL_DATE_FORMAT, UTC_TO_LOCAL_TIME } from 'src/app/helpers'
import { StockService } from 'src/app/services'
import { environment } from 'src/environments/environment'

@Component({
  	templateUrl: './stock.component.html'
})

export class StockComponent implements OnInit
{
    @ViewChild('formModal') public formModal: TemplateRef<any>
    
    public modulePermission: string
    public loadingData: boolean
    public loading: any
    public filter: any
    public fakeArray: Array<any>
    public data: any
    public currentPage: number
    public totalItems: number
    public itemsPerPage: number

	constructor(
		private _toastrService: ToastrService,
		private _stockService: StockService
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

		this._stockService.get(this.filter)
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
     * Initiates the export of data to an Excel file by opening a new browser window.
     * Displays an informational toast message before initiating the export request.
     * 
     * @returns void
     */
    exportExcel(): void {
        this.loading.export = true
        const url = `${environment.webUrl}/master-item/stock/export-excel`        
        window.open(url, "_blank")
        this.loading.export = false
    }
}
