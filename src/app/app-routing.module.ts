import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { DefaultLayoutComponent } from './containers'
import { AuthGuard } from './services'

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },

    {
        path: '',
        component: DefaultLayoutComponent,
        canActivate: [ AuthGuard ],
        children: [
            {
                path: 'dashboard',
                loadChildren: () =>
                import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
            },
            {
                path: 'master-item',
                loadChildren: () =>
                import('./views/master-item/master-item.module').then((m) => m.MasterItemModule)
            },
            {
                path: 'purchase',
                loadChildren: () =>
                import('./views/purchase/purchase.module').then((m) => m.PurchaseModule)
            },
            {
                path: 'sales',
                loadChildren: () =>
                import('./views/sales/sales.module').then((m) => m.SalesModule)
            },
            {
                path: 'system',
                loadChildren: () =>
                import('./views/system/system.module').then((m) => m.SystemModule)
            }
        ],
    },
    
    { 
        path: 'authentications',
        loadChildren: () => import('./views/authentications/authentications.module').then((m) => m.AuthenticationsModule) 
    },

    { path: '**', redirectTo: '/dashboard' }
]

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            scrollPositionRestoration: 'top',
            anchorScrolling: 'enabled',
            initialNavigation: 'enabledBlocking'
        })
    ],

    exports: [
        RouterModule
    ]
})

export class AppRoutingModule { }
