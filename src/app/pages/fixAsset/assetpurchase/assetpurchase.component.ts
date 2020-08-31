import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { CookieService } from "ngx-cookie-service";
import { UserIdleService } from "angular-user-idle";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AppComponent } from "../../../app.component";

declare var $: any;

@Component({
  selector: "app-assetpurchase",
  templateUrl: "./assetpurchase.component.html",
  styleUrls: ["./assetpurchase.component.scss"],
})
export class AssetpurchaseComponent implements OnInit {
  loadingBar = true;
  reqType = "";
  reqStatus = false;
  // serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://localhost:12345/api/";

  toggleView = "form";

  imgFile = "";
  lblFileName = "";
  imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";

  imgFileSup = "";
  lblFileNameSup = "";
  imageUrlSup = "../../../../../assets/IPCRefImg/dropHereImg.png";

  lblPurchaseID = 0;
  lblOfcType = "";

  ddlAccSec = "";
  ddlProject = "";
  ddlRef = "";
  ddlLocation = "";
  ddlPost = "";
  ddlMemoIssued = "";
  ddlCustody = "";
  ddlOfcSec = "";
  ddlVehicle = "";
  ddlAssetCat = "";

  dtpPurchase = new Date();
  dtpSupplierInvoice = new Date();

  txtDescription = "";
  txtMemo = "";
  txtSupplier = "";
  txtSupInvoiceNo = "";
  txtTotalAmount = "";
  txtAssetDesc = "";
  txtCost = "";
  txtRemarks = "";

  rdbAsset = "";

  txtSearchPurchaseData = "";
  txtSearchAccSec = "";
  txtSearchRef = "";
  txtSearchProject = "";
  txtSearchLocation = "";
  txtSearchPost = "";
  txtSearchMemoIssued = "";
  txtSearchCustody = "";
  txtSearchOfcSec = "";
  txtSearchVehicle = "";
  txtSearchAssetCat = "";

  accSecList = [];
  projectsList = [];
  refList = [];
  locList = [];
  purchaseList = [];
  postList = [];
  custodyList = [];
  ofcSecList = [];
  vehList = [];
  assetCatList = [];
  assetCategorySpecsList = [];
  assetList = [];

  filePicker = "";
  selectedFile: File = null;
  file;

