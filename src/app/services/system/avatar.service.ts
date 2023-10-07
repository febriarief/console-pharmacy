import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { NgxIndexedDBService } from 'ngx-indexed-db'
import { fromEvent, map, Observable } from 'rxjs'
import { AuthenticationService } from '../authentication/authentication.service'

@Injectable()

export class AvatarService
{
    private _user: any
    
    constructor(
        private _authenticationService: AuthenticationService,
        private _dbService: NgxIndexedDBService,
        private _httpClient: HttpClient
    ) {
        this._user = this._authenticationService.getUser()
    }

    load(): Promise<string> {
        return new Promise(async (resolve) => {
            if (!this._user.avatar) {
                await this._deleteDataIndexedDB('avatar')
                resolve(null)
                return
            }

            const setupAvatar = await this._getDataIndexedDB('avatar', 1)
            if (!setupAvatar) {
                const blob_avatar = await this._downloadFile(this._user.avatar)
                console.log('blob_avatar', blob_avatar)
                if (blob_avatar) {
                    const base64_avatar = await this._blobToBase64(blob_avatar)
                    console.log('base64_avatar', base64_avatar)
                    this._storeDataIndexedDB('avatar', { id: 1, src: base64_avatar, updated_at: this._user.updated_at })
                    resolve(base64_avatar)
                    return
                }
            } else if (setupAvatar.updated_at !== this._user.updated_at) {
                await this._deleteDataIndexedDB('avatar')
                const blob_avatar = await this._downloadFile(this._user.avatar)
                if (blob_avatar) {
                    const base64_avatar = await this._blobToBase64(blob_avatar)
                    console.log('base64_avatar', base64_avatar)
                    this._storeDataIndexedDB('avatar', { id: 1, src: base64_avatar, updated_at: this._user.updated_at })
                    resolve(base64_avatar)
                    return
                }
            } else {
                resolve(setupAvatar.src)
                return
            }
        })
    }

    /**
     * Get data from indexedDB
     * 
     * @param storeName string
     * @param key IDBValidKey
     * @returns Promise<any>
     */
     private _getDataIndexedDB(storeName: string, key: IDBValidKey): Promise<any> {
        return new Promise((resolve) => {
            this._dbService.getByKey(storeName, key)
            .subscribe({
                next: (res) => {
                    resolve(res)
                },
                error: () => {
                    resolve(null)
                }
            })
        })
    }

    /**
     * Store data from indexedDB
     * 
     * @param storeName string
     * @param value any
     * @returns Promise<any>
     */
     private _storeDataIndexedDB(storeName: string, value: any): Promise<any> {
        return new Promise((resolve) => {
            this._dbService.add(storeName, value)
            .subscribe({
                next: (res) => {
                    resolve(res)
                },
                error: (err) => {
                    resolve(null)
                }
            })
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

    /**
     * Download file from cloud
     * 
     * @param src string
     * @returns Promise<any>
     */
    private _downloadFile(src: string): Promise<any> {
        return new Promise((resolve) => {
            this._httpClient.get(src, { responseType: 'blob' })
            .subscribe({
                next: (res: any) => {
                    resolve(res)
                },
                error: (err: any) => {
                    let errorMessage = 'Failed to download file. Please close/refresh the browser'
                    if (err.error && err.error.message) errorMessage = err.error.message
                    alert(errorMessage)
                    resolve(null)
                }
            })
        })
    }

    /**
     * Convert Blob to Base64 string
     * 
     * @param blob Blob 
     * @returns Promise<string>
     */
    private _blobToBase64(blob: Blob): Promise<string> {
        return new Promise((resolve) => {
            this._toBase64(blob).subscribe((res) => resolve(res))
        })
    }

    private _toBase64(blob: Blob): Observable<string> {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        return fromEvent(reader, 'load').pipe(map(() => (reader.result as string)))
    }
}