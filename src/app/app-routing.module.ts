import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// user module pages
import { LoginComponent } from "./pages/user/login/login.component";
import { UserRegisterationComponent } from "./pages/user/adminPanel/user-registeration/user-registeration.component";

// fix asset pages
import { AssetEntryComponent } from "./pages/fixAsset/asset-entry/asset-entry.component";
import { DashboardyComponent } from "./pages/fixAsset/dashboardy/dashboardy.component";
import { NHALocComponent } from "./pages/fixasset/configuration/nhaloc/nhaloc.component";
import { NHASectionComponent } from "./pages/fixasset/configuration/nhasection/nhasection.component";
import { NHAOfficeTypeComponent } from "./pages/fixasset/configuration/nhaoffice-type/nhaoffice-type.component";
import { AssetCategoryComponent } from "./pages/fixasset/configuration/asset-category/asset-category.component";
import { NHAPostsComponent } from "./pages/fixasset/configuration/nhaposts/nhaposts.component";
import { NHAProjectsComponent } from "./pages/fixasset/configuration/nhaprojects/nhaprojects.component";
import { NHAProjectIPCComponent } from "./pages/fixasset/configuration/nhaproject-ipc/nhaproject-ipc.component";
import { NHAFreeholdLandComponent } from "./pages/fixAsset/nhafreehold-land/nhafreehold-land.component";
import { NHARoadsComponent } from "./pages/fixasset/nharoads/nharoads.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "userRegisteration",
    component: UserRegisterationComponent,
  },

  // fix asset pages
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
  {
    path: "nhaProjectIPC",
    component: NHAProjectIPCComponent,
  },
  {
    path: "freeholdLand",
    component: NHAFreeholdLandComponent,
  },
  {
    path: "nhaRoads",
    component: NHARoadsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
