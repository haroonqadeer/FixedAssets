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
  selector: "app-asset-category",
  templateUrl: "./asset-category.component.html",
  styleUrls: ["./asset-category.component.scss"],
})
export class AssetCategoryComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";

  // imgPath = "D:/Flutter App/FixedAssets/src/assets/assetCatImg";
  imgPath = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/assetCatImg";
  imageUrl: string = "../../../../../assets/assetCatImg/dropHereImg.png";
  image;
  imgFile;
  selectedFile: File = null;

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

  onFileSelected(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      this.selectedFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.image = reader.result;

        var splitImg = this.image.split(",")[1];
        this.image = splitImg;
        this.imageUrl = e.target.result;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.image = undefined;
      this.imgFile = undefined;
      this.selectedFile = null;
      this.imageUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  zoomImage() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    var img = document.getElementById("myImg");
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("caption");

    if (this.imageUrl == "../../../../../assets/assetCatImg/dropHereImg.png") {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>document.querySelector("#img01")).src = this.imageUrl;
    }
  }

  closeModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
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
      .get(this.serverUrl + "getaccountcat", { headers: reqHeader })
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
          accountsCatID: parseInt(this.cmbAccCat),
          assetCatCode: this.txtCatShrtName,
          assetCatDescription: this.txtCatFullName,
          edoc: this.imgPath,
          EDocExtension: "jpg",
          imgFile: this.image,
          assetCatID: 0,
          userId: this.cookie.get("userID"),
          spType: "INSERT",
        };
      } else {
        saveData = {
          accountsCatID: parseInt(this.cmbAccCat),
          assetCatCode: this.txtCatShrtName,
          assetCatDescription: this.txtCatFullName,
          edoc: this.imgPath,
          EDocExtension: "jpg",
          imgFile: this.image,
          assetCatID: this.assetCatID,
          userId: this.cookie.get("userID"),
          spType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sudassetcatagory", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
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
    if (obj.edoc != null) {
      // http://ambit-erp.southeastasia.cloudapp.azure.com:9000/assets/images/Marker2.png
      // this.imageUrl = "obj.edoc";
      this.imageUrl =
        "http://95.217.206.195:2008/assets/assetCatImg/" +
        obj.assetCatID +
        ".jpg";
    }
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
        if (data.msg == "Success") {
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
    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
  }
}
