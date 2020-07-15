import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-nhasection",
  templateUrl: "./nhasection.component.html",
  styleUrls: ["./nhasection.component.scss"],
})
export class NHASectionComponent implements OnInit {
  serverUrl = "http://95.217.147.105:2007/api/";

  heading = "Add";

  secID = "";
  txtSecShrtName = "";
  txtSecFullName = "";
  cmbWing = "";
  cmbOfcType = 0;

  searchOfcType = "";
  searchWing = "";
  tblSearch = "";

  wngSectionList = [];
  ofcTypeList = [];
  wingList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getSection();
    this.getWing();
    this.getOfficeType();
  }

  getOfficeType() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getofctype", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ofcTypeList = data;
      });
  }

  getWing() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getwingsec", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.wingList = data;
      });
  }

  getSection() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getwingsec", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.wngSectionList = data;
      });
  }

  save() {}

  edit(obj) {
    this.heading = "Edit";

    this.secID = obj.officeSecID;
    this.txtSecShrtName = obj.officeCode;
    this.txtSecFullName = obj.officeDescription;
    this.cmbWing = obj.wingID;
    this.cmbOfcType = parseInt(obj.officeTypeID);
  }

  delete(obj) {}

  clear() {
    this.heading = "Add";

    this.secID = "";
    this.txtSecShrtName = "";
    this.txtSecFullName = "";
    this.cmbWing = "";
    this.cmbOfcType = 0;

    this.searchOfcType = "";
    this.searchWing = "";
    this.tblSearch = "";
  }
}
