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

  loadingBar = true;
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
        this.loadingBar = false;
      });
  }

  save() {
    if (this.cmbOfcType == 0) {
      this.toastr.errorToastr("Please Select Office Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbWing == "") {
      this.toastr.errorToastr("Please Select Wing", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtSecShrtName == "") {
      this.toastr.errorToastr("Please Enter Section Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtSecFullName == "") {
      this.toastr.errorToastr("Please Enter Section Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.secID == "") {
        saveData = {
          OfficeCode: this.txtSecShrtName,
          OfficeDescription: this.txtSecFullName,
          OfficeSecID: 0,
          OfficeTypeID: this.cmbOfcType,
          WingID: this.cmbWing,
          UserId: this.cookie.get("userID"),
          SPType: "INSERT",
        };
      } else {
        saveData = {
          OfficeCode: this.txtSecShrtName,
          OfficeDescription: this.txtSecFullName,
          OfficeSecID: this.secID,
          OfficeTypeID: this.cmbOfcType,
          WingID: this.cmbWing,
          UserId: this.cookie.get("userID"),
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "ofcsection", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            if (this.secID == "") {
              this.toastr.successToastr(
                "Record Saved Successfully!",
                "Success!",
                {
                  toastTimeout: 2500,
                }
              );
            } else {
              this.toastr.successToastr(
                "Record Updated Successfully!",
                "Success!",
                {
                  toastTimeout: 2500,
                }
              );
            }
            this.clear();
            this.getSection();
            this.loadingBar = false;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.loadingBar = false;
            return false;
          }
        });
    }
  }

  edit(obj) {
    this.heading = "Edit";

    this.secID = obj.officeSecID;
    this.txtSecShrtName = obj.officeCode;
    this.txtSecFullName = obj.officeDescription;
    this.cmbWing = obj.wingID;
    this.cmbOfcType = parseInt(obj.officeTypeID);
  }

  delete(obj) {
    this.loadingBar = true;
    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: "DELETE", //string
      OfficeSecID: obj.officeSecID, //int
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "ofcsection", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "SUCCESS") {
          this.toastr.successToastr(
            "Record Deleted Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.clear();
          this.getSection();
          this.loadingBar = false;
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          this.loadingBar = false;
          return false;
        }
      });
  }

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
