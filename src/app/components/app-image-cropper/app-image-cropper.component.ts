import { Component, EventEmitter, Output, TemplateRef } from '@angular/core'
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal'
import { ImageCroppedEvent } from 'ngx-image-cropper'

@Component({
    selector: 'app-image-cropper',
    templateUrl: './app-image-cropper.component.html'
})

export class AppImageCropperComponent
{
    modalRef!: BsModalRef

    @Output() onValueChange = new EventEmitter()

    public imageChangedEvent: any
    public croppedImage: any

    constructor(
        private _bsModalService: BsModalService
    ) {

    }

    /**
     * Open modal
	 *
     * @return void
     */
    openModal(template: TemplateRef<any>): void {
        this.modalRef = this._bsModalService.show(template, { class: 'modal-lg borer-0' })
    }

    /**
     * Close modal
	 *
     * @return void
     */
    closeModal(): void {
        this.deletePhoto()

        if (this.modalRef) this.modalRef.hide()
    }

    /**
     * Handle on file change event callback
	 *
     * @param event any
     * @return void
     */
    fileChangeEvent(event: any): void {
        this.imageChangedEvent = event
    }

    /**
     * Handle on image cropped callback
	 *
     * @param event ImageCroppedEvent
     * @return void
     */
    imageCropped(event: ImageCroppedEvent): void {
        this.croppedImage = event.base64
    }

    /**
     * Delete cropped and selected image
	 *
     * @return void
     */
    deletePhoto() {
        this.croppedImage = null
        this.imageChangedEvent = null
    }

    /**
     * Save cropped image
	 *
     * @return void
     */
    save() {
        if (this.croppedImage) this.onValueChange.emit(this.croppedImage)
        this.closeModal()
    }
}
