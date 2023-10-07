import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "../base.service";

@Injectable()

export class CashierService extends BaseService
{
	constructor(
		public httpClient: HttpClient
	) {
		super(httpClient);

		this.endPoint = 'sales/cashier';
	}
}
