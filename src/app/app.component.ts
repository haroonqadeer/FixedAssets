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

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService
  ) {}

  ngOnInit(): void {
    if (this.cookie.get("userID") == "") {
      this.router.navigate([""]);
      $("#menuId").hide();
    } else {
      //this.router.navigate(["importsurveyresult"]);
      $("#menuId").show();
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
}
