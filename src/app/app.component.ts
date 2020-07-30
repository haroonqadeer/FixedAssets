import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserIdleService } from "angular-user-idle";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://localhost:12345/api/";

  title = "FixedAssets";
  userName = "";
  _cuId;
  _cuName;
  element = document.querySelector(".sidenav");

  txtOldPw = "";
  txtNewPw = "";
  txtConfirmPw = "";

  txtPin = "";
  txtConfirmPin = "";

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    // alert(this.cookie.get("userID"));
    if (this.cookie.get("userID") == "") {
      this.router.navigate([""]);
      // $(".sideNav-backdrop").hide();
      // $(".sidenav").hide();
      // $("#menuId").hide();
    } else {
      this._cuId = this.cookie.get("userID");
      this._cuName = this.cookie.get("userName");

      //this.router.navigate(["importsurveyresult"]);
      this.userName = this.cookie.get("userName");
      $("#menuId").show();
      // $(".sidenav").hide();
      $(".sideNav-backdrop").hide();
      // this.closeNav();
      // $(".sidenav").hide();
    }
  }

  // QR Scanner
  qrResultString: string;

  clearResult(): void {
    this.qrResultString = null;
  }

  onCodeResult(resultString: string) {
    this.qrResultString = resultString;
  }

  //logout function
  Logout() {
    this.stopWatching();
    document.cookie = "userID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "pinStatus=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    this.router.navigate([""]);

    // this._cuId = "";
    // this._cuName = "";

    $("#menuId").hide();
  }

  //user idle functions
  stop() {
    this.userIdle.stopTimer();
  }

  stopWatching() {
    this.userIdle.stopWatching();
  }

  startWatching() {
    this.userIdle.startWatching();
  }

  subscribeIdle() {
    this.userIdle.onTimerStart().subscribe((count) => this.Logout());
  }

  restart() {
    this.userIdle.resetTimer();
  }

  resetPw() {
    if (this.txtOldPw == undefined || this.txtOldPw == "") {
      this.toastr.errorToastr("Please Enter Old Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNewPw == undefined || this.txtNewPw == "") {
      this.toastr.errorToastr("Please Enter New Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtConfirmPw == undefined || this.txtConfirmPw == "") {
      this.toastr.errorToastr("Please Enter Confirm Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNewPw != this.txtConfirmPw) {
      this.toastr.errorToastr("Password Doesn't Match", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var saveData = {
        UserName: this._cuName,
        OldHashPassword: this.txtOldPw,
        HashPassword: this.txtNewPw,
        UpdatedBY: this._cuId,
        SpType: "PASSWORD",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "changepw", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Password Changed Successfully!",
              "Success!",
              { toastTimeout: 2500 }
            );
            this.txtOldPw = "";
            this.txtNewPw = "";
            this.txtConfirmPw = "";
            $("#closeResetNav").click();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  genPin() {
    if (this.txtPin == undefined || this.txtPin == "") {
      this.toastr.errorToastr("Please Enter Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtConfirmPin == undefined || this.txtConfirmPin == "") {
      this.toastr.errorToastr("Please Enter Confirm Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPin != this.txtConfirmPin) {
      this.toastr.errorToastr("Pin Doesn't Match", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var saveData = {
        UserName: this.cookie.get("userName"),
        HashPassword: this.txtPin,
        UpdatedBY: this.cookie.get("userID"),
        SpType: "PINCODE",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "resetpw", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Pin Generated Successfully!",
              "Success!",
              { toastTimeout: 2500 }
            );
            this.clearPin(); //$("#closeResetNav").click();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  clearPin() {
    this.txtPin = "";
    this.txtConfirmPin = "";
  }

  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
  openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  }
}
