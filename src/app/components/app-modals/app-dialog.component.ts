import { Component, Input, HostListener } from '@angular/core'
import { BsModalRef } from 'ngx-bootstrap/modal'
import { Subject } from 'rxjs'

@Component({
  	templateUrl: './app-dialog.component.html',
})
export class AppDialogComponent {
    @Input() message!: string
    @Input() title!: string

    result: Subject<boolean> = new Subject<boolean>()

    constructor(public modalRef: BsModalRef) { }

    confirm() {
        this.result.next(true)
        this.modalRef.hide()
    }

    decline() {
        this.result.next(false)
        this.modalRef.hide()
    }

    @HostListener('document:keydown', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        this.decline()
    }
}
