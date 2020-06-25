import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./pages/user/login/login.component";
import { AssetEntryComponent } from "./pages/fixAsset/asset-entry/asset-entry.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "assetEntry",
    component: AssetEntryComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
