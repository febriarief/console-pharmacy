import { CommonModule, DecimalPipe } from "@angular/common"
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http"
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from "@angular/core"
import { FormsModule } from "@angular/forms"
import { CarouselModule, DropdownModule, ProgressModule, TooltipModule } from "@coreui/angular"
import { NgxPaginationModule } from "ngx-pagination"
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader'
import { ModalModule } from "ngx-bootstrap/modal"
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker'
import { NgSelectModule } from "@ng-select/ng-select"
import { ImageCropperModule } from "ngx-image-cropper"
import { CanvasJSAngularChartsModule } from "@canvasjs/angular-charts"
import { AngularFileUploaderModule } from "angular-file-uploader"
import { QRCodeModule } from 'angularx-qrcode'
import { NgxCurrencyModule } from "ngx-currency";
import { AppDialogComponent, AppImageCropperComponent } from '../components'
import { HasPermissionDirective, NumberPipeDirective, RupiahPipeDirective } from '../directives'
import { AuthenticationService, AvatarService, ExtendedHttpInterceptor, ItemService, ModalService, PurchaseOrderService, PurchaseRequestService, SupplierService, UnitService, UtilsService } from "../services"

@NgModule({
	imports: [
        AngularFileUploaderModule,
        BsDatepickerModule.forRoot(),
        CanvasJSAngularChartsModule,
        CarouselModule,
		CommonModule,
        DropdownModule,
		FormsModule,
		HttpClientModule,
        ImageCropperModule,
        ModalModule.forRoot(),
        NgSelectModule,
        NgxCurrencyModule,
        NgxPaginationModule,
        NgxSkeletonLoaderModule,
        QRCodeModule,
        ProgressModule,
        TooltipModule
	],

	exports: [
        AngularFileUploaderModule,
        AppDialogComponent,
        AppImageCropperComponent,
        BsDatepickerModule,
        CanvasJSAngularChartsModule,
        CarouselModule,
        CommonModule,
        DropdownModule,
		FormsModule,
        HasPermissionDirective,
		HttpClientModule,
        ImageCropperModule,
        ModalModule,
        NgSelectModule,
        NgxCurrencyModule,
        NgxPaginationModule,
        NgxSkeletonLoaderModule,
        NumberPipeDirective,
        QRCodeModule,
        ProgressModule,
        TooltipModule,
        RupiahPipeDirective
	],

	declarations: [
        AppDialogComponent,
        AppImageCropperComponent,
        NumberPipeDirective,
        HasPermissionDirective,
        RupiahPipeDirective
    ],

	providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ExtendedHttpInterceptor,
            multi: true
        },
        AuthenticationService,
        AvatarService,
        DecimalPipe,
        ItemService,
        ModalService,
        PurchaseOrderService,
        PurchaseRequestService,
        SupplierService,
        UnitService,
        UtilsService,
    ],

	schemas: [
		CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
	]
})

export class SharedModule { }
