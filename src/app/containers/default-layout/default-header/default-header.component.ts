import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { HeaderComponent } from '@coreui/angular'
import { ToastrService } from 'ngx-toastr'
import { NgxIndexedDBService } from 'ngx-indexed-db'
import { AuthenticationService, AvatarService } from 'src/app/services'
import { ERROR_API_RESPONSE } from 'src/app/helpers'

@Component({
    selector: 'app-default-header',
    templateUrl: './default-header.component.html'
})

export class DefaultHeaderComponent extends HeaderComponent implements OnInit
{
    public avatar: string
    public user: any
    
    constructor(
        private _authenticationService: AuthenticationService,
        private _avatarService: AvatarService,
        private _dbService: NgxIndexedDBService,
        private _router: Router,
        private _toastrService: ToastrService
    ) {
        super()

        this.avatar = 'assets/images/logo.png'
        this.user = this._authenticationService.getUser()
    }


    /**
     * A callback method that is invoked immediately after the
     * default change detector has checked the directive's
     * data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     * It is invoked only once when the directive is instantiated.
     */
    ngOnInit(): void {        
        // this._avatarService.load().then((avatar) => this.avatar = avatar || 'assets/img/avatars/8.jpg')
    }
    
    /**
	 * Go to page of edit account
	 *
	 * @return void
	 */
	goToAccountDetail(): void {
		this._router.navigate(['/account/setting']);
	}

    /**
	 * Perform logout from the app
	 *
	 * @return void
	 */
	logout(): void {
		this._authenticationService.logout()
		.subscribe({
			next: async () => {
                await this._deleteDataIndexedDB('avatar')
                await this._deleteDataIndexedDB('data_user_live_setup')
                await this._deleteDataIndexedDB('background_image')
                await this._deleteDataIndexedDB('setup_details')

				window.location.reload()
			},
			error: (err: ERROR_API_RESPONSE) => {
				let errorMessage = 'Terdapat masalah saat melakukan aksi logout'
				if (err.error && err.error.message) errorMessage = err.error.message
				this._toastrService.error(errorMessage, 'Error')
			}
		})
	}

    /**
     * Delete data from indexedDB
     * 
     * @param storeName string
     * @returns Promise<boolean>
     */
    private _deleteDataIndexedDB(storeName: string): Promise<boolean> {
        return new Promise((resolve) => {
            this._dbService.clear(storeName)
            .subscribe({
                next: () => {
                    resolve(true)
                },
                error: () => {
                    resolve(false)
                }
            })
        })
    }
}
