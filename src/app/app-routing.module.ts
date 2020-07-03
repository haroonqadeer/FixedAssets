import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./pages/user/login/login.component";
import { AssetEntryComponent } from "./pages/fixAsset/asset-entry/asset-entry.component";
import { DashboardyComponent } from "./pages/fixAsset/dashboardy/dashboardy.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "assetEntry",
    component: AssetEntryComponent,
  },
  {
    path: "dashboard",
    component: DashboardyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
