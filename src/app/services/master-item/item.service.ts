import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BaseService } from "../base.service";

@Injectable()

export class ItemService extends BaseService
{
	constructor(
		public httpClient: HttpClient
	) {
		super(httpClient);

		this.endPoint = 'master-item/item';
	}
}
