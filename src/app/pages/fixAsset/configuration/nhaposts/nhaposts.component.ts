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

  loadingBar = true;
  postID = "";
  txtCmpnyName = "";
  txtPostName = "";
  cmbBS = "";
  tblSearch = "";

  custodyList = [];
  bpsList = [
    { name: "0" },
    { name: "1" },
    { name: "2" },
    { name: "3" },
    { name: "4" },
    { name: "5" },
    { name: "6" },
    { name: "7" },
    { name: "8" },
    { name: "9" },
    { name: "10" },
    { name: "11" },
    { name: "12" },
    { name: "13" },
    { name: "14" },
    { name: "15" },
    { name: "16" },
    { name: "17" },
    { name: "18" },
    { name: "19" },
    { name: "20" },
    { name: "21" },
    { name: "22" },
  ];

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
        this.loadingBar = false;
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
    } else if (this.txtCmpnyName == "") {
      this.toastr.errorToastr("Please Enter Company Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.postID == "") {
        saveData = {
          PostName: this.txtPostName,
          BS: this.cmbBS,
          nameofCompany: this.txtCmpnyName,
          PostID: 0,
          UserId: this.cookie.get("userID"),
          SPType: "INSERT",
        };
      } else {
        saveData = {
          PostName: this.txtPostName,
          BS: this.cmbBS,
          nameofCompany: this.txtCmpnyName,
          PostID: this.postID,
          UserId: this.cookie.get("userID"),
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sudpost", saveData, {
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

    this.postID = obj.postID;
    this.txtPostName = obj.postName;
    this.cmbBS = obj.bs;
    this.txtCmpnyName = obj.bs;
  }

  delete(obj) {
    this.loadingBar = true;
    var saveData = {
      // Userid: this.cookie.get("userID"), //int
      SpType: "DELETE", //string
      PostID: obj.postID, //int
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "sudpost", saveData, {
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

    this.postID = "";
    this.txtCmpnyName = "";
    this.txtPostName = "";
    this.cmbBS = "";
    this.tblSearch = "";
  }
}
