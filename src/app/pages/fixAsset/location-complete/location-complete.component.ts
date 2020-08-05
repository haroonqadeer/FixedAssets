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
  serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://localhost:5090/api/";

  loadingBar = false;

  imgPath = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/IPCRefImg";
  showPdf = "";
  lblFileName = "";
  image;
  selectedFile: File = null;

  panelOpenState = false;
  userLocations = [];
  tempLocList = [];

  txtPin = "";
  compLoc = "";
  locID = 0;
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
    this.compLoc = item.isCompleted;
    this.locID = item.subLocID;
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
        this.tempLocList = data;
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
  updateCheckList(item) {
    if (
      item.fileRequired == 1 &&
      (item.eDoc == "" || item.eDoc == null || item.eDoc == undefined)
    ) {
      this.toastr.errorToastr("File Required to upload", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      //update
      var saveData = {
        LocCheckListID: item.locCheckListID,
        Description: item.description,
        status: 1,
        SubLocCompletionID: item.subLocCompletionID,
        EDoc: this.imgPath,
        EDocExtension: "pdf",
        imgFile: item.eFile,
        UserId: this.cookie.get("userID"),
        SpType: "UPDATE",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "updatechecklist", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Record Updated Successfully!",
              "Success!",
              {
                toastTimeout: 2500,
              }
            );
            this.showLocCheckList(item);
            // this.clear();
            // this.getAssetCategory();
            // this.loadingBar = false;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            // this.loadingBar = false;
            return false;
          }
        });
    }
  }

  // update check list
  undoneCheckList(item) {
    var saveData = {
      LocCheckListID: item.locCheckListID,
      Description: item.description,
      status: 0,
      SubLocCompletionID: item.subLocCompletionID,
      EDoc: null,
      EDocExtension: null,
      imgFile: null,
      UserId: this.cookie.get("userID"),
      SpType: "UPDATE",
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "updatechecklist", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          this.toastr.successToastr(
            "Record Updated Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.showLocCheckList(item);
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          return false;
        }
      });
  }

  verifyPin() {
    var count = 0;
    if (this.locID == 0) {
      this.toastr.errorToastr("Please Select Location", "Error !", {
        toastTimeout: 5000,
      });
      return false;
    } else if (this.txtPin == "") {
      this.toastr.errorToastr("Please Enter Pin", "Error !", {
        toastTimeout: 5000,
      });
      return false;
    } else {
      if (this.tempLocList.length > 0) {
        for (var i = 0; i < this.tempLocList.length; i++) {
          if (this.tempLocList[i].status == 1) {
            count++;
          }
        }
      }

      if (count < this.tempLocList.length) {
        this.toastr.errorToastr(
          "Please Complete Location " + this.locationTitle + " All Check List",
          "Error !",
          {
            toastTimeout: 5000,
          }
        );
        return false;
      }
      this.loadingBar = true;
      var saveData = {
        UserName: this.cookie.get("userName"),
        Pincode: this.txtPin,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "pincode", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.saveCompleteLocation();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  saveCompleteLocation() {
    var saveData = {
      SpType: "COMPLETE", //string
      SubLocationID: this.locID,
      userID: this.cookie.get("userID"), //int
    };

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
    });

    this.http
      .post(this.serverUrl + "sublocation", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "SUCCESS") {
          this.toastr.successToastr(
            "Record Completed Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          // this.clear();
          this.getUserLocations();
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
}
