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
  chkAssetFields = true;
  selectAllAssetFields = false;

  //pagination variables for tag list
  tagItemPerPage = "10";
  tagP = 1;

  toggleView = "form";

  imgFile = "";
  lblFileName = "";
  imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";

  imgFileSup = "";
  lblFileNameSup = "";
  imageUrlSup = "../../../../../assets/IPCRefImg/dropHereImg.png";

  lblAssetID = 0;
  lblPurchaseID = 0;
  lblOfcType = "";
  lblOfcTypeID = 0;
  editMode = 0;
  lblAssetNo = 0;

  lblLocation = "";
  lblAccountSection = "";
  lblProject = "";
  lblIPC = "";
  lblPurchaseDt = "";
  lblTotalAmount = "";
  lblMode = "";
  lblDescription = "";
  lblMemoNo = "";
  lblMemoIssued = "";
  lblMemoDt = "";
  lblSupplier = "";
  lblSuppInvDt = "";
  lblSuppInvNo = "";

  ddlAccSec = "";
  ddlProject = "";
  ddlRef = "";
  ddlLocation = "";
  ddlPost = "";
  ddlCustody = "";
  ddlOfcSec = "";
  ddlVehicle = "";
  ddlAssetCat = "";
  ddlMode = "";

  dtpPurchase = new Date();
  dtpSupplierInvoice = new Date();
  dtpMemoDate = new Date();

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
  tempAssetCatList = [];
  assetCategorySpecsList = [];
  assetList = [];
  tagList = [];
  modeList = [{ name: "PSDP" }, { name: "RMA" }];

  filePicker = "";
  selectedFile: File = null;
  file;

  filePickerSup = "";
  selectedFileSup: File = null;
  fileSup;

  //asset category sepecificaiton ngModels
  make = "";
  makeList = [];
  model = "";
  modelList = [];
  size = "";
  sizeList = [];
  generation = "";
  generationList = [];
  processor = "";
  processorList = [];
  ram = "";
  ramList = [];
  driveType1 = "";
  driverType1List = [];
  hdSize1 = "";
  hdSize1List = [];
  driveType2 = "";
  driverType2List = [];
  hdSize2 = "";
  hdSize2List = [];
  author = "";
  authorList = [];
  publisher = "";
  publisherList = [];
  volume = "";
  volumeList = [];
  edition = "";
  editionList = [];

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.rdbAsset = "1";

    this.getProjects();
    this.getLocation();
    this.getCustody();
    this.getVehicle();
    this.getAssetCategory();
  }

  onFileSelected(event) {
    // alert(event.target.files[0].type);

    if (event.target.files[0].type == "application/pdf") {
      this.selectedFile = <File>event.target.files[0];

      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.file = reader.result;

        var splitImg = this.file.split(",")[1];
        this.file = splitImg;
        this.imageUrl = "../../../../../assets/IPCRefImg/PDF_file_icon.svg";
        // this.showPdf = e.target.result;
        this.lblFileName = this.selectedFile.name;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.file = undefined;
      this.imgFile = undefined;
      this.selectedFile = null;
      this.imageUrl = "../../../../../assets/IPCRefImg/dropHereImg.png";
      this.lblFileName = "";
    }
  }

  onSupFileSelected(event) {
    if (event.target.files[0].type == "application/pdf") {
      this.selectedFileSup = <File>event.target.files[0];

      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.fileSup = reader.result;

        var splitImg = this.fileSup.split(",")[1];
        this.fileSup = splitImg;
        this.imageUrlSup = "../../../../../assets/IPCRefImg/PDF_file_icon.svg";
        // this.showPdf = e.target.result;
        this.lblFileNameSup = this.selectedFileSup.name;
      };

      reader.readAsDataURL(this.selectedFileSup);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.fileSup = undefined;
      this.imgFileSup = undefined;
      this.selectedFileSup = null;
      this.imageUrlSup = "../../../../../assets/IPCRefImg/dropHereImg.png";
      this.lblFileNameSup = "";
    }
  }

  getAssetNo() {
    if (
      this.ddlLocation != "" &&
      this.lblOfcTypeID != 0 &&
      this.ddlAssetCat != ""
    ) {
      var saveData = {
        SubLocID: this.ddlLocation,
        OfficeTypeID: this.lblOfcTypeID,
        AssetCatID: this.ddlAssetCat,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.app.serverUrl + "getassetno", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          this.lblAssetNo = data.msg;
        });
    }
  }

  getAssetCatDescription(assetCatID) {
    if (this.ddlAssetCat != "" || this.ddlAssetCat != undefined) {
      var assetCat = this.assetCatList.filter(
        (x) => x.assetCatID == assetCatID
      );
      this.txtAssetDesc = assetCat[0].assetCatDescription;
      // this.lblAccCategory = assetCat[0].accountsCatagory;
      // this.lblDepRule = assetCat[0].depreciationRule;
      // this.lblBaseRate = assetCat[0].baseRate;
    }
  }

  assetCategorySpecs() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getAssetCategorySpecs?assetCatID=" +
          this.ddlAssetCat,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetCategorySpecsList = data;
      });
  }

  assetCategorySpecsData(assetCatID, specID, specListName) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.app.serverUrl +
          "getAssetCategorySpecsData?assetCatID=" +
          assetCatID +
          "&specID=" +
          specID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this[specListName] = data;
      });
  }

  getAccSec(ofcTypeID) {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getaccsec", { headers: reqHeader })
      .subscribe((data: any) => {
        this.accSecList = data.filter((x) => x.officeTypeID == ofcTypeID);
        this.loadingBar = false;
      });
  }

  getAssetCategory() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getassetcat", { headers: reqHeader })
      .subscribe((data: any) => {
        this.assetCatList = data;
        this.tempAssetCatList = data;
      });
  }

  getVehicle() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getvehicles", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehList = data;
      });
  }

  getAssetCat() {
    this.ddlVehicle = "";
    this.assetCatList = this.tempAssetCatList;
    if (this.rdbAsset == "2") {
      this.assetCatList = this.assetCatList.filter(
        (x) => x.accountsCatagory == "VEHICLES"
      );
    }
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

  getLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    if (this.cookie.get("roleName") == "Super User") {
      this.http
        .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
        .subscribe((data: any) => {
          this.locList = data;
        });
    } else {
      this.http
        .get(
          this.app.serverUrl +
            "getuserLocation?userId=" +
            this.cookie.get("userID"),
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.locList = data;
        });
    }
  }

  getCustody() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getposts", { headers: reqHeader })
      .subscribe((data: any) => {
        this.custodyList = data;
        this.postList = data;
      });
  }

  getOfcSection(obj) {
    this.ddlOfcSec = "";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getwingsec?officeTypeID=" + obj, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.ofcSecList = data;
      });
  }

  savePurchaseData() {
    if (this.lblPurchaseID == 0 && this.editMode == 0) {
      // this.chkPurchaseAsset();
      this.chkPurchase();
      // } else if (this.lblPurchaseID != 0 && this.editMode == 0) {
      //   this.chkAsset();
      // } else if (this.lblPurchaseID != 0 && this.editMode != 0) {
      //   this.chkAssetData();
    }
  }

  chkAssetData() {
    if (
      this.ddlCustody != "" ||
      this.ddlOfcSec != "" ||
      this.ddlAssetCat != "" ||
      this.txtAssetDesc != "" ||
      this.txtCost != "" ||
      this.txtRemarks != "" ||
      this.ddlVehicle != ""
    ) {
      this.chkAssetFields = false;
    }

    if (this.chkAssetFields == true) {
      this.chkPurchase();
    } else {
      this.chkPurchaseAsset();
    }
  }

  //main entery CRUD Operation
  chkPurchaseAsset() {
    if (this.ddlLocation == undefined || this.ddlLocation == "") {
      this.toastr.errorToastr("Please Select Location", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
      this.toastr.errorToastr("Please Select Account Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlProject == undefined || this.ddlProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlRef == undefined || this.ddlRef == "") {
      this.toastr.errorToastr("Please Select IPC Reference", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtTotalAmount == undefined || this.txtTotalAmount == "") {
      this.toastr.errorToastr("Please Enter Total Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlMode == undefined || this.ddlMode == "") {
      this.toastr.errorToastr("Please Select Mode of Acquistion", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDescription == undefined || this.txtDescription == "") {
      this.toastr.errorToastr("Please Enter Description", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.ddlMode == "RMA") {
        if (this.txtMemo == undefined || this.txtMemo == "") {
          this.toastr.errorToastr("Please Enter Memo No", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.ddlPost == undefined || this.ddlPost == "") {
          this.toastr.errorToastr("Please Select Memo Issued By", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.dtpMemoDate == undefined) {
          this.toastr.errorToastr("Please Select Memo Date", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.file == undefined || this.file == "") {
          this.toastr.errorToastr("Please Choose Memo Document", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.txtSupplier == undefined || this.txtSupplier == "") {
          this.toastr.errorToastr("Please Enter Supplier Name", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.dtpSupplierInvoice == undefined) {
          this.toastr.errorToastr(
            "Please Select Supplier Invoice Date",
            "Error !",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        } else if (
          this.txtSupInvoiceNo == undefined ||
          this.txtSupInvoiceNo == ""
        ) {
          this.toastr.errorToastr(
            "Please Enter Supplier Invoice No",
            "Error !",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        } else if (this.fileSup == undefined || this.fileSup == "") {
          this.toastr.errorToastr(
            "Please Choose Supplier Document",
            "Error !",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        }
      }
      this.save();
    }
  }

  //main entery CRUD Operation
  chkPurchase() {
    if (this.ddlLocation == undefined || this.ddlLocation == "") {
      this.toastr.errorToastr("Please Select Location", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
      this.toastr.errorToastr("Please Select Account Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlProject == undefined || this.ddlProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlRef == undefined || this.ddlRef == "") {
      this.toastr.errorToastr("Please Select IPC Reference", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtTotalAmount == undefined || this.txtTotalAmount == "") {
      this.toastr.errorToastr("Please Enter Total Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlMode == undefined || this.ddlMode == "") {
      this.toastr.errorToastr("Please Select Mode of Acquistion", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDescription == undefined || this.txtDescription == "") {
      this.toastr.errorToastr("Please Enter Description", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlMode == "RMA") {
      if (this.txtMemo == undefined || this.txtMemo == "") {
        this.toastr.errorToastr("Please Enter Memo No", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.ddlPost == undefined || this.ddlPost == "") {
        this.toastr.errorToastr("Please Select Memo Issued By", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.dtpMemoDate == undefined) {
        this.toastr.errorToastr("Please Select Memo Date", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.file == undefined || this.file == "") {
        this.toastr.errorToastr("Please Choose Memo Document", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.txtSupplier == undefined || this.txtSupplier == "") {
        this.toastr.errorToastr("Please Enter Supplier Name", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.dtpSupplierInvoice == undefined) {
        this.toastr.errorToastr(
          "Please Select Supplier Invoice Date",
          "Error !",
          {
            toastTimeout: 2500,
          }
        );
        return false;
      } else if (
        this.txtSupInvoiceNo == undefined ||
        this.txtSupInvoiceNo == ""
      ) {
        this.toastr.errorToastr("Please Enter Supplier Invoice No", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      } else if (this.fileSup == undefined || this.fileSup == "") {
        this.toastr.errorToastr("Please Choose Supplier Document", "Error !", {
          toastTimeout: 2500,
        });
        return false;
      }
    } else {
      this.toastr.errorToastr("Else Condition", "Error !", {
        toastTimeout: 2500,
      });
      this.save();
    }
  }

  //main entery CRUD Operation
  chkAsset() {
    if (this.ddlLocation == undefined || this.ddlLocation == "") {
      this.toastr.errorToastr("Please Select Location", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
      this.toastr.errorToastr("Please Select Account Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlProject == undefined || this.ddlProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlRef == undefined || this.ddlRef == "") {
      this.toastr.errorToastr("Please Select IPC Reference", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtTotalAmount == undefined || this.txtTotalAmount == "") {
      this.toastr.errorToastr("Please Enter Total Amount", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.ddlMode == undefined || this.ddlMode == "") {
      this.toastr.errorToastr("Please Select Mode of Acquistion", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDescription == undefined || this.txtDescription == "") {
      this.toastr.errorToastr("Please Enter Description", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      if (this.ddlMode == "RMA") {
        if (this.txtMemo == undefined || this.txtMemo == "") {
          this.toastr.errorToastr("Please Enter Memo No", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.ddlPost == undefined || this.ddlPost == "") {
          this.toastr.errorToastr("Please Select Memo Issued By", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.dtpMemoDate == undefined) {
          this.toastr.errorToastr("Please Select Memo Date", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.file == undefined || this.file == "") {
          this.toastr.errorToastr("Please Choose Memo Document", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.txtSupplier == undefined || this.txtSupplier == "") {
          this.toastr.errorToastr("Please Enter Supplier Name", "Error !", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.dtpSupplierInvoice == undefined) {
          this.toastr.errorToastr(
            "Please Select Supplier Invoice Date",
            "Error !",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        } else if (
          this.txtSupInvoiceNo == undefined ||
          this.txtSupInvoiceNo == ""
        ) {
          this.toastr.errorToastr(
            "Please Enter Supplier Invoice No",
            "Error !",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        } else if (this.fileSup == undefined || this.fileSup == "") {
          this.toastr.errorToastr(
            "Please Choose Supplier Document",
            "Error !",
            {
              toastTimeout: 2500,
            }
          );
          return false;
        }
      }
    }
  }

  save() {
    alert("ok");
    this.lblPurchaseID = 1;
    this.clearPurchase();
  }

  savePurchase() {
    var supInvDate, memoDate;
    var purchaseDate = this.app.convertDate(this.dtpPurchase);
    var reqSpType = "INSERT";

    if (this.ddlMode == "RMA") {
      supInvDate = this.app.convertDate(this.dtpSupplierInvoice);
      memoDate = this.app.convertDate(this.dtpMemoDate);
    } else {
      supInvDate = null;
      memoDate = null;
    }

    if (this.lblPurchaseID > 0) {
      reqSpType = "UPDATE";
    }
    var SaveData = {
      subLocID: this.ddlLocation,
      officeSecID: this.ddlAccSec,
      projectID: this.ddlProject,
      iPcRef: this.ddlRef,
      purchaseDate: purchaseDate,
      totalAmount: this.txtTotalAmount,
      description: this.txtDescription,
      memoNo: this.txtMemo,
      memoDate: memoDate,
      memoIssuedBy: this.ddlPost,
      memoEDoc: this.imageUrl,
      memoEDocExtension: "pdf",
      memoImgFile: this.file,
      supplier: this.txtSupplier,
      supplierInvNo: this.txtSupInvoiceNo,
      supplierInVDate: supInvDate,
      supplierInvEDoc: this.imageUrlSup,
      supplierEDocExtension: "pdf",
      supplierImgFile: this.fileSup,
      modeofAcq: this.ddlMode,
      userid: this.cookie.get("userID"),
      SpType: reqSpType,
      purchaseID: this.lblPurchaseID,
    };
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    this.http
      .post(this.app.serverUrl + "crudPurchase", SaveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          if (this.lblPurchaseID == 0) {
            this.lblPurchaseID = data.purID;
          }
          if (this.selectAllAssetFields == true) {
            this.saveAsset();
          }
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          return false;
        }
      });
  }

  saveAsset() {
    alert(";ok");
    return;
    var vehicleID;
    var purchaseDate = this.app.convertDate(this.dtpPurchase);
    var reqSpType = "INSERT";

    if (this.lblPurchaseID > 0) {
      reqSpType = "UPDATE";
    }
    var SaveData = {
      subLocID: this.ddlLocation,
      officeTypeID: this.lblOfcTypeID,
      assetCatID: this.ddlAssetCat,
      assetNo: this.lblAssetNo,
      officeSecID: this.ddlOfcSec,
      postID: this.ddlPost,
      // assetLocation: this.asseLocation,
      assetDescription: this.txtAssetDesc,
      vehicleID: vehicleID,
      projectID: this.ddlProject,
      costAmount: this.txtCost,
      purchaseID: this.lblPurchaseID,
      purchaseDate: purchaseDate,
      iPCRef: this.ddlRef,
      make: this.make, //string
      model: this.model,
      size: this.size,
      generation: this.generation,
      processor: this.processor,
      ram: this.ram,
      driveType1: this.driveType1,
      HD1: this.hdSize1,
      driveType2: this.driveType2,
      HD2: this.hdSize2,
      Author: this.author,
      publisher: this.publisher,
      edition: this.edition,
      volume: this.volume,
      spType: reqSpType,
      userid: this.cookie.get("userID"),
      assetID: this.lblAssetID,
    };
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    this.http
      .post(this.app.serverUrl + "crudPurchaseAsset", SaveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          if (this.lblAssetID == 0) {
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
          this.clearAsset();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
          return false;
        }
      });
  }

  clearPurchase() {
    var loc = this.locList.filter((x) => x.subLocID == this.ddlLocation);
    this.lblLocation =
      loc[0].subLocationDescription +
      " - " +
      loc[0].subLocationDescription +
      " - " +
      loc[0].officeTypeDescription +
      " - " +
      loc[0].mainLocationDescription +
      " - " +
      loc[0].provinceName;

    var accSec = this.accSecList.filter((x) => x.officeSecID == this.ddlAccSec);
    this.lblAccountSection = accSec[0].officeDescription;

    var project = this.projectsList.filter(
      (x) => x.projectID == this.ddlProject
    );
    this.lblProject =
      project[0].projectShortName + " - " + project[0].projectName;

    var ipc = this.refList.filter((x) => x.ipcRefID == this.ddlRef);
    this.lblIPC = ipc[0].ipcRefDescription;

    this.lblPurchaseDt = this.dtpPurchase.toString();
    this.lblTotalAmount = this.txtTotalAmount;

    var mode = this.modeList.filter((x) => x.name == this.ddlMode);
    this.lblMode = mode[0].name;

    this.lblDescription = this.txtDescription;
    this.lblMemoNo = this.txtMemo;

    var memoIssued = this.postList.filter((x) => x.postID == this.ddlPost);
    this.lblMemoIssued = memoIssued[0].postName;

    this.lblMemoDt = this.dtpMemoDate.toString();
    this.lblSupplier = this.txtSupplier;
    this.lblSuppInvDt = this.dtpSupplierInvoice.toString();
    this.lblSuppInvNo = this.txtSupInvoiceNo;
  }

  clearAsset() {}

  clear() {
    this.lblPurchaseID = 0;
    this.ddlAccSec = "";
    this.ddlProject = "";
    this.ddlLocation = "";
    this.lblOfcType = "";
    this.dtpPurchase = new Date();
    this.txtDescription = "";
    this.txtMemo = "";
    this.ddlPost = "";
    this.dtpMemoDate = new Date();
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

    this.assetCatList = this.tempAssetCatList;
  }

  edit(item) {
    this.editMode = 1;

    this.lblPurchaseID = item.purchaseID;
    this.ddlAccSec = item.officeSecID.toString();
    this.ddlProject = item.projectID.toString();
    this.ddlLocation = item.landMeasureTypeID.toString();
    this.lblOfcType = item.officeType;
    this.filterIPC(this.ddlProject);
    this.dtpPurchase = new Date(item.dtpPurchase);
    this.txtDescription = item.presentUse;
    this.txtMemo = item.dateofNationalization;
    this.ddlPost = item.costOfLand;
    this.dtpMemoDate = new Date(item.dtpMemoDate);
    this.txtSupplier = item.areaTransferedMarla;
    this.dtpSupplierInvoice = new Date(item.remarks);
    this.txtSupplier = item.remarks;

    this.toggleView = "form";
  }

  editAsset(item) {
    this.editMode = 1;

    this.lblPurchaseID = item.purchaseID;
    this.ddlAccSec = item.officeSecID.toString();
    this.ddlProject = item.projectID.toString();
    this.ddlLocation = item.landMeasureTypeID.toString();
    this.lblOfcType = item.officeType;
    this.filterIPC(this.ddlProject);
    this.dtpPurchase = new Date(item.dtpPurchase);
    this.txtDescription = item.presentUse;
    this.txtMemo = item.dateofNationalization;
    this.ddlPost = item.costOfLand;
    this.dtpMemoDate = new Date(item.dtpMemoDate);
    this.txtSupplier = item.areaTransferedMarla;
    this.dtpSupplierInvoice = new Date(item.remarks);
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
            purchaseID: item.purchaseID,
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

  deleteAsset(item) {
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
            assetID: item.assetID,
            Userid: this.cookie.get("userID"),
            SpType: "DELETE",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.app.serverUrl + "crudPurchaseAsset", SaveData, {
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
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getipc?ProjectId=" + reqProjectID, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.refList = data;
      });
  }

  filterOfficeType(subLoc) {
    var officeType = this.locList.filter((x) => x.subLocID == subLoc);

    this.lblOfcType = officeType[0].officeTypeDescription;
    this.lblOfcTypeID = officeType[0].officeTypeID;

    this.getAccSec(this.lblOfcTypeID);
    this.getOfcSection(this.lblOfcTypeID);
    this.getAssetNo();
  }

  openPDFFile() {
    window.open(this.imageUrl);
  }

  openPDFFileSup() {
    window.open(this.imageUrlSup);
  }
}
