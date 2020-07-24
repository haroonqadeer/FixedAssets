import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2/dist/sweetalert2.js";

@Component({
  selector: "app-nhaloc",
  templateUrl: "./nhaloc.component.html",
  styleUrls: ["./nhaloc.component.scss"],
})
export class NHALocComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://localhost:5090/api/";
  heading = "Add";

  loadingBar = true;
  subLocID = "";
  txtLocShrtName = "";
  txtLocFullName = "";
  cmbRegion = "";
  cmbOfcType = 0;

  searchOfcType = "";
  searchLocation = "";
  tblSearch = "";

  locList = [];
  tempList = [];
  ofcTypeList = [];
  mainLocList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getLocation();
    this.getMainLocation();
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

  getMainLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getmainLoc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.mainLocList = data;
        this.loadingBar = false;
      });
  }

  getLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getsubloc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.locList = data;
        this.tempList = data;
        this.loadingBar = false;
      });
  }

  filterTable(loc) {
    this.locList = this.tempList;
    this.locList = this.locList.filter((x) => x.mainLocID == loc);
  }

  save() {
    if (this.cmbRegion == "") {
      this.toastr.errorToastr("Please Select Region", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbOfcType == 0) {
      this.toastr.errorToastr("Please Select Office Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtLocShrtName == "") {
      this.toastr.errorToastr("Please Enter Location Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtLocFullName == "") {
      this.toastr.errorToastr("Please Enter Location Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.subLocID == "") {
        saveData = {
          MainLocID: this.cmbRegion,
          SubLocation: this.txtLocFullName,
          subLocationCode: this.txtLocShrtName,
          OfficeTypeID: this.cmbOfcType,
          SubLocationID: 0,
          UserId: this.cookie.get("userID"),
          SPType: "INSERT",
        };
      } else {
        saveData = {
          MainLocID: this.cmbRegion,
          SubLocation: this.txtLocFullName,
          subLocationCode: this.txtLocShrtName,
          OfficeTypeID: this.cmbOfcType,
          SubLocationID: this.subLocID,
          UserId: this.cookie.get("userID"),
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sublocation", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            if (this.subLocID == "") {
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
            this.getLocation();
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
    this.subLocID = obj.subLocID;
    this.txtLocShrtName = obj.subLocationCode;
    this.txtLocFullName = obj.subLocationDescription;
    this.cmbRegion = obj.mainLocID;
    this.cmbOfcType = obj.officeTypeID;
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
            SubLocationID: obj.subLocID,
            userID: this.cookie.get("userID"), //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "sublocation", saveData, {
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
                this.getLocation();
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
      Userid: this.cookie.get("userID"), //int
      SpType: type, //string
      SubLocationID: obj.subLocID,
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "sublocation", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "SUCCESS") {
          this.toastr.successToastr(
            "Record " + type + " Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.clear();
          this.getLocation();
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
    this.subLocID = "";
    this.txtLocShrtName = "";
    this.txtLocFullName = "";
    this.cmbRegion = "";
    this.cmbOfcType = 0;

    this.searchLocation = "";
    this.tblSearch = "";

    this.locList = this.tempList;
  }
}
