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

  imgPath = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/IPCRefImg";
  showPdf = "";
  lblFileName = "";
  image;
  selectedFile: File = null;

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
      //update
      var saveData = {
        LocCheckListID: "bigint",
        SubLocID: "bigint",
        OfficeTypeID: "bigint",
        CheckListDescription: "bigint",
        Status: item.status,
        SubLocCompletionID: "bigint = 0",
        EDoc: this.imgPath,
        EDocExtension: "pdf",
        imgFile: item.eFile,
        userId: this.cookie.get("userID"),
        spType: "UPDATE",
      };
    }
  }

  onFileSelected(event, item) {
    if (event.target.files[0].type == "application/pdf") {
      this.selectedFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.image = reader.result;

        var splitImg = this.image.split(",")[1];
        this.image = splitImg;
        this.showPdf = e.target.result;
        this.lblFileName = this.selectedFile.name;
        item.eFile = this.image;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.image = undefined;
      // this.imgFile = undefined;
      this.selectedFile = null;
      // this.imageUrl = "";
    }
  }

  // onFileSelected(event, item) {
  //   if (event.target.files[0].type == "application/pdf") {
  //     this.selectedFile = <File>event.target.files[0];

  //     let reader = new FileReader();

  //     reader.onloadend = (e: any) => {
  //       item.eDoc = reader.result;

  //       var splitImg = item.eDoc.split(",")[1];
  //       item.eDoc = splitImg;
  //       this.showPdf = e.target.result;
  //       this.lblFileName = this.selectedFile.name;
  //     };

  //     reader.readAsDataURL(this.selectedFile);
  //   } else {
  //     this.toastr.errorToastr("Please Select PDF File", "Error", {
  //       toastTimeout: 2500,
  //     });

  //     this.selectedFile = null;
  //   }
  // }
}
