import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-asset-category",
  templateUrl: "./asset-category.component.html",
  styleUrls: ["./asset-category.component.scss"],
})
export class AssetCategoryComponent implements OnInit {
  serverUrl = "http://95.217.147.105:2007/api/";

  heading = "Add";

  loadingBar = true;
  assetCatID = "";
  txtCatShrtName = "";
  txtCatFullName = "";
  cmbAccCat = "";

  searchAccCat = "";
  tblSearch = "";

  assetCatList = [];
  accCatList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getAssetCategory();
    this.getAccountCategory();
  }

  getAssetCategory() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getassetcat", { headers: reqHeader })
      .subscribe((data: any) => {
        this.assetCatList = data;
        this.loadingBar = false;
      });
  }

  getAccountCategory() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getassetcat", { headers: reqHeader })
      .subscribe((data: any) => {
        this.accCatList = data;
      });
  }

  save() {
    if (this.cmbAccCat == "") {
      this.toastr.errorToastr("Please Select Account Category", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCatShrtName == "") {
      this.toastr.errorToastr("Please Enter Category Short Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtCatFullName == "") {
      this.toastr.errorToastr("Please Enter Category Full Name", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.assetCatID == "") {
        saveData = {
          AccountsCatID: parseInt(this.cmbAccCat),
          AssetCatCode: this.txtCatShrtName,
          AssetCatDescription: this.txtCatFullName,
          Edoc: "",
          AssetCatID: 0,
          UserId: this.cookie.get("userID"),
          SPType: "INSERT",
        };
      } else {
        saveData = {
          AccountsCatID: parseInt(this.cmbAccCat),
          AssetCatCode: this.txtCatShrtName,
          AssetCatDescription: this.txtCatFullName,
          Edoc: "",
          AssetCatID: this.assetCatID,
          UserId: this.cookie.get("userID"),
          SPType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sudassetcatagory", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            if (this.assetCatID == "") {
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
            this.getAssetCategory();
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

    this.assetCatID = obj.assetCatID;
    this.txtCatShrtName = obj.assetCatCode;
    this.txtCatFullName = obj.assetCatDescription;
    this.cmbAccCat = obj.accountsCatID;
  }

  delete(obj) {
    this.loadingBar = true;
    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: "DELETE", //string
      AssetCatID: obj.assetCatID,
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "sudassetcatagory", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "SUCCESS") {
          this.toastr.successToastr(
            "Record Deleted Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.clear();
          this.getAssetCategory();
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

    this.assetCatID = "";
    this.txtCatShrtName = "";
    this.txtCatFullName = "";
    this.cmbAccCat = "";

    this.searchAccCat = "";
    this.tblSearch = "";
  }
}
