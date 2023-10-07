import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { Observable } from "rxjs"
import { tap } from 'rxjs/operators'
import { environment } from "../../../environments/environment"

@Injectable()

export class AuthenticationService {
	public appUrl: string
	public endPoint: string

	constructor(
		private _httpClient: HttpClient
	) {
		this.appUrl   = environment.appUrl
		this.endPoint = 'authentication'
	}

	/**
	 * Send login request
	 *
	 * @param request any
	 * @returns Observable<Object>
	 */
	login(request: any): Observable<Object> {
		return this._httpClient.post(
			`${this.appUrl}/${this.endPoint}/login`,
			request
		)
		.pipe(
            tap((user: any) => {
				const data = user.data
	            if (data && data.token) {
					localStorage.setItem('currentUser', JSON.stringify(data))
					localStorage.setItem('permissions', JSON.stringify(data.permissions))
				}

            	return data
            })
        )
	}

	/**
	 * Send logout request
	 *
	 * @returns Observable<Object>
	 */
	logout(): Observable<Object> {
		return this._httpClient.post(
			`${this.appUrl}/${this.endPoint}/logout`,
			{}
		)
		.pipe(
			tap(async (resp) => {
				localStorage.removeItem('currentUser')
				localStorage.removeItem('permissions')
				return resp
			})
		)
	}

	/**
	 * Get data of saved user
	 *
	 * @returns any
	 */
	getUser(): any {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '')
		if (currentUser && currentUser.user) return currentUser.user
        return null
    }

	/**
	 * Get data of saved token
	 *
	 * @returns any
	 */
	getToken(): any {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '')
		if (currentUser && currentUser.token) return currentUser.token
        return null
    }

	/**
	 * Get data of permissions by user
	 *
	 * @returns any
	 */
	getPermissions(): any {
        const permissions = JSON.parse(localStorage.getItem('permissions') || '')
        return permissions || null
    }

    /**
     * Checks whether the current user has a specific permission.
     *
     * @param permissionName - The name of the permission to check.
     * @returns `true` if the user has the permission, otherwise `false`.
     */
    hasPermission(permissionName: string): boolean {
        const permissions = JSON.parse(localStorage.getItem('permissions'))

        if (permissions && permissions.length > 0) {
            const permission = permissions.find((res: any) => {
                return res === permissionName
            })

            if (permission && typeof permission !== 'undefined') {
                return true
            }
        }

        return false
    }
}
