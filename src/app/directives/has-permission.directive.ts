import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core'
import { AuthenticationService } from '../services'

@Directive({ 
    selector: '[hasPermission]' 
})

export class HasPermissionDirective implements OnInit
{
    @Input() set hasPermission(permission: string) {
        this.permission = permission
    }

    public permission: string

    constructor(
        private _authenticationService: AuthenticationService,
        private _templateRef: TemplateRef<any>,
        private _viewContainerRef: ViewContainerRef
    ) {

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
    ngOnInit() {
        if (this._authenticationService.hasPermission(this.permission)) {
            this._viewContainerRef.createEmbeddedView(this._templateRef)
        } else {
            this._viewContainerRef.clear()
        }
    }

}
