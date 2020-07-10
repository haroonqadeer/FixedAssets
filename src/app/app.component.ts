import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserIdleService } from "angular-user-idle";

declare var $: any;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  title = "FixedAssets";
  userName = "";

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService
  ) {}

  ngOnInit(): void {
    if (this.cookie.get("userID") == "") {
      this.router.navigate([""]);
      // $("#menuId").hide();
    } else {
      //this.router.navigate(["importsurveyresult"]);
      this.userName = this.cookie.get("userName");
      $("#menuId").show();
      $(".sidenav").hide();
    }
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
    $(".sidenav").show();
    // const element = document.querySelector("#mySidenav");
    // element.classList.add("animate__animated", "animate__bounce");
    // $("#mySidenav").show("slide", { direction: "left" }, 1000);
    // document.getElementById("mySidenav").style.width = "250px";
    // document.getElementById("main").style.marginLeft = "250px";
  }

  closeNav() {
    $(".sidenav").hide();
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
}
