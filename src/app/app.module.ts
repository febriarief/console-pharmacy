import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core'
import { HashLocationStrategy, LocationStrategy, PathLocationStrategy } from '@angular/common'
import { BrowserModule, Title } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { ReactiveFormsModule } from '@angular/forms'
import { PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule } from 'ngx-perfect-scrollbar'
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { DefaultFooterComponent, DefaultHeaderComponent, DefaultLayoutComponent, } from './containers'
import { 
    AvatarModule, BadgeModule, BreadcrumbModule, ButtonGroupModule, ButtonModule, CarouselModule, CardModule, DropdownModule,
    FooterModule, FormModule, GridModule, HeaderModule, ListGroupModule, NavModule, ProgressModule, SharedModule,
    SidebarModule, TabsModule, UtilitiesModule
} from '@coreui/angular'
import { IconModule, IconSetService } from '@coreui/icons-angular'
import { LottieModule } from 'ngx-lottie'
import player from 'lottie-web'
import { ToastrModule } from 'ngx-toastr'
import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db'
import { QRCodeModule } from 'angularx-qrcode'
import { SharedModule as MySharedModule } from './shared/shared.module'
import { AuthGuard } from './services'

export function playerFactory() {
    return player
}

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    suppressScrollX: true,
}

const dbConfig: DBConfig  = {
    name: 'SistemInventoriDB',
    version: 1,
    objectStoresMeta: [
        {
            store: 'avatar',
            storeConfig: { keyPath: 'id', autoIncrement: false },
            storeSchema: []
        }
    ]
}

const APP_CONTAINERS = [
    DefaultFooterComponent,
    DefaultHeaderComponent,
    DefaultLayoutComponent,
]


@NgModule({
    imports: [
        AppRoutingModule,
        AvatarModule,
        BadgeModule,
        BreadcrumbModule,
        BrowserAnimationsModule,
        BrowserModule,
        ButtonGroupModule,
        ButtonModule,
        // CanvasJSAngularChartsModule,
        CardModule,
        CarouselModule,
        DropdownModule,
        FooterModule,
        FormModule,
        GridModule,
        HeaderModule,
        IconModule,
        ListGroupModule,
        LottieModule.forRoot({ player: playerFactory }),
        MySharedModule,
        NavModule,
        NgxIndexedDBModule.forRoot(dbConfig),
        PerfectScrollbarModule,
        ProgressModule,
        QRCodeModule,
        ReactiveFormsModule,
        SharedModule,
        SidebarModule,
        TabsModule,
        ToastrModule.forRoot(),
        UtilitiesModule
    ],
    
    declarations: [
        ...APP_CONTAINERS,
        AppComponent
    ],
    
    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG },
        AuthGuard,
        IconSetService,
        Title
    ],

    bootstrap: [
        AppComponent
    ],
    
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA
    ]
})

export class AppModule { }
