import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

declare var $: any;

@Component({
  selector: "app-nhaoffice-type",
  templateUrl: "./nhaoffice-type.component.html",
  styleUrls: ["./nhaoffice-type.component.scss"],
})
export class NHAOfficeTypeComponent implements OnInit {
  serverUrl = "http://95.217.147.105:2007/api/";

  heading = "Add";

  ofcTypeID = "";
  txtOfcShrtName = "";
  txtOfcFullName = "";
  tblSearch = "";

  ofcTypeList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.heading = "Add";
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

  save() {
    if (this.txtOfcShrtName == "") {
      this.toastr.errorToastr("Please Enter Office Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtOfcFullName == "") {
      this.toastr.errorToastr("Please Enter Office Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.ofcTypeID == "") {
        var saveData = {};
      } else {
        var saveData = {};
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "saveofficetype", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.ofcTypeID == "") {
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
            this.getOfficeType();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            return false;
          }
        });
    }
  }

  edit(obj) {
    this.heading = "Edit";

    this.ofcTypeID = obj.officeTypeID;
    this.txtOfcShrtName = obj.officeTypeCode;
    this.txtOfcFullName = obj.officeTypeDescription;
  }

  delete(obj) {
    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: "Delete", //string
      AssetID: obj.officeTypeID, //int
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "saveofficetype", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          this.toastr.successToastr(
            "Record Deleted Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.clear();
          this.getOfficeType();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          return false;
        }
      });
  }

  clear() {
    this.heading = "Add";

    this.ofcTypeID = "";
    this.txtOfcShrtName = "";
    this.txtOfcFullName = "";
    this.tblSearch = "";
  }
}
