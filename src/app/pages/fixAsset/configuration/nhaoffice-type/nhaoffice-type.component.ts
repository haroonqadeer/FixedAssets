import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2/dist/sweetalert2.js";

declare var $: any;

@Component({
  selector: "app-nhaoffice-type",
  templateUrl: "./nhaoffice-type.component.html",
  styleUrls: ["./nhaoffice-type.component.scss"],
})
export class NHAOfficeTypeComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";

  heading = "Add";

  loadingBar = true;
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
        this.loadingBar = false;
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
      this.loadingBar = true;
      var saveData;
      if (this.ofcTypeID == "") {
        saveData = {
          OfficeTypeCode: this.txtOfcShrtName,
          OfficeType: this.txtOfcFullName,
          OfficeTypeID: 0,
          SPType: "INSERT",
        };
      } else {
        saveData = {
          OfficeTypeCode: this.txtOfcShrtName,
          OfficeType: this.txtOfcFullName,
          OfficeTypeID: this.ofcTypeID,
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "ofctype", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            this.clear();
            this.getOfficeType();
            this.loadingBar = false;
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

    this.ofcTypeID = obj.officeTypeID;
    this.txtOfcShrtName = obj.officeTypeCode;
    this.txtOfcFullName = obj.officeTypeDescription;
  }

  delete(obj) {
    setTimeout(() => {
      Swal.fire({
        title: "Do you want to delete?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          this.loadingBar = true;
          var saveData = {
            // Userid: this.cookie.get("userID"), //int
            SpType: "DELETE", //string
            OfficeTypeID: obj.officeTypeID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "ofctype", saveData, {
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
                this.getOfficeType();
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
      });
    }, 1000);
  }

  active(obj) {
    var type = "";
    if (obj.isActivated == false) {
      type = "DEACTIVATE";
    } else {
      type = "ACTIVATE";
    }

    this.loadingBar = true;

    var saveData = {
      // Userid: this.cookie.get("userID"), //int
      SpType: type, //string
      OfficeTypeID: obj.officeTypeID, //int
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "ofctype", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          this.toastr.successToastr(
            "Record " + type + " Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.clear();
          this.getOfficeType();
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

    this.ofcTypeID = "";
    this.txtOfcShrtName = "";
    this.txtOfcFullName = "";
    this.tblSearch = "";
  }
}
