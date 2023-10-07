import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SharedModule } from '../../shared/shared.module'
import { PermissionComponent } from './permission/permission.component'
import { RoleComponent } from './role/role.component'
import { UserComponent } from './user/user.component'
import { PermissionService, RoleService, UserService } from '../../services'

const routes: Routes = [{
	path: '',
	data: { title: 'Sistem' },
	children: [
		{
			path: 'permission',
			component: PermissionComponent,
			data: { title: 'Hak Akses' }
		},
		{
            path: 'role',
			component: RoleComponent,
			data: { title: 'Role' }
		},
        {
            path: 'user',
            component: UserComponent,
            data: { title: 'Pengguna' }
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
		PermissionComponent,
        RoleComponent,
        UserComponent
	],

	providers: [
		PermissionService,
        RoleService,
        UserService
	]
})

export class SystemModule { }
