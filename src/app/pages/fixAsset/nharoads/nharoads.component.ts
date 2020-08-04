import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserIdleService } from "angular-user-idle";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AppComponent } from "../../../app.component";

declare var $: any;

@Component({
  selector: "app-nharoads",
  templateUrl: "./nharoads.component.html",
  styleUrls: ["./nharoads.component.scss"],
})
export class NHARoadsComponent implements OnInit {
  toggleView = "form";

  serverUrl = "http://95.217.206.195:2007/api/";

  loadingBar = true;

  ddlAccSec = "";
  ddlTrailBalance = "";
  ddlProject = "";

  txtSearchAccSec = "";
  txtSearchTrailBalance = "";
  txtSearchProject = "";

  accSecList = [];
  projectsList = [];

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getAccSec();
    this.getProjects();
  }

  getAccSec() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getaccsec", { headers: reqHeader })
      .subscribe((data: any) => {
        this.accSecList = data;
        this.loadingBar = false;
      });
  }

  getProjects() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getprojects?IsActivated=1", { headers: reqHeader })
      .subscribe((data: any) => {
        this.projectsList = data;
        // this.projectsList2 = data;
        this.loadingBar = false;
      });
  }

  filterProject(reqProjectID, filterBy) {
    if (filterBy == "") {
      this.ddlProject = "";
      var tempList = this.projectsList.filter(
        (x) => x.projectID == reqProjectID && x.accountCode > 0
      );
      if (tempList.length > 0) {
        this.ddlProject = this.ddlTrailBalance;
      }
    } else {
      this.ddlTrailBalance = this.ddlProject;
    }
  }
}
