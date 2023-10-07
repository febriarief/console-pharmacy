import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { Observable } from 'rxjs'
import { BaseService } from '../base.service'

@Injectable()

export class UtilsService extends BaseService
{

    constructor(
        protected httpClient: HttpClient
    ) {
        super(httpClient)

        this.endPoint = 'utils'
    }

    /**
     * Retrieves a date from the API endpoint.
     * 
     * @returns An observable that emits the response data.
     */
    getDate(): Observable<Object> {
        return this.httpClient.get(`${this.appUrl}/${this.endPoint}/get-date`)
    }
    
    getStockReminder(): Observable<Object> {
        return this.httpClient.get(`${this.appUrl}/${this.endPoint}/stock-reminder`)
    }
}