  filePickerSup = "";
  selectedFileSup: File = null;
  fileSup;

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getAccSec();
    this.getProjects();
    // this.getLandMeasurement();
    // this.getRoads();
    // this.getLandData();
    // this.getFaDetail();
  }

  onFileSelected(event) {
    this.selectedFile = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = (e) => {
      this.file = reader.result;

      var splitFile = this.file.split(",")[1];
      this.file = splitFile;
    };

    reader.readAsDataURL(this.selectedFile);
  }

  onSupFileSelected(event) {
    this.selectedFileSup = <File>event.target.files[0];
    let reader = new FileReader();

    reader.onloadend = (e) => {
      this.fileSup = reader.result;

      var splitFile = this.fileSup.split(",")[1];
      this.fileSup = splitFile;
    };

    reader.readAsDataURL(this.selectedFileSup);
  }

  assetCategorySpecsData(assetCatID, specID, specificationListName) {}

  getAccSec() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getaccsec", { headers: reqHeader })
      .subscribe((data: any) => {
        this.accSecList = data;
        this.loadingBar = false;
      });
  }

  getProjects() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getprojects?IsActivated=1", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.projectsList = data;
        this.loadingBar = false;
      });
  }

  //main entery CRUD Operation
  save() {
    // if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
    //   this.toastr.errorToastr("Please Select Account Section", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (this.ddlLocation == undefined || this.ddlLocation == "") {
    //   this.toastr.errorToastr("Please Select Location", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (this.ddlProject == undefined || this.ddlProject == "") {
    //   this.toastr.errorToastr("Please Select Project", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (this.ddlRef == undefined || this.ddlRef == "") {
    //   this.toastr.errorToastr("Please Select IPC Reference", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (this.txtDescription == undefined || this.txtDescription == "") {
    //   this.toastr.errorToastr("Please Enter Description", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (this.txtMemo == undefined || this.txtMemo == "") {
    //   this.toastr.errorToastr("Please Enter Memo No", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (this.ddlPost == undefined || this.ddlPost == "") {
    //   this.toastr.errorToastr("Please Select Post", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // } else if (
    //   this.acquisitionDate == undefined ||
    //   this.acquisitionDate == null
    // ) {
    //   this.toastr.errorToastr("Please Enter Year of Acquisition", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // }
    // else {
    //   var reqRemarks = "-";
    //   if (this.remarks == undefined && this.remarks.trim() == "") {
    //     reqRemarks = this.remarks;
    //   }
    //   var reqDate = this.app.convertDate(this.acquisitionDate);
    //   var reqSpType = "INSERT";
    //   if (this.lblPurchaseID > 0) {
    //     reqSpType = "UPDATE";
    //   }
    //   var SaveData = {
    //     AccountsCatID: this.fixAccountsCatID,
    //     FixedAssetID: this.fixAssetID,
    //     OfficeSecID: this.ddlAccSec,
    //     ProjectID: this.ddlProject,
    //     RoadId: this.ddlRoads,
    //     BuildingID: 0,
    //     DateofNationalization: reqDate,
    //     PurposeofPurchase: this.purposeOfPurchase.trim(),
    //     PresentUse: this.presentUse.trim(),
    //     ConstructionFom: null,
    //     ConstructionTo: null,
    //     ConstructionCost: 0,
    //     LandMeasureTypeID: this.ddlLandMeasurement,
    //     AreaAcquiredKanal: aKanal,
    //     AreaAcquiredMarla: aMarla,
    //     AreaTransferedKanal: tKanal,
    //     AreaTransferedMarla: tMarla,
    //     CostOfLand: this.amountPaid,
    //     Remarks: reqRemarks,
    //     Userid: this.cookie.get("userID"),
    //     SpType: reqSpType,
    //   };
    //   this.loadingBar = true;
    //   var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    //   this.http
    //     .post(this.app.serverUrl + "crudPurchase", SaveData, { headers: reqHeader })
    //     .subscribe((data: any) => {
    //       if (data.msg == "Success") {
    //         if (this.lblPurchaseID == 0) {
    //           this.toastr.successToastr(
    //             "Record Saved Successfully!",
    //             "Success!",
    //             { toastTimeout: 2500 }
    //           );
    //         } else {
    //           this.toastr.successToastr(
    //             "Record Updated Successfully!",
    //             "Success!",
    //             { toastTimeout: 2500 }
    //           );
    //         }
    //         this.clear();
    //         return false;
    //       } else {
    //         this.toastr.errorToastr(data.msg, "Error !", {
    //           toastTimeout: 5000,
    //         });
    //         this.loadingBar = false;
    //         return false;
    //       }
    //     });
    // }
  }

  clear() {
    this.lblPurchaseID = 0;
    this.ddlAccSec = "";
    this.ddlProject = "";
    this.ddlLocation = "";
    this.lblOfcType = "";
    this.dtpPurchase = new Date();
    this.txtDescription = "item.presentUse";
    this.txtMemo = "";
    this.ddlPost = "";
    this.ddlMemoIssued = "";
    this.txtSupplier = "";
    this.dtpSupplierInvoice = new Date();
    this.txtSupplier = "";

    this.imgFile = "";
    this.lblFileName = "";
    this.imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";

    this.imgFileSup = "";
    this.lblFileNameSup = "";
    this.imageUrlSup = "../../../../../assets/IPCRefImg/dropHereImg.png";

    this.filePicker = "";
    this.selectedFile = null;
    this.file;

    this.filePickerSup = "";
    this.selectedFileSup = null;
    this.fileSup;
  }

  edit(item) {
    this.lblPurchaseID = item.purchaseID;
    this.ddlAccSec = item.officeSecID.toString();
    this.ddlProject = item.projectID.toString();
    this.ddlLocation = item.landMeasureTypeID.toString();
    this.lblOfcType = item.officeType;
    this.filterIPC(this.ddlProject);
    this.dtpPurchase = item.dtpPurchase;
    this.txtDescription = item.presentUse;
    this.txtMemo = item.dateofNationalization;
    this.ddlPost = item.costOfLand;
    this.ddlMemoIssued = "";
    this.txtSupplier = item.areaTransferedMarla;
    this.dtpSupplierInvoice = item.remarks;
    this.txtSupplier = item.remarks;

    this.toggleView = "form";
  }

  delete(item) {
    setTimeout(() => {
      Swal.fire({
        title: "Do you want to delete?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          this.loadingBar = true;

          var SaveData = {
            FixedAssetID: item.purchaseID,
            Userid: this.cookie.get("userID"),
            SpType: "DELETE",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "crudPurchase", SaveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              if (data.msg == "Success") {
                this.toastr.successToastr(
                  "Record Deleted Successfully!",
                  "Success!",
                  { toastTimeout: 2500 }
                );
                this.clear();
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
      });
    }, 1000);
  }

  filterIPC(reqProjectID) {
    var tempList = this.projectsList.filter((x) => x.projectID == reqProjectID);
  }

  openPDFFile() {}

  openPDFFileSup() {}
}
