import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./pages/user/login/login.component";
import { AssetEntryComponent } from "./pages/fixAsset/asset-entry/asset-entry.component";
import { DashboardyComponent } from "./pages/fixAsset/dashboardy/dashboardy.component";
import { NHALocComponent } from "./pages/fixasset/configuration/nhaloc/nhaloc.component";
import { NHASectionComponent } from "./pages/fixasset/configuration/nhasection/nhasection.component";
import { NHAOfficeTypeComponent } from "./pages/fixasset/configuration/nhaoffice-type/nhaoffice-type.component";
import { AssetCategoryComponent } from "./pages/fixasset/configuration/asset-category/asset-category.component";
import { NHAPostsComponent } from "./pages/fixasset/configuration/nhaposts/nhaposts.component";
import { NHAProjectsComponent } from "./pages/fixasset/configuration/nhaprojects/nhaprojects.component";

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
  {
    path: "nhaLoc",
    component: NHALocComponent,
  },
  {
    path: "nhaSec",
    component: NHASectionComponent,
  },
  {
    path: "nhaOfficeType",
    component: NHAOfficeTypeComponent,
  },
  {
    path: "assetCat",
    component: AssetCategoryComponent,
  },
  {
    path: "nhaPost",
    component: NHAPostsComponent,
  },
  {
    path: "nhaProject",
    component: NHAProjectsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
