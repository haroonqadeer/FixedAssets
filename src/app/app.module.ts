import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./shared/material.module";
import { PNPrimeModule } from "./shared/pnprime/pnprime.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ChartModule } from "angular-highcharts";
import { UserIdleModule } from "angular-user-idle";
import { ZXingScannerModule } from "@zxing/ngx-scanner";
import { QRCodeModule } from "angular2-qrcode";
import {
  CurrencyMaskConfig,
  CurrencyMaskModule,
  CURRENCY_MASK_CONFIG,
} from "ng2-currency-mask";

export const CustomCurrencyMaskConfig: CurrencyMaskConfig = {
  align: "right",
  allowNegative: true,
  decimal: ".",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ",",
};

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { ToastrModule } from "ng6-toastr-notifications";
import { OrderModule } from "ngx-order-pipe";
import { NgxPaginationModule } from "ngx-pagination";
import { InputTextModule } from "primeng/inputtext";
import { SearchPipe } from "./shared/pipe-filters/pipe-search";
import { CookieService } from "ngx-cookie-service";
import { LoginComponent } from "./pages/user/login/login.component";
import { AssetEntryComponent } from "./pages/fixAsset/asset-entry/asset-entry.component";
import { DashboardyComponent } from "./pages/fixAsset/dashboardy/dashboardy.component";
import { NHALocComponent } from "./pages/fixasset/configuration/nhaloc/nhaloc.component";
import { NHASectionComponent } from "./pages/fixasset/configuration/nhasection/nhasection.component";
import { NHAOfficeTypeComponent } from "./pages/fixasset/configuration/nhaoffice-type/nhaoffice-type.component";
import { AssetCategoryComponent } from "./pages/fixasset/configuration/asset-category/asset-category.component";
import { NHAPostsComponent } from "./pages/fixasset/configuration/nhaposts/nhaposts.component";
import { NHAProjectsComponent } from "./pages/fixasset/configuration/nhaprojects/nhaprojects.component";
import { NHAProjectIPCComponent } from "./pages/fixasset/configuration/nhaproject-ipc/nhaproject-ipc.component";

@NgModule({
  declarations: [
    AppComponent,
    SearchPipe,
    LoginComponent,
    AssetEntryComponent,
    DashboardyComponent,
    NHALocComponent,
    NHASectionComponent,
    NHAOfficeTypeComponent,
    AssetCategoryComponent,
    NHAPostsComponent,
    NHAProjectsComponent,
    NHAProjectIPCComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    BrowserAnimationsModule,
    FormsModule,
    ChartModule,
    ReactiveFormsModule,
    PNPrimeModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    OrderModule,
    NgxPaginationModule,
    InputTextModule,
    CurrencyMaskModule,
    ZXingScannerModule,
    QRCodeModule,
    // Optionally you can set time for `idle`, `timeout` and `ping` in seconds.
    // Default values: `idle` is 60 (1 minutes), `timeout` is 30 (0.5 minutes)
    // and `ping` is 15 0.25 minutes).
    UserIdleModule.forRoot({ idle: 300, timeout: 300, ping: 15 }),
  ],
  providers: [
    CookieService,
    { provide: CURRENCY_MASK_CONFIG, useValue: CustomCurrencyMaskConfig },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
