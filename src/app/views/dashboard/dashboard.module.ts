import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SharedModule } from '../../shared/shared.module'
import { DashboardComponent } from './dashboard.component'
import { DashboardService, SummarySalesService } from 'src/app/services'

const routes: Routes = [{
	path: '',
	data: { title: 'Dashboard' },
    component: DashboardComponent
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
        DashboardComponent
	],

	providers: [
        DashboardService,
        SummarySalesService
	]
})

export class DashboardModule { }
