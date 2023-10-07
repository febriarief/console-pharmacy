import { Component, OnInit } from '@angular/core'
import { Router, NavigationEnd } from '@angular/router'
import { Title } from '@angular/platform-browser'
import { IconSetService } from '@coreui/icons-angular'
import { iconSubset } from './helpers'

@Component({
    selector: 'body',
    template: '<router-outlet></router-outlet>'
})

export class AppComponent implements OnInit 
{
    public title: string

    constructor(
        private _iconSetService: IconSetService,
        private _router: Router,
        private _titleService: Title

    ) {
        this.title = 'App Pharmacy - Console'
        _titleService.setTitle(this.title)
        _iconSetService.icons = { ...iconSubset }
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
        this._router.events.subscribe((evt) => {
            if (!(evt instanceof NavigationEnd)) {
                return
            }
        })
    }
}
