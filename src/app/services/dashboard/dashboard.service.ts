import { HttpClient } from "@angular/common/http"
import { Injectable } from "@angular/core"
import { BaseService } from "../base.service"

@Injectable()

export class DashboardService extends BaseService
{
	constructor(
		public httpClient: HttpClient
	) {
		super(httpClient)

		this.endPoint = 'dashboard'
	}
}
