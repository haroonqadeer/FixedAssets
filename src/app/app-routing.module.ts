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
import { BridgesComponent } from "./pages/fixasset/bridges/bridges.component";
import { NhabuldingsComponent } from "./pages/fixasset/nhabuldings/nhabuldings.component";
import { CreateBuildingComponent } from "./pages/fixasset/configuration/create-building/create-building.component";
import { HomePageComponent } from "./pages/home-page/home-page.component";
import { LocationCompleteComponent } from "./pages/fixasset/location-complete/location-complete.component";
import { AssetRegisterRptComponent } from "./pages/fixAsset/Reports/asset-register-rpt/asset-register-rpt.component";
import { LandReportComponent } from "./pages/fixAsset/Reports/land-report/land-report.component";
import { RegisterVehicleRptComponent } from "./pages/fixAsset/Reports/register-vehicle-rpt/register-vehicle-rpt.component";
import { RegisterComputerRptComponent } from "./pages/fixAsset/Reports/register-computer-rpt/register-computer-rpt.component";
import { RevaluationMoveAssetComponent } from "./pages/fixAsset/revaluation-move-asset/revaluation-move-asset.component";
import { AssetpurchaseComponent } from "./pages/fixAsset/assetpurchase/assetpurchase.component";
import { UpdationLogRptComponent } from "./pages/fixAsset/Reports/updation-log-rpt/updation-log-rpt.component";

const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "home",
    component: HomePageComponent,
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
    path: "locComp",
    component: LocationCompleteComponent,
  },
  // Configuration
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
    path: "createBuilding",
    component: CreateBuildingComponent,
  },
  // end Configuration
  {
    path: "freeholdLand",
    component: NHAFreeholdLandComponent,
  },
  {
    path: "nhaRoads",
    component: NHARoadsComponent,
  },
  {
    path: "nhaBridges",
    component: BridgesComponent,
  },
  {
    path: "nhaBuildings",
    component: NhabuldingsComponent,
  },

  // Fixed Asset Report
  {
    path: "assetRegisterRpt",
    component: AssetRegisterRptComponent,
  },
  {
    path: "landReport",
    component: LandReportComponent,
  },
  {
    path: "updationLogRpt",
    component: UpdationLogRptComponent,
  },
  //////////////////////
  {
    path: "registerVehicle",
    component: RegisterVehicleRptComponent,
  },
  {
    path: "registerComputer",
    component: RegisterComputerRptComponent,
  },
  {
    path: "revaluation",
    component: RevaluationMoveAssetComponent,
  },
  {
    path: "assetpurchase",
    component: AssetpurchaseComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
