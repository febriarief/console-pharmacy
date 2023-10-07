import { Injectable } from '@angular/core'
import { BsModalService } from 'ngx-bootstrap/modal'
import { AppDialogComponent } from '../../components'

@Injectable()

export class ModalService {

    constructor(
		private _bsModalService: BsModalService
	) {}

    confirm(message: string, title: string): Promise<boolean> {
        const modal = this._bsModalService.show(
            AppDialogComponent,
            {
                initialState: { title, message },
                class: 'modal-holder'
            }
        )

        return new Promise<boolean>((resolve, reject) => modal.content.result.subscribe((result: any) => resolve(result)))
    }
}
