import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SharedModule } from '../../shared/shared.module'
import { CashierComponent } from './cashier/cashier.component'
import { CashierService } from 'src/app/services'

const routes: Routes = [{
	path: '',
	data: { title: 'Penjualan' },
    children: [
        {
            path: 'cashier',
            data: { title: 'Kasir' },
            component: CashierComponent
        },
    ]
}]

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		SharedModule
	],

	exports: [
		RouterModule
	],

  	declarations: [
        CashierComponent
	],

	providers: [
        CashierService
	]
})

export class SalesModule { }
