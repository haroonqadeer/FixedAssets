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
  selector: "app-nhaposts",
  templateUrl: "./nhaposts.component.html",
  styleUrls: ["./nhaposts.component.scss"],
})
export class NHAPostsComponent implements OnInit {
  serverUrl = "http://95.217.147.105:2007/api/";
  heading = "Add";

  postID = "";
  txtPostName = "";
  cmbBS = "";
  tblSearch = "";

  custodyList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getCustody();
  }

  getCustody() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getposts", { headers: reqHeader })
      .subscribe((data: any) => {
        this.custodyList = data;
      });
  }

  save() {
    if (this.cmbBS == "") {
      this.toastr.errorToastr("Please Select BPS", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPostName == "") {
      this.toastr.errorToastr("Please Enter Post Title", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.postID == "") {
        var saveData = {};
      } else {
        var saveData = {};
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "savepost", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.postID == "") {
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
            this.getCustody();
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

    this.postID = obj.postID;
    this.txtPostName = obj.postName;
    this.cmbBS = obj.bs;
  }

  delete(obj) {
    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: "Delete", //string
      AssetID: obj.postID, //int
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "savepost", saveData, {
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
          this.getCustody();
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

    this.postID = "";
    this.txtPostName = "";
    this.cmbBS = "";
    this.tblSearch = "";
  }
}
