import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import { CookieService } from "ngx-cookie-service";
import { AppComponent } from "src/app/app.component";
import { AssetDepreciationTableComponent } from "./asset-depreciation-table/asset-depreciation-table.component";

declare var $: any;

@Component({
  selector: "app-asset-depreciation",
  templateUrl: "./asset-depreciation.component.html",
  styleUrls: ["./asset-depreciation.component.scss"],
})
export class AssetDepreciationComponent implements OnInit {
  @ViewChild(AssetDepreciationTableComponent) depreciationTable: any;

  searchProject: any = "";
  searchFinYear: any = "";

  cmbProject: any = "";
  cmbFinYear: any = "";

  loadingBar = true;

  projectList: any = [];
  financialList: any = [];
  assetList: any = [];
  assetDetailList: any = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getProject();
    this.getFinYear();
  }

  getProject() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getprojects", { headers: reqHeader })
      .subscribe((data: any) => {
        this.projectList = data;

        this.loadingBar = false;
      });
  }

  getFinYear() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getFinYear", { headers: reqHeader })
      .subscribe((data: any) => {
        this.financialList = data;

        this.loadingBar = false;
      });
  }

  getReport() {
    if (this.cmbProject == "") {
      this.cmbProject = 0;
    }
    if (this.cmbFinYear == "") {
      this.toastr.errorToastr("Please Select Financial Year", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getDepreciationCharged?finYear=" +
          this.cmbFinYear +
          "&projectID=" +
          this.cmbProject,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.depreciationTable.tableData = data;

        this.loadingBar = false;
      });
  }

  assetWiseData(item: any) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getDepreciationChargedDetail?finYear=" +
          item.finYear +
          "&projectID=" +
          item.projectId +
          "&AccountsCatId=" +
          item.accountsCatId,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        console.log(data);
        this.assetDetailList = data;

        this.loadingBar = false;
        $("#assetModal").modal("show");
      });
  }

  reset() {
    this.cmbFinYear = "";
    this.cmbProject = "";
    this.depreciationTable.tableData = [];
  }
}
