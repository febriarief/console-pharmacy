import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SharedModule } from '../../shared/shared.module'
import { UnitComponent } from './unit/unit.component'
import { ItemComponent } from './item/item.component'
import { StockComponent } from './stock/stock.component'
import { StockCardComponent } from './stock-card/stock-card.component'
import { StockCardService, StockService } from 'src/app/services'

const routes: Routes = [{
	path: '',
	data: { title: 'Master Barang' },
    children: [
        {
            path: 'unit',
            data: { title: 'Satuan' },
            component: UnitComponent
        },
        {
            path: 'item',
            data: { title: 'Barang' },
            component: ItemComponent
        },
        {
            path: 'stock',
            data: { title: 'Stok' },
            component: StockComponent
        },
        {
            path: 'stock-card',
            data: { title: 'Kartu Stok' },
            component: StockCardComponent
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
        ItemComponent,
        StockComponent,
        StockCardComponent,
        UnitComponent
	],

	providers: [
        StockService,
        StockCardService,
	]
})

export class MasterItemModule { }
