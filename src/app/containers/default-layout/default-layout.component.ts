import { Component, OnInit } from '@angular/core'
import { navItems } from './_nav'
import { AuthenticationService } from 'src/app/services'

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})

export class DefaultLayoutComponent implements OnInit
{
    public navItems: any
    public unfoldableSidebar: boolean
    
    public perfectScrollbarConfig = {
        suppressScrollX: true
    }

    constructor(
        private _authenticationService: AuthenticationService
    ) {
        this.navItems = []
        this.applyNavItems()
        this.unfoldableSidebar = false
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
        const unfoldableSidebar = localStorage.getItem('unfoldableSidebar')
        if (typeof unfoldableSidebar === 'undefined') {
            this.unfoldableSidebar = false
        } else  {
            this.unfoldableSidebar = JSON.parse(unfoldableSidebar)
        }
    }

    /**
     * Apply for nav items menu
     *
     * @return void
     */
	applyNavItems(): void {
        this.navItems = this.getValidMenu(navItems)
    }

    /**
     * Get valid menu
     *
     * @param item any
     * @returns any[]
     */
    getValidMenu(item: any): any[] {
        const permissions = this._authenticationService.getPermissions()

        let menus: any[] = []

        for (let i = 0; i <= item.length; i++) {
            const row = item[i]
            
            const permission = row?.attributes?.permission || null
            if (permission === null) {
                let childMenu: any = []

                if (row?.children || false) {
                    childMenu = this.getValidMenu(row.children)
                    row.children = childMenu
                }

                if (typeof row !== 'undefined') menus.push(row)
                
            } else if (permissions.includes(permission)) {
                let childMenu: any = []

                if (row?.children || false) {
                    childMenu = this.getValidMenu(row.children)
                    row.children = childMenu
                }
                
                if (typeof row !== 'undefined') menus.push(row)
            }
        }

        return menus
    }

    onSidebarTogglerClick() {
        this.unfoldableSidebar = !this.unfoldableSidebar
        localStorage.setItem('unfoldableSidebar', JSON.stringify(this.unfoldableSidebar))
    }
}
