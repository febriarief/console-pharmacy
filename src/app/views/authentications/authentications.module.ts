import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SharedModule } from '../../shared/shared.module'
import { LoginComponent } from './login/login.component'

const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent }
]

@NgModule({
	imports: [
		RouterModule.forChild(routes),
		SharedModule
	],

	exports: [
		RouterModule
	],

  	declarations: [
		LoginComponent
	],

	providers: [
        
	]
})

export class AuthenticationsModule { }
