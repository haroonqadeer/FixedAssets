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
  selector: "app-nhaprojects",
  templateUrl: "./nhaprojects.component.html",
  styleUrls: ["./nhaprojects.component.scss"],
})
export class NHAProjectsComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://localhost:5090/api/";

  heading = "Add";

  loadingBar = true;
  projectID = "";
  txtProShrtName = "";
  txtProFullName = "";
  cmbOfcSec = "";
  txtAccTitle = "";

  searchOfcSec = "";
  tblSearch = "";

  projectList = [];
  ofcSecList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getProject();
    this.getOfcSection();
  }

  getOfcSection() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getwingsec", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ofcSecList = data;
        // this.loadingBar = false;
      });
  }

  getProject() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getprojects", { headers: reqHeader })
      .subscribe((data: any) => {
        this.projectList = data;
        this.loadingBar = false;
      });
  }

  save() {
    if (this.cmbOfcSec == "") {
      this.toastr.errorToastr("Please Select Office Section", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAccTitle == "") {
      this.toastr.errorToastr("Please Select Account Code-Title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtProShrtName == "") {
      this.toastr.errorToastr("Please Enter Porject Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtProFullName == "") {
      this.toastr.errorToastr("Please Enter Project Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.projectID == "") {
        saveData = {
          ProjectShortName: this.txtProShrtName,
          projectName: this.txtProFullName,
          OfficeSecID: this.cmbOfcSec,
          AccountCode: this.txtAccTitle,
          ProjectID: 0,
          UserId: this.cookie.get("userID"),
          SPType: "INSERT",
        };
      } else {
        saveData = {
          ProjectShortName: this.txtProShrtName,
          projectName: this.txtProFullName,
          OfficeSecID: this.cmbOfcSec,
          AccountCode: this.txtAccTitle,
          ProjectID: this.projectID,
          UserId: this.cookie.get("userID"),
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sudproject", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.projectID == "") {
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
            this.getProject();
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

    this.projectID = obj.projectID;
    // this.txtAccSection = obj.;
    this.txtProShrtName = obj.projectShortName;
    this.txtProFullName = obj.projectName;
    this.cmbOfcSec = obj.officeSecID;
    this.txtAccTitle = obj.accountCode;
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
            Userid: this.cookie.get("userID"), //int
            SpType: "DELETE", //string
            ProjectID: obj.projectID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "sudproject", saveData, {
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
                this.getProject();
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
      OfficeSecID: obj.projectID, //int
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "sudproject", saveData, {
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
          this.getProject();
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

    this.projectID = "";
    this.txtProShrtName = "";
    this.txtProFullName = "";
    this.cmbOfcSec = "";
    this.txtAccTitle = "";

    this.searchOfcSec = "";
    this.tblSearch = "";
  }
}
