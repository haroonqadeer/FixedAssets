import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";

declare var jQuery: any;
declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  serverUrl = "http://95.217.147.105:2006/";

  showProgress = false;
  showResetProgress = false;

  emailAddress = "";
  loginPassword = "";
  resetEmailAddress = "";
  resetOldPassword = "";
  resetNewPassword = "";
  resetConfirmPassword = "";

  constructor(
    public toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    private router: Router,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {}

  login() {
    if (this.emailAddress == "") {
      this.toastr.errorToastr("Please Enter Email", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.loginPassword == "") {
      this.toastr.errorToastr("Please Enter Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqData = {
        UserName: this.emailAddress,
        HashPassword: this.loginPassword,
      };

      this.showProgress = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
      this.http
        .post(this.serverUrl + "api/CreateToken", reqData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "success") {
            this.toastr.successToastr("Login Successfully!", "Success!", {
              toastTimeout: 2500,
            });

            this.cookie.set("token", data.token);
            // this.cookie.set("ui", "159");
            // this.cookie.set("un", "Survey Deck");

            //this.cookie.set('ui', data.rows[0].userID);
            //this.cookie.set('un', data.rows[0].userName);
            this.showProgress = false;
            this.router.navigate(["assetEntry"]);
            // $("#menuId").show();
            // this.app.startWatching();
            // this.app.subscribeIdle();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.showProgress = false;
            return false;
          }
        });
    }
  }

  resetPassword() {
    //  = "";
    //  = "";
    // resetNewPassword = "";
    // resetConfirmPassword = "";

    if (this.resetEmailAddress == "") {
      this.toastr.errorToastr("Please Enter Email", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.resetOldPassword == "") {
      this.toastr.errorToastr("Please Enter Old Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.resetNewPassword == "") {
      this.toastr.errorToastr("Please Enter New Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.resetConfirmPassword == "") {
      this.toastr.errorToastr("Please Enter Confirm Password", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.resetConfirmPassword != this.resetNewPassword) {
      this.toastr.errorToastr(
        "New & Confirm Password does not Match",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else {
      var reqData = {
        UserName: this.emailAddress,
        HashPassword: this.loginPassword,
      };
    }
  }
}
