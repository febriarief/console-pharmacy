import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { AuthenticationService } from 'src/app/services'
import { ToastrService } from 'ngx-toastr'
import { ERROR_API_RESPONSE } from 'src/app/helpers'

@Component({
  	templateUrl: 'login.component.html'
})

export class LoginComponent implements OnInit
{
    public slides: any
	public form: any
	public formValidation: any
	public submiting!: boolean
	public isSecuredPassword: boolean

	constructor(
		private _authenticationService: AuthenticationService,
		private _router: Router,
		private _toastrService: ToastrService
	) {
		this.isSecuredPassword = true
        this.slides = [
            { src: 'assets/images/login-illustrator.png', title: 'Temukan Pesona Anda', message: 'Memancarkan Kecantikan di Klinik Kami.' },
            { src: 'assets/images/login-illustrator-2.png', title: 'Dimana Keindahan Dipadu dengan Perawatan', message: 'Tingkatkan Perjalanan Estetika Anda.' },
            { src: 'assets/images/login-illustrator-3.png', title: 'Mengubah Kecantikan, Menumbuhkan Keyakinan', message: 'Surga Kecantikan Anda.' },
        ]
	}

	/**
     * A callback method that is invoked immediately after the
     * default change detector has checked the directive's
     * data-bound properties for the first time,
     * and before any of the view or content children have been checked.
     * It is invoked only once when the directive is instantiated.
	 *
	 * @return void
     */
	ngOnInit(): void {
		this.clearForm()
        this.clearFormValidation()
	}

	/**
	 * Reset value of object form before making a request
	 * to add resources.
	 *
	 * @return void
	 */
	clearForm(): void {
		this.form = {
            email: null,
			password: null
        }
	}

	/**
	 * Reset value of object form before making a request
	 * to add resources.
	 *
	 * @return void
	 */
	clearFormValidation(): void {
		this.formValidation = {
            email: { valid: true, message: null },
			password: { valid: true, message: null },
            login: { valid: true, message: null }
        }
	}

	/**
	 * Validate main form before submit data
	 *
	 * @returns boolean
	 */
	validate(): boolean {
        this.clearFormValidation()

        let valid = true
		if (!this.form.email) {
            this.formValidation.email.valid = false
            this.formValidation.email.message = 'Kolom isian email tidak boleh kosong'
            valid = false
		}

		if (!this.form.password) {
			this.formValidation.password.valid = false
            this.formValidation.password.message = 'Kolom isian kata sandi tidak boleh kosong'
            valid = false
		}

		return valid
	}

	/**
	 * Toggle secure password
	 *
	 * @return void
	 */
	toggelSecurePassword(): void {
		this.isSecuredPassword = !this.isSecuredPassword
	}

	/**
	 * Perform login to app
	 *
	 * @return void
	 */
	login(): void {
        if (!this.validate()) return

		this.submiting = true
        
		this._authenticationService.login(this.form)
		.subscribe({
            next: () => {
				this.submiting = false
				this._router.navigate(['/'])
			},
			error: (err: ERROR_API_RESPONSE) => {
                this.submiting = false
                        
                const respErr = Object.keys(err.error.errors)
                for (let i = 0; i < respErr.length; i++) {
                    this.formValidation[respErr[i]].message = err.error.errors[respErr[i]][0]
                }
			}
		})

	}
}
