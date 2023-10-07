import { Component, OnInit } from '@angular/core'
import { ToastrService } from 'ngx-toastr'
import { ERROR_API_RESPONSE, SUCCESS_API_RESPONSE } from 'src/app/helpers'
import { SummarySalesService, UtilsService } from 'src/app/services'

@Component({
  	templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit
{
    public loading: any
    public chartOptions: any
    public dataStock: any
    public currentYear: any
    
	constructor(
        public toastrService: ToastrService,
        private _summarySalesService: SummarySalesService,
        private _utilsService: UtilsService
    ) {
        this.currentYear = new Date().getFullYear()

        this.loading = {
            summary_sales: true,
            stock_reminder: true
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
        this._loadSummarySales()
        this._loadStock()
    }

    private _loadSummarySales(): void {
        this.loading.summary_sales = true

        this._summarySalesService.get()
        .subscribe({
            next: (res: SUCCESS_API_RESPONSE) => {
                let data = res.data.map((obj) => {
                    obj.y =  obj.y / 1000
                    return obj
                })

                this.chartOptions = {
                    // title: {
                    //     text: "Laporan Penjualan 2023"
                    // },
                    theme: "light2",
                    animationEnabled: true,
                    axisY: {
                        includeZero: true,
                        valueFormatString: "Rp #,##0 k"
                    },
                    data: [{
                        type: "area",
                        yValueFormatString: "Rp #,##0 k",
                        color: "#2fd88c",
                        dataPoints: data
                    }]
                }

                setTimeout(() => this.loading.summary_sales = false, 300)
            },
            error: (err: ERROR_API_RESPONSE) => {
                let errorMessage = 'Gagal memuat data laporan penjualan'
				if (err.error && err.error.message) errorMessage = err.error.message
				this.toastrService.error(errorMessage, 'Error')
                this.loading.summary_sales = false
            }
        })
    }

    private _loadStock(): void {
        this.loading.stock_reminder = true
        this.dataStock = []

        this._utilsService.getStockReminder()
        .subscribe({
            next: (res: SUCCESS_API_RESPONSE) => {
                this.dataStock = res.data
                setTimeout(() => this.loading.stock_reminder = false, 300)
            },
            error: (err: ERROR_API_RESPONSE) => {
                let errorMessage = 'Gagal memuat data laporan penjualan'
				if (err.error && err.error.message) errorMessage = err.error.message
				this.toastrService.error(errorMessage, 'Error')
                this.loading.stock_reminder = false
            }
        })
    }
}
