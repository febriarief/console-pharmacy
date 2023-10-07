import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "../base.service";

@Injectable()

export class GoodReceivedService extends BaseService
{
	constructor(
		public httpClient: HttpClient
	) {
		super(httpClient);

		this.endPoint = 'purchase/good-received';
	}

    /**
     * Downloads a PDF file from a specific URL based on the provided ID.
     * 
     * @param id The identifier of the PDF file to be downloaded.
     * @returns An Observable that emits the HTTP response containing the downloaded PDF file.
     */
    downloadPDF(id: string): Observable<Object> {
        return this.httpClient.get(`${this.appUrl}/${this.endPoint}/download-pdf/${id}`)
    }
}
