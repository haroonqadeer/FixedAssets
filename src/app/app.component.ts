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

  title = "FixedAssets";
  userName = "";
  _cuId;
  _cuName;
  element = document.querySelector(".sidenav");

  txtOldPw = '';
  txtNewPw = '';
  txtConfirmPw = '';

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    if (this.cookie.get("userID") == "") {
      this.router.navigate([""]);
      $(".sideNav-backdrop").hide();
      $(".sidenav").hide();
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
      $(".sidenav").hide();
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
    this.router.navigate([""]);
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

  openNav() {
    // $(".sidenav").show();
    $(".sidenav").toggle("slide");
    $(".sideNav-backdrop").show();

    // anime({
    //   targets: ".sidenav",
    //   translateX: 250,
    //   rotate: "1turn",
    //   backgroundColor: "#FFF",
    //   duration: 800,
    // });

    // $("#mySidenav").show("slide", { direction: "left" }, 1000);
    // document.getElementById("mySidenav").style.width = "250px";
    // document.getElementById("main").style.marginLeft = "250px";
  }

  closeNav() {
    // $(".sidenav").hide();
    $(".sidenav").toggle("slide");
    $(".sideNav-backdrop").hide();
    // $("#mySidenav").toggle(
    //   "slide",
    //   {
    //     direction: "left",
    //   },
    //   1000
    // );
    // $("#mySidenav").hide("slide", { direction: "right" }, 1000);
    // document.getElementById("mySidenav").style.width = "0";
    // document.getElementById("main").style.marginLeft = "0";
  }

    resetPw(){

    if(this.txtOldPw == undefined || this.txtOldPw == ''){
      this.toastr.errorToastr("Please Enter Old Password", "Error", {toastTimeout: 2500,});
      return false;
    }else if (this.txtNewPw == undefined || this.txtNewPw == ''){
      this.toastr.errorToastr("Please Enter New Password", "Error", {toastTimeout: 2500,});
      return false;
    }else if(this.txtConfirmPw == undefined || this.txtConfirmPw == ''){
      this.toastr.errorToastr("Please Enter Confirm Password", "Error", {toastTimeout: 2500,});
      return false;
    }else if (this.txtNewPw != this.txtConfirmPw){
      this.toastr.errorToastr("Password Doesn't Match", "Error", {toastTimeout: 2500,});
      return false;
    }
    else {

      var saveData = {
        UserName: this._cuName,
        OldPassword: this.txtOldPw,
        HashPassword: this.txtNewPw,
        UpdatedBY: this._cuId,
        SpType: "Password"
      };
  
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http.post(this.serverUrl + "resetpw", saveData, {headers: reqHeader,}).subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr("Password Changed Successfully!", "Success!",{toastTimeout: 2500,});
            this.txtOldPw = '';
            this.txtNewPw = '';
            this.txtConfirmPw = '';
            $('#closeResetNav').click();
            return false;
          }else {
            this.toastr.errorToastr(data.msg, "Error!",{toastTimeout: 2500,});
          }

      });

    }
  }
}