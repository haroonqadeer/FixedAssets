import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { map, startWith } from "rxjs/operators";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { Observable } from "rxjs";
import { AppComponent } from "src/app/app.component";
import * as XLSX from "xlsx";
import html2canvas from "html2canvas";
import * as jsPDF from "jspdf";
// import "sweetalert2/src/sweetalert2.scss";

declare var $: any;

// const Swal = require("sweetalert2");

@Component({
  selector: "app-asset-entry",
  templateUrl: "./asset-entry.component.html",
  styleUrls: ["./asset-entry.component.scss"],
})
export class AssetEntryComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://localhost:12345/api/";
  // serverUrl = "http://localhost:5090/api/";

  loadingBar = true;
  //pagination variables for tag list
  tagItemPerPage = "10";
  tagP = 1;

  //pagination variables for main table (asset detail list)
  mainTableItemPerPage = "10";
  mainTableP = 1;

  //pagination variables for previous tag modal window table (old tag list)
  preTagItemPerPage = "10";
  preTagP = 1;

  //* variables for orderby pipe
  order = "info.name";
  reverse = false;
  sortedCollection: any[];

  imgVehiclePath = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/vehicleImg";
  imageVehicleUrl: string =
    "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageVehicle;
  imgFileVehicle;
  selectedVehicleFile: File = null;
  lblFileName = "";

  imgTransPath = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/transferImg";
  imageTransUrl: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageTrans;
  imgFileTrans;
  selectedTransFile: File = null;

  imgAssetPath = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/assetEntryImg";
  imageAssetUrl: string = "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageAsset;
  imgFileAsset;
  selectedAssetFile: File = null;

  imgAssetPath2 = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/assetEntryImg";
  imageAssetUrl2: string =
    "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageAsset2;
  imgFileAsset2;
  selectedAssetFile2: File = null;

  imgAssetPath3 = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/assetEntryImg";
  imageAssetUrl3: string =
    "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageAsset3;
  imgFileAsset3;
  selectedAssetFile3: File = null;

  editMode = true;
  hidden = false;
  disableOfcType = true;
  disableProject = true;
  disableCustody = false;
  disableTag = false;
  disableAssetCat = false;

  txtPin = "";
  assetID = "";
  assetNo = "";
  rdbAsset = "";
  cmbCustody = "";
  cmbVehicle = "";
  cmbWngSection = "";
  cmbTransWngSection = "";
  cmbOfcType = "";
  cmbTransOfcType = "";
  cmbLocation = "";
  cmbTransLocation = "";
  cmbAssetCat = "";
  txtAssetDesc = "";
  txtAssetLoc = "";
  txtIdentification = "";
  txtSerialNo = "";
  cmbProject = "";
  cmbRef = "";
  txtAmount = "";
  txtPreTag = "";
  txtNetBVal = "";
  cmbAssetCond = "";
  txtRemarks = "";
  dtpPurchaseDt;
  dtpTransferDt;
  cmbSearchOfcType = "";
  cmbSearchLocation = "";
  cmbSearchWngSection = "";
  cmbResetField = "";
  cmbTransferProject = "";
  cmbTransToPost = "";
  cmbTransByPost = "";

  rdbTransType = "";
  txtRegNo = "";
  cmbMake = "";
  cmbModel = "";
  cmbType = "";
  txtEngine = "";
  txtChasis = "";
  txtTagNo = "1";
  txtTransDesc = "";
  txtDeploy = "";
  vehID = "";
  cmbVehicleAssetCat = "";

  lblAssetCatID = "";
  lblLocID = "";
  lblOfcTypeID = "";
  lblSectionID = "";
  lblAccCategory = "";
  lblAssetCategory = "";
  lblLocation = "";
  lblOfficeType = "";
  lblSection = "";
  lblDepRule = "";
  lblBaseRate = "";
  lblTransferID = "";
  lblTransToComp = "";
  lblTransByComp = "";
  lblTransByPost = "";

  sldUsable = false;
  disableUsable = false;
  sldServiceable = false;
  disableServiceable = false;
  sldSurplus = false;
  disableSurplus = false;
  sldCondemned = false;
  disableCondemned = false;
  disableChkCustody = false;
  sldMissing = false;
  sldTransfered = false;
  chkTag = false;
  chkProject = false;
  chkassetLoc = false;
  chkCustody = false;
  disableFields = false;

  tblSearchTag = "";
  tblSearchTrans = "";
  tblSearch = "";
  searchLocation = "";
  searchTransLocation = "";
  searchMake = "";
  searchModel = "";
  searchType = "";
  searchCategory = "";
  searchCustody = "";
  searchProject = "";
  searchRef = "";
  searchVehicle = "";
  searchSection = "";
  searchTransSection = "";
  advSearchSection = "";
  advSearchLocation = "";
  searchTransProject = "";
  searchPostTo = "";
  searchPostBy = "";
  searchVehicleAssetCat = "";

  oldTagList = [];
  tagList = [];
  locList = [];
  locTransList = [];
  ofcTypeList = [];
  ofcTypeTransList = [];
  wngSectionList = [];
  wngSectTransList = [];
  vehicleList = [];
  custodyList = [];
  transferByList = [];
  transferToList = [];
  AssetCatList = [];
  tempAssetCatList = [];
  projectList = [];
  transferProjectList = [];
  refList = [];
  preTagList = [];
  assetCondList = [];
  assetDetailList = [];
  tempDetailList = [];
  transferList = [];
  tempTransList = [];
  transDetailList = [];
  vehAssetCatList = [];

  vehMakeList = [];
  vehModelList = [];
  vehTypeList = [];

  objList = [];
  paramType = "";

  toggleView = "form";
  regionName = "";
  locationName = "";
  officeName = "";

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent
  ) {}

  // multiple image setting
  // name = "Angular 4";
  urls = [];
  onSelectFile(event) {
    // alert(this.urls.length);
    if (event.target.files && event.target.files[0]) {
      var filesAmount = event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();

        reader.onload = (event: any) => {
          console.log(event.target.result);
          this.urls.push(event.target.result);
        };

        reader.readAsDataURL(event.target.files[i]);
      }
    }
  }

  clearTags() {
    debugger;
    // alert(this.locList);
    setTimeout(() => {
      Swal.fire({
        title: "Do you want to reset tag list?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          var saveData = {
            userId: this.cookie.get("userID"),
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "resettaglist", saveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              this.getTags();
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire("Cancelled", "", "error");
        }
      });
    }, 0);
  }
  printTags() {
    // setTimeout(() => {
    //   Swal.fire({
    //     title: "Do you want to reset tag list?",
    //     text: "",
    //     icon: "warning",
    //     showCancelButton: true,
    //     confirmButtonText: "Yes",
    //     cancelButtonText: "No",
    //   }).then((result) => {
    //     if (result.value) {
    //       var saveData = {
    //         userId: this.cookie.get("userID"),
    //       };

    //       var reqHeader = new HttpHeaders({
    //         "Content-Type": "application/json",
    //       });

    //       this.http
    //         .post(this.serverUrl + "resettaglist", saveData, {
    //           headers: reqHeader,
    //         })
    //         .subscribe((data: any) => {
    //           this.getTags();
    //         });
    //     } else if (result.dismiss === Swal.DismissReason.cancel) {
    //       Swal.fire("Cancelled", "", "error");
    //     }
    //   });
    // }, 1000);

    var printCss = this.printCSS();

    var contents = $("#tagDiv").html();

    var frame1 = $("<iframe />");
    frame1[0].name = "frame1";
    frame1.css({ position: "absolute", top: "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
      ? frame1[0].contentDocument.document
      : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    frameDoc.document.write(
      "<html><head><title>DIV Contents</title>" +
        "<style>" +
        printCss +
        "</style>"
    );

    //Append the external CSS file. <link rel="stylesheet" href="../../../styles.scss" /> <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    frameDoc.document.write(
      '<style type="text/css" media="print">/*@page { size: landscape; }*/</style>'
    );
    frameDoc.document.write(
      '<link rel="stylesheet" href="../../../assets/css/styles.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write(
      '<link rel="stylesheet" href="../../../../assets/css/bootstrap.min.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write("</head><body>");

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write("</body></html>");

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      frame1.remove();
    }, 500);
  }

  pushTag(obj, event) {
    if (this.tagList.length == 0) {
      this.tagList.push({
        tempid: obj.tempid,
        tag: obj.tag,
        assetLocation: obj.assetLocation,
        custody: obj.custody,
        assetId: obj.assetId,
      });
    } else {
      if (event == "A") {
        var tags = this.tagList.filter((x) => x.tag == obj.tag);
        if (tags.length == 0) {
          this.tagList.push({
            tempid: obj.tempid,
            tag: obj.tag,
            assetLocation: obj.assetLocation,
            custody: obj.custody,
            assetId: obj.assetId,
          });
        }
      } else {
        var tags = this.tagList.filter((x) => x.tag == obj.tag);
        if (tags.length != 0) {
          const index = this.tagList.findIndex((x) => x.tag === obj.tag);
          if (index > -1) {
            this.tagList.splice(index, 1);
          }
        }
      }
    }
  }

  public printCSS() {
    var commonCss =
      ".commonCss{font-family: Arial, Helvetica, sans-serif; text-align: center; }";

    var cssHeading = ".cssHeading {font-size: 25px; font-weight: bold;}";
    var cssAddress = ".cssAddress {font-size: 16px; }";
    var cssContact = ".cssContact {font-size: 16px; }";

    var tableCss =
      "table {width: 100%; border-collapse: collapse;}    table thead tr th {text-align: left; font-family: Arial, Helvetica, sans-serif; font-weight: bole; border-bottom: 1px solid black; margin-left: -3px;}     table tbody tr td {font-family: Arial, Helvetica, sans-serif; border-bottom: 1px solid #ccc; margin-left: -3px; height: 33px;}";

    var printCss = commonCss + cssHeading + cssAddress + cssContact + tableCss;

    return printCss;
  }

  ngOnInit(): void {
    this.rdbAsset = "1";
    this.disableOfcType = true;
    this.getAssetDetail();
    this.getTags();
    this.getLocation();
    this.getTransLocation();
    this.getOfficeType();
    this.getVehicle();
    this.getCustody();
    this.getAssetCategory();
    this.getProject();
    this.getAssetCondition();
    this.getVehicleMake();
    this.getVehicleModel();
    this.getVehicleType();
    this.getOldTags();
    this.getTransfer();
    $("#assetRegister").hide();
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  toggleViewClick() {
    if (this.toggleView == "table") {
      this.toggleView = "form";
    } else {
      this.toggleView = "table";
    }
  }

  getPrevTag(item) {
    this.txtPreTag = item.tag;
    $("#tagModal").modal("hide");
  }

  getOldTags() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getoldtagdata", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.oldTagList = data;
        //alert(data.length);
      });
  }

  getTransfer() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getassettransfer", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.transferList = data.filter((x) => x.projectID == null);
        this.tempTransList = data;
      });
  }

  filterTansTable(tranProject) {
    this.sldTransfered = false;
    this.lblTransferID = "";
    this.clearTransfer();
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    this.lblTransByPost = "";
    this.lblTransferID = "";

    this.disableProject = true;
    this.disableCustody = false;

    this.transferList = this.tempTransList;
    this.transferList = this.transferList.filter(
      (x) => x.projectID == tranProject
    );
  }

  getTags() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "gettags?UserId=" + this.cookie.get("userID"), {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.tagList = data;
        this.tagList.reverse();
      });
  }

  getIPC() {
    // this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getipc?ProjectId=" + this.cmbProject, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.refList = data;
        // this.loadingBar = false;
      });
  }

  getTransLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      // .get(this.serverUrl + "getsubloc", { headers: reqHeader })
      .get(this.serverUrl + "getsubLoc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.locTransList = data;
      });
  }

  getLocation() {
    debugger;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    if (this.cookie.get("roleName") == "Super User") {
      this.http
        // .get(this.serverUrl + "getsubloc", { headers: reqHeader })
        .get(this.serverUrl + "getsubloc", { headers: reqHeader })
        .subscribe((data: any) => {
          // this.locList = data.filter((x) => x.isActivated == 1);
          this.locList = data;
        });
    } else {
      this.http
        // .get(this.serverUrl + "getsubloc", { headers: reqHeader })
        .get(
          this.serverUrl +
            "getuserLocation?userId=" +
            this.cookie.get("userID"),
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          // this.locList = data.filter((x) => x.isActivated == 1);
          this.locList = data;
        });
    }
  }

  showOfficeType() {
    var ofcType = this.locList.filter((x) => x.subLocID == this.cmbLocation);
    this.cmbOfcType = ofcType[0].officeTypeID;

    this.getWingSection(this.cmbOfcType);
  }

  showTransOfcType() {
    var ofcType = this.locTransList.filter(
      (x) => x.subLocID == this.cmbTransLocation
    );
    this.cmbTransOfcType = ofcType[0].officeTypeID;

    this.getTransWingSection(this.cmbTransOfcType);
  }

  showSearchOfficeType() {
    var ofcType = this.locList.filter(
      (x) => x.subLocID == this.cmbSearchLocation
    );
    this.cmbSearchOfcType = ofcType[0].officeTypeID;

    this.getWingSection(this.cmbSearchOfcType);
  }

  getOfficeType() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getofctype", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ofcTypeList = data;
        this.ofcTypeTransList = data;
      });
  }

  getWingSection(obj) {
    this.cmbWngSection = "";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getwingsec?officeTypeID=" + obj, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        // this.wngSectionList = data.filter((x) => x.isActivated == 1);
        this.wngSectionList = data;
      });
  }

  getTransWingSection(obj) {
    this.cmbTransWngSection = "";
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getwingsec?officeTypeID=" + obj, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        // this.wngSectionList = data.filter((x) => x.isActivated == 1);
        this.wngSectTransList = data;
      });
  }

  getVehicle() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getvehicles", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehicleList = data;
      });
  }

  getCustody() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getposts", { headers: reqHeader })
      .subscribe((data: any) => {
        // this.custodyList = data.filter((x) => x.isActivated == 1);
        this.custodyList = data;
        // this.transferByList = data.filter((x) => x.isActivated == 1);
        this.transferByList = data;
        // this.transferToList = data.filter((x) => x.isActivated == 1);
        this.transferToList = data;
      });
  }

  getAssetCategory() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getassetcat", { headers: reqHeader })
      .subscribe((data: any) => {
        this.AssetCatList = data;
        this.vehAssetCatList = data.filter(
          (x) => x.accountsCatagoryDisplay == "VEHICLES"
        );
        this.tempAssetCatList = data;
      });
  }

  getProject() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getprojects", { headers: reqHeader })
      .subscribe((data: any) => {
        this.projectList = data;
        this.transferProjectList = data;
        // this.projectList = data.filter((x) => x.isActivated == 1);
        // this.transferProjectList = data.filter((x) => x.isActivated == 1);
        this.loadingBar = false;
      });
  }

  getAssetCondition() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getassetcondition", { headers: reqHeader })
      .subscribe((data: any) => {
        this.assetCondList = data;
      });
  }

  getVehicleMake() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getvehiclemake", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehMakeList = data;
      });
  }

  getVehicleModel() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getvehiclemodel", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehModelList = data;
      });
  }

  getVehicleType() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getvehicletype", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehTypeList = data;
      });
  }

  getAssetCatDescription(assetCatID) {
    if (this.cmbAssetCat != "" || this.cmbAssetCat != undefined) {
      var assetCat = this.AssetCatList.filter(
        (x) => x.assetCatID == assetCatID
      );
      this.txtAssetDesc = assetCat[0].assetCatDescription;
      this.lblAccCategory = assetCat[0].accountsCatagory;
      this.lblDepRule = assetCat[0].depreciationRule;
      this.lblBaseRate = assetCat[0].baseRate;
    }
  }

  getAssetNo() {
    if (
      this.cmbLocation != "" &&
      this.cmbOfcType != "" &&
      this.cmbAssetCat != ""
    ) {
      var saveData = {
        SubLocID: this.cmbLocation,
        OfficeTypeID: this.cmbOfcType,
        AssetCatID: this.cmbAssetCat,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "getassetno", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          this.assetNo = data.msg;
        });
    }
  }

  getAssetDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    if (this.cookie.get("roleName") == "Super User") {
      this.http
        .get(this.serverUrl + "getassetdetail", { headers: reqHeader })
        .subscribe((data: any) => {
          this.assetDetailList = data;
          this.tempDetailList = data;
          // this.assetDetailList.reverse();
          // this.tempDetailList.reverse();

          for (var i = 0; i < this.tagList.length; i++) {
            for (var j = 0; j < this.assetDetailList.length; j++) {
              if (this.tagList[i].tag == this.assetDetailList[j].tag) {
                this.assetDetailList[j].checkbox = true;
              }
            }
            for (var j = 0; j < this.tempDetailList.length; j++) {
              if (this.tagList[i].tag == this.tempDetailList[j].tag) {
                this.tempDetailList[j].checkbox = true;
              }
            }
          }
        });
    } else {
      this.http
        .get(
          this.serverUrl +
            "getuserassetdetail?UserId=" +
            this.cookie.get("userID"),
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.assetDetailList = data;
          this.tempDetailList = data;
          this.assetDetailList.reverse();
          this.tempDetailList.reverse();

          for (var i = 0; i < this.tagList.length; i++) {
            for (var j = 0; j < this.assetDetailList.length; j++) {
              if (this.tagList[i].tag == this.assetDetailList[j].tag) {
                this.assetDetailList[j].checkbox = true;
              }
            }
            for (var j = 0; j < this.tempDetailList.length; j++) {
              if (this.tagList[i].tag == this.tempDetailList[j].tag) {
                this.tempDetailList[j].checkbox = true;
              }
            }
          }
        });
    }
  }

  editAsset(item) {
    this.imageAsset = undefined;
    this.imgFileAsset = undefined;
    this.selectedAssetFile = null;
    this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset2 = undefined;
    this.imgFileAsset2 = undefined;
    this.selectedAssetFile2 = null;
    this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset3 = undefined;
    this.imgFileAsset3 = undefined;
    this.selectedAssetFile3 = null;
    this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    if (item.vehicleID == 0) {
      this.rdbAsset = "1";
    } else {
      this.rdbAsset = "2";
      this.cmbVehicle = item.vehicleID;
    }
    this.disableFields = true;
    this.disableTag = true;

    this.lblAssetCatID = item.assetCatID;
    this.lblLocID = item.subLocID;
    this.lblOfcTypeID = item.officeTypeID;
    this.lblSectionID = item.officeSecID;

    this.lblAssetCategory = item.assetCatDescription;
    this.lblLocation = item.subLocationDescription;
    this.lblOfficeType = item.officeTypeDescription;
    this.lblSection = item.officeDescription;
    this.lblAccCategory = item.accountsCatagory;
    this.lblDepRule = item.depreciationRule;
    this.lblBaseRate = item.baseRate;

    this.cmbLocation = item.subLocID;
    this.cmbOfcType = item.officeTypeID;
    this.cmbWngSection = item.officeSecID;
    this.assetNo = item.assetNo;
    this.assetID = item.assetID;
    this.cmbCustody = item.postID;
    this.cmbAssetCat = item.assetCatID;
    this.txtAssetDesc = item.assetDescription;
    this.txtAssetLoc = item.assetLocation;
    this.txtIdentification = item.otherIdentification;
    this.txtSerialNo = item.serialNo;
    this.cmbProject = item.projectID;
    this.cmbRef = item.ipcRef;

    this.getIPC();

    if (item.purchaseDate != null) {
      this.dtpPurchaseDt = new Date(item.purchaseDate);
    }

    this.txtAmount = item.costAmount;
    this.txtPreTag = item.previousTag;
    this.txtNetBVal = item.netBookAmount;
    this.cmbAssetCond = item.assetCondition;
    this.sldUsable = item.isUseable;
    this.sldServiceable = item.isServiceAble;
    this.sldSurplus = item.isSurplus;
    this.sldCondemned = item.isCondemned;
    this.sldMissing = item.isMissing;
    this.txtRemarks = item.remarks;
    if (
      item.eDoc != null ||
      item.eDoc != "C:/inetpub/wwwroot/2008_FAR_Proj/assets/assetEntryImg"
    ) {
      this.imageAssetUrl =
        "http://95.217.206.195:2008/assets/assetEntryImg/" +
        item.assetID +
        "_1.jpg";
    }
    if (
      item.eDoc2 != null ||
      item.eDoc2 != "C:/inetpub/wwwroot/2008_FAR_Proj/assets/assetEntryImg"
    ) {
      this.imageAssetUrl2 =
        "http://95.217.206.195:2008/assets/assetEntryImg/" +
        item.assetID +
        "_2.jpg";
    }
    if (
      item.eDoc3 != null ||
      item.eDoc3 != "C:/inetpub/wwwroot/2008_FAR_Proj/assets/assetEntryImg"
    ) {
      this.imageAssetUrl3 =
        "http://95.217.206.195:2008/assets/assetEntryImg/" +
        item.assetID +
        "_3.jpg";
    }

    this.lblTransferID = item.transferID;
    this.sldTransfered = item.isTransfered;

    var trans = this.tempTransList.filter(
      (x) => x.transferID == this.lblTransferID
    );

    if (trans.length != 0) {
      this.lblTransByPost = trans[0].transfee;
      this.lblTransByComp = trans[0].transfeeCompany;
    }

    if (this.sldMissing) {
      this.disableUsable = true;
      this.sldUsable = false;
      this.disableServiceable = true;
      this.sldServiceable = false;
      this.disableSurplus = true;
      this.sldSurplus = false;
      this.disableCondemned = true;
      this.sldCondemned = false;
    } else if (!this.sldMissing) {
      this.disableUsable = false;
      this.disableServiceable = false;
      this.disableSurplus = false;
      this.disableCondemned = false;
    }

    this.toggleView = "form";
  }

  public convertDate(myDate) {
    var oldDate = new Date(myDate);
    var d = oldDate.getDate();
    var m = oldDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var convertedDate = m + "-" + d + "-" + y;

    return convertedDate;
  }

  save() {
    if (this.cmbLocation == "") {
      this.toastr.errorToastr(
        "Please Select Province Location & Sub Location",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbOfcType == "") {
      this.toastr.errorToastr("Please Select Office Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbWngSection == "") {
      this.toastr.errorToastr("Please Select Wing Section", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.rdbAsset == "") {
      this.toastr.errorToastr("Please Select Asset Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbAssetCat == "") {
      this.toastr.errorToastr("Please Select Asset Category", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAssetDesc == "") {
      this.toastr.errorToastr("Please Enter Asset Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAssetLoc == "") {
      this.toastr.errorToastr("Please Enter Asset Location", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.sldUsable == false &&
      this.sldServiceable == false &&
      this.sldSurplus == false &&
      this.sldCondemned == false &&
      this.sldMissing == false &&
      this.sldTransfered == false
    ) {
      this.toastr.errorToastr("Please Select Asset Group", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var vehicleID;
      if (this.rdbAsset == "1") {
        vehicleID = null;
      } else {
        if (this.cmbVehicle == "") {
          this.toastr.errorToastr("Please Select Vehicle", "Error", {
            toastTimeout: 2500,
          });
          return false;
        } else {
          vehicleID = parseInt(this.cmbVehicle);
        }
      }

      if (this.sldMissing == false) {
        if (this.cmbCustody == "") {
          this.toastr.errorToastr("Please Select Custody", "Error", {
            toastTimeout: 2500,
          });
          return false;
        } else if (this.cmbAssetCond == "") {
          this.toastr.errorToastr("Please Select Asset Condition", "Error", {
            toastTimeout: 2500,
          });
          return false;
        }
      } else {
        this.cmbCustody = null;
        this.cmbAssetCond = null;
      }

      if (this.lblTransferID == "") {
        this.lblTransferID = "0";
      }

      var purchaseDate;
      var saveData;
      var ipcRef;
      var transferID;
      var projectID;
      if (this.cmbProject == "") {
        projectID = null;
      } else {
        projectID = parseInt(this.cmbProject);
        if (this.cmbRef == "" || this.cmbRef == null) {
          this.toastr.errorToastr("Please Select IPC Reference", "Error", {
            toastTimeout: 2500,
          });
          return false;
        }
      }

      this.loadingBar = true;

      if (this.lblTransferID == "") {
        transferID = null;
      } else {
        transferID = parseInt(this.lblTransferID);
      }
      if (this.dtpPurchaseDt == undefined || this.dtpPurchaseDt == "") {
        purchaseDate = null;
      } else {
        purchaseDate = this.convertDate(this.dtpPurchaseDt);
      }

      if (this.cmbRef == "" || this.cmbRef == null) {
        ipcRef = null;
      } else {
        ipcRef = parseInt(this.cmbRef);
      }
      if (this.txtAmount == "") {
        this.txtAmount = "0";
      }
      if (this.txtNetBVal == "") {
        this.txtNetBVal = "0";
      }
      if (this.cmbProject == "") {
        this.cmbProject = "0";
      }
      var imgAsset, imgAsset2, imgAsset3;
      var imgPath, imgPath2, imgPath3;
      if (this.imageAsset == undefined) {
        imgAsset = null;
        imgPath = null;
      } else {
        imgAsset = this.imageAsset;
        imgPath = this.imgAssetPath;
      }
      if (this.imageAsset2 == undefined) {
        imgAsset2 = null;
        imgPath2 = null;
      } else {
        imgAsset2 = this.imageAsset2;
        imgPath2 = this.imgAssetPath2;
      }

      if (this.imageAsset3 == undefined) {
        imgAsset3 = null;
        imgPath3 = null;
      } else {
        imgAsset3 = this.imageAsset3;
        imgPath3 = this.imgAssetPath3;
      }

      if (this.assetID == "") {
        // alert(parseInt(this.cmbLocation)); //int
        // alert(parseInt(this.cmbOfcType)); //int
        // alert(parseInt(this.cmbAssetCat)); //int
        // alert(parseInt(this.assetNo)); //int
        // alert(parseInt(this.cmbWngSection)); //int
        // alert(parseInt(this.cmbCustody)); //int
        // alert(this.txtAssetLoc); //string
        // alert(this.txtAssetDesc); //string
        // alert(this.txtIdentification); //string
        // alert(this.txtSerialNo); //string
        // alert(vehicleID); //int
        // alert(projectID); //int
        // alert(this.txtPreTag); //string
        // alert(this.txtAmount); //float
        // alert(this.txtNetBVal); //int
        // alert(purchaseDate); //string
        // alert(ipcRef); //string
        // alert(this.cmbAssetCond); //int
        // alert(this.sldUsable); //bool
        // alert(this.sldSurplus); //bool
        // alert(this.sldServiceable); //bool
        // alert(this.sldCondemned); //bool
        // alert(this.sldMissing); //bool
        // alert(this.sldTransfered); //bool
        // alert(this.txtRemarks); //string
        // alert(this.cookie.get("userID")); //int
        // alert(purchaseDate); //date
        // alert("Insert"); //string
        // alert(0); //int
        // alert(parseInt(this.txtTagNo)); //int
        // alert(this.imgAssetPath);
        // alert("jpg");
        // alert(imgAsset);
        // alert(transferID); // int

        saveData = {
          SubLocID: parseInt(this.cmbLocation), //int
          OfficeTypeID: parseInt(this.cmbOfcType), //int
          AssetCatID: parseInt(this.cmbAssetCat), //int
          AssetNo: parseInt(this.assetNo), //int
          OfficeSecID: parseInt(this.cmbWngSection), //int
          PostID: parseInt(this.cmbCustody), //int
          AssetLocation: this.txtAssetLoc, //string
          AssetDescription: this.txtAssetDesc, //string
          otherIdentification: this.txtIdentification, //string
          SerialNo: this.txtSerialNo, //string
          VehicleID: vehicleID, //int
          ProjectID: projectID, //int
          PreviousTag: this.txtPreTag, //string
          costAmount: this.txtAmount, //float
          NetBookAmount: this.txtNetBVal, //int
          PurchaseDate: purchaseDate, //string
          IPCRef: ipcRef, //string
          AssetCondition: this.cmbAssetCond, //int
          IsUseable: this.sldUsable, //bool
          IsSurplus: this.sldSurplus, //bool
          IsServiceAble: this.sldServiceable, //bool
          IsCondemned: this.sldCondemned, //bool
          IsMissing: this.sldMissing, //bool
          isTransfer: this.sldTransfered, //bool
          Remarks: this.txtRemarks, //string
          Userid: this.cookie.get("userID"), //int
          IsDeleted: 0, //bool
          DeletionDate: purchaseDate, //date
          DeleteBy: 0, //int
          IsUpdated: 0, //int
          UpdatedDate: null, //date
          Updatedby: 0, //int
          SpType: "Insert", //string
          AssetID: 0, //int
          Qty: parseInt(this.txtTagNo), //int
          EDoc: imgPath,
          EDoc2: imgPath2,
          EDoc3: imgPath3,
          EDocExtension: "jpg",
          imgFile: imgAsset,
          imgFile2: imgAsset2,
          imgFile3: imgAsset3,
          TransferID: transferID, // int
        };
      } else {
        // var imgAsset;
        // if (this.imageAsset == undefined) {
        //   imgAsset = null;
        // } else {
        //   imgAsset = this.imageAsset;
        // }

        saveData = {
          SubLocID: parseInt(this.lblLocID), //int
          OfficeTypeID: parseInt(this.lblOfcTypeID), //int
          AssetCatID: parseInt(this.lblAssetCatID), //int
          AssetNo: parseInt(this.assetNo), //int
          OfficeSecID: parseInt(this.lblSectionID), //int
          PostID: parseInt(this.cmbCustody), //int
          AssetLocation: this.txtAssetLoc, //string
          AssetDescription: this.txtAssetDesc, //string
          otherIdentification: this.txtIdentification, //string
          SerialNo: this.txtSerialNo, //string
          VehicleID: vehicleID, //int
          ProjectID: projectID, //int
          PreviousTag: this.txtPreTag, //string
          costAmount: this.txtAmount, //float
          NetBookAmount: this.txtNetBVal, //int
          PurchaseDate: purchaseDate, //string
          IPCRef: ipcRef, //string
          AssetCondition: this.cmbAssetCond, //int
          IsUseable: this.sldUsable, //bool
          IsSurplus: this.sldSurplus, //bool
          IsServiceAble: this.sldServiceable, //bool
          IsCondemned: this.sldCondemned, //bool
          IsMissing: this.sldMissing, //bool
          isTransfer: this.sldTransfered, //bool
          Remarks: this.txtRemarks, //string
          Userid: this.cookie.get("userID"), //int
          IsDeleted: 0, //bool
          DeletionDate: purchaseDate, //date
          DeleteBy: 0, //int
          IsUpdated: 1, //int
          UpdatedDate: purchaseDate, //date
          Updatedby: 1, //int
          SpType: "Update", //string
          AssetID: this.assetID, //int
          Qty: this.txtTagNo, //int
          EDoc: imgPath,
          EDoc2: imgPath2,
          EDoc3: imgPath3,
          EDocExtension: "jpg",
          imgFile: imgAsset,
          imgFile2: imgAsset2,
          imgFile3: imgAsset3,
          TransferID: transferID, // int
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "saveasset", saveData, {
          // .post("http://localhost:5090/api/saveasset", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.assetID == "") {
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

            this.disableCustody = false;
            this.disableCustody = false;
            if (this.chkCustody == false) {
              this.cmbCustody = "";
            }
            if (this.chkProject == false) {
              this.cmbProject = "";
            }

            if (this.chkassetLoc == false) {
              this.txtAssetLoc = "";
            }
            this.clear();
            this.getAssetDetail();
            this.getTags();
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

  saveVehicle() {
    if (this.txtRegNo == "") {
      this.toastr.errorToastr("Please Enter Registration No.", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbMake == "") {
      this.toastr.errorToastr("Please Select Make / Brand", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbModel == "") {
      this.toastr.errorToastr("Please Select Model", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbType == "") {
      this.toastr.errorToastr("Please Select Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbVehicleAssetCat == "") {
      this.toastr.errorToastr("Please Select Asset Category", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtEngine == "") {
      this.toastr.errorToastr("Please Enter Engine No.", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtChasis == "") {
      this.toastr.errorToastr("Please Enter Chasis No.", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDeploy == "") {
      this.toastr.errorToastr("Please Enter Deployed With", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;

      this.imgVehiclePath =
        "C:/inetpub/wwwroot/2008_FAR_Proj/assets/vehicleImg";
      if (this.imageVehicle == undefined) {
        this.imgVehiclePath = null;
        this.imageVehicle = null;
      }
      // alert(this.imgVehiclePath);
      // alert(this.imageVehicle);
      if (this.vehID == "") {
        saveData = {
          assetCatID: parseInt(this.cmbVehicleAssetCat),
          VehID: this.txtRegNo,
          Make: this.cmbMake,
          Model: this.cmbModel,
          Type: this.cmbType,
          ChasisNum: this.txtChasis,
          EngineNum: this.txtEngine,
          deployedWith: this.txtDeploy,
          eDoc: this.imgVehiclePath,
          eDocExtension: "pdf",
          imgFile: this.imageVehicle,
          ID: 0,
          Userid: this.cookie.get("userID"),
          SPType: "Insert",
        };
      } else {
        saveData = {
          assetCatID: parseInt(this.cmbVehicleAssetCat),
          VehID: this.txtRegNo,
          Make: this.cmbMake,
          Model: this.cmbModel,
          Type: this.cmbType,
          ChasisNum: this.txtChasis,
          EngineNum: this.txtEngine,
          deployedWith: this.txtDeploy,
          eDoc: this.imgVehiclePath,
          eDocExtension: "pdf",
          imgFile: this.imageVehicle,
          ID: this.vehID,
          Userid: this.cookie.get("userID"),
          SPType: "Update",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "savevehicle", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.vehID == "") {
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

            this.clearVehicle();
            this.getVehicle();
            $("#vehicleModal").modal("hide");

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
          var saveData = {
            Userid: this.cookie.get("userID"), //int
            SpType: "Delete", //string
            AssetID: item.assetID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "saveasset", saveData, {
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
                this.getAssetDetail();

                const index = this.tagList.findIndex((x) => x.tag === item.tag);
                if (index > -1) {
                  this.tagList.splice(index, 1);
                }

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
      });
    }, 1000);
  }

  clear() {
    this.clearTransfer();
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    this.lblTransByPost = "";
    this.lblTransferID = "";

    this.disableTag = false;
    this.disableCustody = false;

    this.disableFields = false;
    this.disableCustody = false;
    this.chkTag = false;
    this.lblLocID = "";
    this.lblOfcTypeID = "";
    this.lblAssetCatID = "";
    this.lblSectionID = "";

    this.txtTagNo = "1";
    this.lblAssetCategory = "";
    this.lblLocation = "";
    this.lblOfficeType = "";
    this.lblSection = "";
    this.assetID = "";
    this.rdbAsset = "1";
    this.cmbVehicle = "";
    this.cmbAssetCat = "";
    this.txtAssetDesc = "";
    this.txtIdentification = "";
    this.txtSerialNo = "";
    this.cmbRef = "";
    this.dtpPurchaseDt = "";
    this.txtAmount = "";
    this.txtPreTag = "";
    this.txtNetBVal = "";
    this.cmbAssetCond = "";
    this.sldUsable = false;
    this.sldServiceable = false;
    this.sldSurplus = false;
    this.sldCondemned = false;
    this.sldMissing = false;
    this.sldTransfered = false;
    // this.disableOfcType = false;
    this.disableServiceable = false;
    this.disableSurplus = false;
    this.disableUsable = false;
    this.disableCondemned = false;
    this.disableChkCustody = false;
    this.txtRemarks = "";
    this.lblAccCategory = "";
    this.assetNo = "";
    this.lblTransferID = "";
    this.imageAsset = undefined;
    this.imgFileAsset = undefined;
    this.selectedAssetFile = null;
    this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset2 = undefined;
    this.imgFileAsset2 = undefined;
    this.selectedAssetFile2 = null;
    this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset3 = undefined;
    this.imgFileAsset3 = undefined;
    this.selectedAssetFile3 = null;
    this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.AssetCatList = this.tempAssetCatList;
    this.disableAssetCat = false;
  }

  clearAll() {
    this.clearTransfer();
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    this.lblTransByPost = "";
    this.lblTransferID = "";

    this.disableTag = false;
    this.disableCustody = false;

    this.disableFields = false;
    this.disableCustody = false;
    this.chkTag = false;
    this.lblLocID = "";
    this.lblOfcTypeID = "";
    this.lblAssetCatID = "";
    this.lblSectionID = "";

    if (this.chkProject == false) {
      this.cmbProject = "";
    }
    if (this.chkassetLoc == false) {
      this.txtAssetLoc = "";
    }
    if (this.chkCustody == false) {
      this.cmbCustody = "";
    }
    this.cmbWngSection = "";
    this.cmbOfcType = "";
    this.cmbLocation = "";
    this.txtTagNo = "1";
    this.lblAssetCategory = "";
    this.lblLocation = "";
    this.lblOfficeType = "";
    this.lblSection = "";
    this.assetID = "";
    this.rdbAsset = "1";
    this.cmbVehicle = "";
    this.cmbAssetCat = "";
    this.txtAssetDesc = "";
    this.txtIdentification = "";
    this.txtSerialNo = "";
    this.cmbRef = "";
    this.dtpPurchaseDt = "";
    this.txtAmount = "";
    this.txtPreTag = "";
    this.txtNetBVal = "";
    this.cmbAssetCond = "";
    this.sldUsable = false;
    this.sldServiceable = false;
    this.sldSurplus = false;
    this.sldCondemned = false;
    this.sldMissing = false;
    this.sldTransfered = false;
    // this.disableOfcType = false;
    this.disableServiceable = false;
    this.disableSurplus = false;
    this.disableUsable = false;
    this.disableCondemned = false;
    this.disableChkCustody = false;
    this.txtRemarks = "";
    this.lblAccCategory = "";
    this.assetNo = "";
    this.lblTransferID = "";
    this.imageAsset = undefined;
    this.imgFileAsset = undefined;
    this.selectedAssetFile = null;
    this.imageAssetUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset2 = undefined;
    this.imgFileAsset2 = undefined;
    this.selectedAssetFile2 = null;
    this.imageAssetUrl2 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.imageAsset3 = undefined;
    this.imgFileAsset3 = undefined;
    this.selectedAssetFile3 = null;
    this.imageAssetUrl3 = "../../../../../assets/assetEntryImg/dropHereImg.png";

    this.AssetCatList = this.tempAssetCatList;
    this.disableAssetCat = true;
  }

  setCondemned() {
    if (this.sldUsable) {
      this.disableCondemned = true;
      this.sldCondemned = false;
    } else if (!this.sldUsable) {
      this.disableCondemned = false;
    }
  }

  setProject() {
    this.cmbTransferProject = this.cmbProject;
    this.disableProject = true;
    this.getIPC();
  }

  getAssetCat() {
    this.cmbVehicle = "";
    this.AssetCatList = this.tempAssetCatList;
    if (this.rdbAsset == "2") {
      this.AssetCatList = this.AssetCatList.filter(
        (x) => x.accountsCatagory == "VEHICLES"
      );
      this.lblAccCategory = "";
    } else {
      this.disableAssetCat = false;
      this.cmbAssetCat = "";
      this.lblAccCategory = "";
    }
  }

  getAssetCatVehicle(vehID) {
    var vehData = this.vehicleList.filter((x) => x.id == vehID);

    this.cmbAssetCat = vehData[0].assetCatID;
    this.disableAssetCat = true;
    this.getAssetCatDescription(this.cmbAssetCat);
  }

  setTransfer() {
    if (this.sldTransfered) {
      $("#assetTransferModal").modal("show");
      setTimeout(() => this.removeTransfer(), 10);
    } else {
      this.clearTransfer();
      this.lblTransToComp = "";
      this.lblTransByComp = "";
      this.lblTransByPost = "";
      this.lblTransferID = "";

      this.disableProject = true;
      this.disableCustody = false;
      // this.cmbProject = "";
      this.cmbCustody = "";
      $("#assetTransferModal").modal("hide");
    }
  }

  removeTransfer() {
    if (this.lblTransferID == "") {
      this.sldTransfered = false;
    }
  }

  getTransByPost() {
    var postByCom = this.transferByList.filter(
      (x) => x.postID == this.cmbTransByPost
    );
    this.lblTransByComp = postByCom[0].companyName;

    this.cmbCustody = this.cmbTransByPost;

    this.disableCustody = true;
  }

  getTransToPost() {
    var postToCom = this.transferToList.filter(
      (x) => x.postID == this.cmbTransToPost
    );
    this.lblTransToComp = postToCom[0].companyName;
    this.lblTransByPost = postToCom[0].postName;
  }

  openTransferModal() {
    $("#assetTransferModal").modal("show");

    if (this.lblTransferID != "") {
      var trans = this.transferList.filter(
        (x) => x.transferID == this.lblTransferID
      );

      this.rdbTransType = trans[0].transferType;
      this.cmbTransferProject = trans[0].projectID;
      this.cmbTransByPost = trans[0].tPostID;
      this.cmbTransToPost = trans[0].rPostID;
      this.dtpTransferDt = new Date(trans[0].dateofTransfer);
      this.txtTransDesc = trans[0].transferDescription;
      if (trans[0].eDoc != null) {
        this.imageTransUrl =
          "http://95.217.206.195:2008/assets/transferImg/" +
          this.lblTransferID +
          ".jpg";
      }

      var transBy = this.transferByList.filter(
        (x) => x.postID == this.cmbTransByPost
      );

      var transTo = this.transferToList.filter(
        (x) => x.postID == this.cmbTransToPost
      );

      this.lblTransByPost = transBy[0].postName;
      this.lblTransToComp = transTo[0].companyName;
      this.lblTransByComp = transBy[0].companyName;
    }
  }
  setMissingYes() {
    if (this.sldMissing) {
      this.disableUsable = true;
      this.sldUsable = false;
      this.disableServiceable = true;
      this.sldServiceable = false;
      this.disableSurplus = true;
      this.sldSurplus = false;
      this.disableCondemned = true;
      this.sldCondemned = false;

      this.cmbCustody = null;
      this.cmbAssetCond = null;
      this.disableChkCustody = true;
    } else if (!this.sldMissing) {
      this.disableUsable = false;
      this.disableServiceable = false;
      this.disableSurplus = false;
      this.disableCondemned = false;
      this.disableChkCustody = false;
    }
  }

  clearLocation() {
    this.cmbSearchLocation = "";
    this.cmbSearchOfcType = "";
    this.cmbSearchWngSection = "";

    this.assetDetailList = this.tempDetailList;
  }

  searchTableData() {
    this.assetDetailList = [];
    this.assetDetailList = this.tempDetailList;

    if (this.cmbSearchOfcType == "" && this.cmbSearchWngSection == "") {
      this.assetDetailList = this.assetDetailList.filter(
        (x) => x.subLocID == this.cmbSearchLocation
      );

      var locFilter = this.locList.filter(
        (x) => x.subLocID == this.cmbSearchLocation
      );

      this.regionName = locFilter[0].locationDescription;
      this.locationName = locFilter[0].subLocationDescription;
      this.officeName = locFilter[0].officeTypeDescription;
    } else if (this.cmbSearchLocation == "" && this.cmbSearchWngSection == "") {
      this.assetDetailList = this.assetDetailList.filter(
        (x) => x.officeTypeID == this.cmbSearchOfcType
      );
    } else if (this.cmbSearchWngSection == "") {
      this.assetDetailList = this.assetDetailList.filter(
        (x) =>
          x.subLocID == this.cmbSearchLocation &&
          x.officeTypeID == this.cmbSearchOfcType
      );
    } else {
      this.assetDetailList = this.assetDetailList.filter(
        (x) =>
          x.subLocID == this.cmbSearchLocation &&
          x.officeTypeID == this.cmbSearchOfcType &&
          x.officeSecID == this.cmbSearchWngSection
      );
    }
  }

  //*function for sort table data
  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    }
    this.order = value;
  }

  //print Asset Register Report
  printAssetRegister() {
    var printCss = this.printCSS();

    var contents = $("#assetRegister").html();

    var frame1 = $("<iframe />");
    frame1[0].name = "frame1";
    frame1.css({ position: "absolute", top: "-1000000px" });
    $("body").append(frame1);
    var frameDoc = frame1[0].contentWindow
      ? frame1[0].contentWindow
      : frame1[0].contentDocument.document
      ? frame1[0].contentDocument.document
      : frame1[0].contentDocument;
    frameDoc.document.open();

    //Create a new HTML document.
    frameDoc.document.write(
      "<html><head><title>DIV Contents</title>" +
        "<style>" +
        printCss +
        "</style>"
    );

    //Append the external CSS file. <link rel="stylesheet" href="../../../styles.scss" /> <link rel="stylesheet" href="../../../../node_modules/bootstrap/dist/css/bootstrap.min.css" />
    frameDoc.document.write(
      '<style type="text/css" media="print">@page { size: landscape; }</style>'
    );
    frameDoc.document.write(
      '<link rel="stylesheet" href="../../../../assets/css/styles.css" type="text/css"  media="print"/>'
    );
    frameDoc.document.write("</head><body>");

    //Append the DIV contents.
    frameDoc.document.write(contents);
    frameDoc.document.write("</body></html>");

    frameDoc.document.close();

    setTimeout(function () {
      window.frames["frame1"].focus();
      window.frames["frame1"].print();
      frame1.remove();
    }, 500);
  }

  saveTransfer() {
    // alert(this.dtpTransferDt);
    if (this.rdbTransType == "") {
      this.toastr.errorToastr("Please Select Transfer Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbTransLocation == "") {
      this.toastr.errorToastr(
        "Please Select Transfer Province Location & Sub Location",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbTransOfcType == "") {
      this.toastr.errorToastr("Please Select Transfer Office Type", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbTransWngSection == "") {
      this.toastr.errorToastr("Please Select Transfer Wing Section", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbTransByPost == "") {
      this.toastr.errorToastr(
        "Please Select Transferred By Custody Name",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.cmbTransToPost == "") {
      this.toastr.errorToastr(
        "Please Select Transferred To Custody Name",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    } else if (this.txtTransDesc == "") {
      this.toastr.errorToastr("Please Enter Transfer Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpTransferDt == "" || this.dtpTransferDt == undefined) {
      this.toastr.errorToastr("Please Select Transfer Date", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.imageTrans == null && this.lblTransferID == "") {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;

      if (this.cmbTransferProject == "") {
        this.cmbTransferProject = "0";
      }

      var transferDate = this.convertDate(this.dtpTransferDt);
      var saveData;
      var projectID;

      if (this.cmbTransferProject == "0") {
        projectID = null;
      } else {
        projectID = parseInt(this.cmbTransferProject);
      }

      if (this.lblTransferID == "") {
        saveData = {
          rSubLocID: parseInt(this.cmbTransLocation), //int
          officeTypeID: parseInt(this.cmbTransOfcType), //int
          rOfficeSecID: parseInt(this.cmbTransWngSection), //int
          TPostID: parseInt(this.cmbTransByPost), //int
          RPostID: parseInt(this.cmbTransToPost), //int
          DateofTransfer: transferDate, //int
          TransferType: this.rdbTransType, //int
          TransferDescription: this.txtTransDesc, //int
          EDoc: this.imgTransPath,
          EDocExtension: "jpg",
          Userid: this.cookie.get("userID"), //int
          TransferID: 0, //int
          ProjectID: projectID, //int
          SpType: "INSERT", //string
          imgFile: this.imageTrans,
        };
      } else {
        saveData = {
          rSubLocID: parseInt(this.cmbTransLocation), //int
          officeTypeID: parseInt(this.cmbTransOfcType), //int
          rOfficeSecID: parseInt(this.cmbTransWngSection), //int
          TPostID: parseInt(this.cmbTransByPost), //int
          RPostID: parseInt(this.cmbTransToPost), //int
          DateofTransfer: transferDate, //int
          TransferType: this.rdbTransType, //int
          TransferDescription: this.txtTransDesc, //int
          EDoc: this.imgTransPath,
          EDocExtension: "jpg",
          Userid: this.cookie.get("userID"), //int
          TransferID: this.lblTransferID, //int
          ProjectID: projectID, //int
          SpType: "UPDATE", //string
          imgFile: this.imageTrans,
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sudassettransfer", saveData, {
          // .post("http://localhost:5090/api/sudassettransfer", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            this.clearTransfer();
            if (this.lblTransferID == "") {
              this.toastr.successToastr(
                "Record Saved Successfully!",
                "Success!",
                {
                  toastTimeout: 2500,
                }
              );
              this.lblTransferID = data.transID;
            } else {
              this.toastr.successToastr(
                "Record Updated Successfully!",
                "Success!",
                {
                  toastTimeout: 2500,
                }
              );
            }

            this.getTransfer();
            $("#assetTransferModal").modal("hide");
            // this.lblTransferID=data.ID;
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

  editTransfer(obj) {
    this.sldTransfered = true;
    this.lblTransferID = obj.transferID;
    this.rdbTransType = obj.transferType;
    this.cmbTransferProject = obj.projectID;
    this.cmbTransLocation = obj.rSubLocID;
    this.cmbTransOfcType = obj.officeTypeID;
    this.getTransWingSection(obj.officeTypeID);
    this.cmbTransWngSection = obj.rOfficeSecID;
    this.cmbTransByPost = obj.tPostID;
    this.cmbTransToPost = obj.rPostID;
    this.dtpTransferDt = new Date(obj.dateofTransfer);
    this.txtTransDesc = obj.transferDescription;
    if (obj.eDoc != null) {
      this.imageTransUrl =
        "http://95.217.206.195:2008/assets/transferImg/" +
        obj.transferID +
        ".jpg";
    }

    var transBy = this.transferByList.filter(
      (x) => x.postID == this.cmbTransByPost
    );

    var transTo = this.transferToList.filter(
      (x) => x.postID == this.cmbTransToPost
    );

    this.lblTransByPost = transBy[0].postName;
    this.lblTransToComp = transTo[0].companyName;
    this.lblTransByComp = transBy[0].companyName;

    // this.cmbTransferProject = this.cmbProject;
    this.disableProject = true;
    this.cmbCustody = this.cmbTransToPost;
    this.disableCustody = true;
    this.getIPC();
  }

  deleteTransfer(obj) {
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
          var saveData = {
            Userid: this.cookie.get("userID"), //int
            SpType: "Delete", //string
            TransferID: obj.transferID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "sudassettransfer", saveData, {
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
                this.clearTransfer();
                this.getTransfer();
                $("#assetTransferModal").modal("hide");
                this.lblTransToComp = "";
                this.lblTransByPost = "";
                this.lblTransferID = "";

                this.cmbProject = "";
                this.cmbCustody = "";

                this.sldTransfered = false;
                this.disableCustody = false;
                this.disableProject = true;

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
      });
    }, 1000);
  }

  deleteTransferDetail(item) {
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
          var saveData = {
            Userid: this.cookie.get("userID"), //int
            TransferID: item.transferID, //int
            AssetID: item.assetID, //int
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "deltransferdetail", saveData, {
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
                this.getTransferDetail(item);
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
      });
    }, 1000);
  }

  getTransferDetail(obj) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getassettransferdetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.transDetailList = data.filter(
          (x) => x.transferID == obj.transferID
        );
        $("#assetTransferDetailModal").modal("show");
      });
  }

  clearTransfer() {
    this.rdbTransType = "";
    this.cmbTransLocation = "";
    this.cmbTransOfcType = "";
    this.cmbTransWngSection = "";
    this.cmbTransferProject = "";
    this.cmbTransByPost = "";
    this.cmbTransToPost = "";
    this.dtpTransferDt = "";
    this.txtTransDesc = "";
    this.lblTransToComp = "";
    this.imageTrans = undefined;
    this.imgFileTrans = undefined;
    this.selectedTransFile = null;
    this.imageTransUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
  }

  clearTransferDetail() {
    this.rdbTransType = "";
    this.cmbTransferProject = "";
    this.cmbTransLocation = "";
    this.cmbTransOfcType = "";
    this.cmbTransWngSection = "";
    this.lblTransferID = "";
    this.cmbTransByPost = "";
    this.cmbTransToPost = "";
    this.dtpTransferDt = "";
    this.txtTransDesc = "";
    this.lblTransToComp = "";
    this.lblTransByComp = "";
    this.lblTransByPost = "";
    this.disableCustody = false;
    this.cmbCustody = "";
    this.imageTrans = undefined;
    this.imgFileTrans = undefined;
    this.selectedTransFile = null;
    this.imageTransUrl = "../../../../../assets/assetEntryImg/dropHereImg.png";
  }

  clearVehicle() {
    this.cmbVehicleAssetCat = "";
    this.vehID = "";
    this.txtRegNo = "";
    this.cmbMake = "";
    this.cmbModel = "";
    this.cmbType = "";
    this.txtEngine = "";
    this.txtChasis = "";
    this.txtDeploy = "";
    this.imageVehicle = undefined;
    this.imgFileVehicle = undefined;
    this.selectedVehicleFile = null;
    this.imageVehicleUrl =
      "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.lblFileName = "";
  }

  onVehicleFileSelected(event) {
    if (event.target.files[0].type == "application/pdf") {
      this.selectedVehicleFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageVehicle = reader.result;

        var splitImg = this.imageVehicle.split(",")[1];
        this.imageVehicle = splitImg;
        this.imageVehicleUrl = "";
        this.lblFileName = event.target.files[0].name;
      };

      reader.readAsDataURL(this.selectedVehicleFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.imageVehicle = undefined;
      this.imgFileVehicle = undefined;
      this.selectedVehicleFile = null;
      this.lblFileName = "";
      this.imageVehicleUrl =
        "../../../../../assets/assetEntryImg/dropHereImg.png";
    }
  }

  onTransFileSelected(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      this.selectedTransFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageTrans = reader.result;

        var splitImg = this.imageTrans.split(",")[1];
        this.imageTrans = splitImg;
        this.imageTransUrl = e.target.result;
      };

      reader.readAsDataURL(this.selectedTransFile);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.imageTrans = undefined;
      this.imgFileTrans = undefined;
      this.selectedTransFile = null;
      this.imageTransUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  zoomTransImage() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");

    if (
      this.imageTransUrl ==
      "../../../../../assets/assetEntryImg/dropHereImg.png"
    ) {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>(
        document.querySelector("#img01")
      )).src = this.imageTransUrl;
    }
  }

  onAssetFileSelected(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      this.selectedAssetFile = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageAsset = reader.result;

        var splitImg = this.imageAsset.split(",")[1];
        this.imageAsset = splitImg;
        this.imageAssetUrl = e.target.result;
      };

      reader.readAsDataURL(this.selectedAssetFile);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.imageAsset = undefined;
      this.imgFileAsset = undefined;
      this.selectedAssetFile = null;
      this.imageAssetUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  onAssetFileSelected2(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      this.selectedAssetFile2 = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageAsset2 = reader.result;

        var splitImg = this.imageAsset2.split(",")[1];
        this.imageAsset2 = splitImg;
        this.imageAssetUrl2 = e.target.result;
      };

      reader.readAsDataURL(this.selectedAssetFile2);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.imageAsset2 = undefined;
      this.imgFileAsset2 = undefined;
      this.selectedAssetFile2 = null;
      this.imageAssetUrl2 = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  onAssetFileSelected3(event) {
    if (
      event.target.files[0].type == "image/png" ||
      event.target.files[0].type == "image/jpeg"
    ) {
      this.selectedAssetFile3 = <File>event.target.files[0];
      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.imageAsset3 = reader.result;

        var splitImg = this.imageAsset3.split(",")[1];
        this.imageAsset3 = splitImg;
        this.imageAssetUrl3 = e.target.result;
      };

      reader.readAsDataURL(this.selectedAssetFile3);
    } else {
      this.toastr.errorToastr("Please Select JPEG / PNG Image", "Error", {
        toastTimeout: 2500,
      });

      this.imageAsset3 = undefined;
      this.imgFileAsset3 = undefined;
      this.selectedAssetFile3 = null;
      this.imageAssetUrl3 = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  zoomAssetImage() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");

    if (
      this.imageAssetUrl ==
      "../../../../../assets/assetEntryImg/dropHereImg.png"
    ) {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>(
        document.querySelector("#img01")
      )).src = this.imageAssetUrl;
    }
  }

  zoomAssetImage2() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");

    if (
      this.imageAssetUrl2 ==
      "../../../../../assets/assetEntryImg/dropHereImg.png"
    ) {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>(
        document.querySelector("#img01")
      )).src = this.imageAssetUrl2;
    }
  }

  zoomAssetImage3() {
    // Get the modal
    var modal = document.getElementById("myModal");

    // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    // var captionText = document.getElementById("caption");

    if (
      this.imageAssetUrl3 ==
      "../../../../../assets/assetEntryImg/dropHereImg.png"
    ) {
      this.toastr.errorToastr("Please Select Image", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>(
        document.querySelector("#img01")
      )).src = this.imageAssetUrl3;
    }
  }

  closeModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  genPin(obj, param) {
    // alert(this.cookie.get("pinstatus"));
    if (this.cookie.get("pinstatus") == "true") {
      this.txtPin = "";
      this.objList = [];
      this.paramType = "";
      this.objList = obj;
      this.paramType = param;

      $("#genPinModal").modal("show");
    } else {
      this.toastr.errorToastr("PIN Code is not allowed", "Error", {
        toastTimeout: 2500,
      });
      return false;
    }
  }

  resetPin() {
    if (this.txtPin == "") {
      this.toastr.errorToastr("Please Enter Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPin.length != 4) {
      this.toastr.errorToastr("Please Enter Correct Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var saveData = {
        UserName: this.cookie.get("userName"),
        HashPassword: this.txtPin,
        UpdatedBY: this.cookie.get("userID"),
        SpType: "PINCODE",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "resetPw", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr("Pin Changed Successfully!", "Success!", {
              toastTimeout: 2500,
            });
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  allowUpdation() {
    // alert(this.objList);
    // alert(this.paramType);

    if (this.txtPin == "") {
      this.toastr.errorToastr("Please Enter Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPin.length != 4) {
      this.toastr.errorToastr("Please Enter Correct Pin", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var saveData = {
        UserName: this.cookie.get("userName"),
        Pincode: this.txtPin,
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "pincode", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            $("#genPinModal").modal("hide");
            if (this.paramType == "editAsset") {
              this.editAsset(this.objList);
            } else if (this.paramType == "deleteAsset") {
              this.delete(this.objList);
            } else if (this.paramType == "editTransfer") {
              this.editTransfer(this.objList);
            } else if (this.paramType == "deleteTransfer") {
              this.deleteTransfer(this.objList);
            } else if (this.paramType == "deleteTransferDetail") {
              this.deleteTransferDetail(this.objList);
            }
            this.paramType = "";
            this.objList = [];
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error!", { toastTimeout: 2500 });
          }
        });
    }
  }

  onKeyPress(event) {
    if ((event.keyCode > 47 && event.keyCode < 58) || event.keyCode == 8) {
      return true;
    } else {
      return false;
    }
  }

  // Edit Vehicle
  editVehicle(item) {
    this.imageVehicle = undefined;
    this.imgFileVehicle = undefined;
    this.selectedVehicleFile = null;
    this.imageVehicleUrl =
      "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.lblFileName = "";

    $("#vehicleModal").modal("show");
    this.vehID = item.id;
    this.txtRegNo = item.vehID;
    this.cmbMake = item.make;
    this.cmbModel = item.model;
    this.cmbType = item.type;
    this.cmbVehicleAssetCat = item.assetCatID;
    this.txtDeploy = item.deployedWith;
    this.txtEngine = item.engineNum;
    this.txtChasis = item.chasisNum;
    this.cmbVehicle = "";
    if (item.eDoc != null) {
      this.imageVehicleUrl =
        "http://95.217.206.195:2008/assets/vehicleImg/" + item.id + ".pdf";
      this.lblFileName = "Open Uploaded File";
    }
  }

  exportExcel() {
    this.app.exportExcel("assetRegister", "Asset Register");
  }

  exportPdf() {
    // this.app.exportPdf("assetRegister", "Asset Register");
    var data = document.getElementById("assetRegister");
    html2canvas(data).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL("image/png");
      let pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
      pdf.save("MYPdf.pdf"); // Generated PDF
    });
  }

  openPDFFile() {
    if (this.imageVehicleUrl != "") {
      window.open(this.imageVehicleUrl);
    }
  }
}
