import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "../base.service";

@Injectable()

export class PermissionService extends BaseService
{
	constructor(
		public httpClient: HttpClient
	) {
		super(httpClient);

		this.endPoint = 'system/permission';
	}

	/**
	 * Send http request with method GET to fetch list
	 * of parse permission.
	 *
	 * @returns Observable<Object>
	 */
	getParsed(): Observable<Object> {
		return this.httpClient.get(`${this.appUrl}/${this.endPoint}/parsed`);
	}
}
