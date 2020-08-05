import { Component, OnInit } from "@angular/core";
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
  selector: "app-location-complete",
  templateUrl: "./location-complete.component.html",
  styleUrls: ["./location-complete.component.scss"],
})
export class LocationCompleteComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  serverUrl = "http://localhost:5090/api/";

  userLocations = [];
  locationTitle = "Select Location";
  locationCheckList = [];
  locationStatus = 1;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getUserLocations();
  }

  showLocCheckList(item) {
    this.locationTitle = item.officeTypeDescription;
    this.locationStatus = item.isCompleted;
    // this.locationStatus = 1;

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl +
          "getLocationCheckList?subLocID=" +
          item.subLocID +
          "&officeTypeID=" +
          item.officeTypeID,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.locationCheckList = data;
      });
  }

  // get user location
  getUserLocations() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl + "getuserlocation?UserID=" + this.cookie.get("userID"),
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.userLocations = data;
      });
  }

  // update check list
  updateCheckList(item, i) {
    if (
      item.fileRequired == 1 &&
      (item.eDoc == "" || item.eDoc == null || item.eDoc == undefined)
    ) {
      this.toastr.errorToastr("File Required to upload", "Error", {
        toastTimeout: 2500,
      });
      this.locationCheckList[i].status = !item.status;
      return false;
    } else {
    }
  }
}
