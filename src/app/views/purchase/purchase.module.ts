import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SharedModule } from '../../shared/shared.module'
import { SupplierComponent } from './supplier/supplier.component'
import { PurchaseRequestComponent } from './purchase-request/purchase-request.component'
import { PurchaseOrderComponent } from './purchase-order/purchase-order.component'
import { GoodsReceivedComponent } from './goods-received/goods-received.component'
import { GoodReceivedService } from 'src/app/services'

const routes: Routes = [{
	path: '',
	data: { title: 'Pembelian' },
    children: [
        {
            path: 'supplier',
            data: { title: 'Supplier' },
            component: SupplierComponent
        },
        {
            path: 'purchase-request',
            data: { title: 'Permintaan Pembelian' },
            component: PurchaseRequestComponent
        },
        {
            path: 'purchase-order',
            data: { title: 'Order Pembelian' },
            component: PurchaseOrderComponent
        },
        {
            path: 'goods-received',
            data: { title: 'Penerimaan Barang' },
            component: GoodsReceivedComponent
        }
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
        GoodsReceivedComponent,
        PurchaseRequestComponent,
        PurchaseOrderComponent,
        SupplierComponent
	],

	providers: [
        GoodReceivedService
	]
})

export class PurchaseModule { }
