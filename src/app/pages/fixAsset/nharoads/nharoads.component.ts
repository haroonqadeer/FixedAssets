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
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AppComponent } from "../../../app.component";

declare var $: any;

@Component({
  selector: "app-nharoads",
  templateUrl: "./nharoads.component.html",
  styleUrls: ["./nharoads.component.scss"],
})
export class NHARoadsComponent implements OnInit {
  toggleView = "form";

  serverUrl = "http://95.217.206.195:2007/api/";
  // serverUrl = "http://localhost:5090/api/";

  loadingBar = true;
  reqStatus = false;
  disableRoad = true;

  ddlAccSec = "";
  ddlTrailBalance = "";
  ddlProject = "";
  ddlRoads = "";
  ddlLandMeasurement = "";

  lblOpeningCost = 0;
  lblAddition = 0;
  lblOpeningDep = 0;
  lblDepriciation = 0;
  lblOpeningReval = 0;
  lblReval = 0;
  lblTransactions = 0;
  lblSurplus = 0;
  lblFixAssetID = 0;
  lblAccCatID = 12;
  FaDetailID = 0;

  txtFaAmount = "";
  txtFaCost = "";
  txtProPackage = "";
  txtRoadLength = "";
  txtAKanal = "";
  txtTKanal = "";
  txtAMarla = "";
  txtTMarla = "";
  txtRemarks = "";

  txtConstCost = "";
  txtLandCost = "";

  dtpNation = new Date();
  dtpConstFrom = new Date();
  dtpConstTo = new Date();
  dtpFaDate = new Date();

  txtSearch = "";
  txtSearchAccSec = "";
  txtSearchTrailBalance = "";
  txtSearchProject = "";
  txtSearchRoads = "";

  roadList = [];
  accSecList = [];
  projectsList = [];
  roadsList = [];
  landMeasurementList = [];
  faSummaryList = [];
  faDetailList = [];
  transactionList = [];
  oFaDetailList = [];
  aFaDetailList = [];
  ovFaDetailList = [];
  vFaDetailList = [];
  tempTransactionList = [];

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
    this.getRoads();
    this.getLandMeasurement();
    this.getRoadDetail();
    this.getFaDetail();
  }

  getRoadDetail() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      // .get(this.serverUrl + "getRoadDetail", { headers: reqHeader })
      .get("http://localhost:5090/api/getRoadDetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.roadList = data;
        this.loadingBar = false;
      });
  }

  getAccSec() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getaccsec", { headers: reqHeader })
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
      .get(this.serverUrl + "getprojects?IsActivated=1", { headers: reqHeader })
      .subscribe((data: any) => {
        this.projectsList = data;
        // this.projectsList2 = data;
        this.loadingBar = false;
      });
  }

  getRoads() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getroads", { headers: reqHeader })
      .subscribe((data: any) => {
        this.roadsList = data;
        this.loadingBar = false;
      });
  }

  getLandMeasurement() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getlandmeasurement", { headers: reqHeader })
      .subscribe((data: any) => {
        this.landMeasurementList = data;
        this.loadingBar = false;
      });
  }

  getFaDetail() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getfadetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.faDetailList = data;
        // alert(this.faDetailList.length);
        this.getFaSummary();
      });
  }

  getFaSummary() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getfasummary", { headers: reqHeader })
      .subscribe((data: any) => {
        this.faSummaryList = data;
        // alert(this.faSummaryList.length);
        this.getTransactions();
      });
  }

  getTransactions() {
    this.loadingBar = true;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "gettransaction", { headers: reqHeader })
      .subscribe((data: any) => {
        this.transactionList = data;
        // alert(this.transactionList.length);
        this.loadingBar = false;

        if (this.reqStatus == true) {
          this.filterFaDetail(this.lblFixAssetID, "oc");
          this.filterFaDetail(this.lblFixAssetID, "a");
          this.filterFaDetail(this.lblFixAssetID, "ov");
          this.filterFaDetail(this.lblFixAssetID, "v");
          this.filterFaDetail(this.lblFixAssetID, "t");
          this.filterFaDetail(this.lblFixAssetID, "td");

          this.reqStatus = false;
        }
      });
  }

  filterFaDetail(reqFixAssetID, filterBy) {
    // alert(this.faDetailList.length);
    if (filterBy == "oc") {
      this.oFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) => x.fixedAssetID == reqFixAssetID && x.openingCost != 0
      );

      if (tempList.length > 0) {
        this.oFaDetailList = tempList;
      }
    }

    if (filterBy == "a") {
      this.aFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) =>
          x.fixedAssetID == reqFixAssetID &&
          (x.additioninCost != 0 || x.disposalinCost != 0)
      );

      if (tempList.length > 0) {
        this.aFaDetailList = tempList;
      }
    }

    if (filterBy == "od") {
      this.ovFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) => x.fixedAssetID == reqFixAssetID && x.openingDepreciation != 0
      );

      if (tempList.length > 0) {
        this.ovFaDetailList = tempList;
      }
    }

    if (filterBy == "d") {
      this.vFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) =>
          x.fixedAssetID == reqFixAssetID &&
          (x.depreciationforYear != 0 || x.disposalinDepreciation != 0)
      );

      if (tempList.length > 0) {
        this.vFaDetailList = tempList;
      }
    }

    if (filterBy == "ov") {
      this.ovFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) =>
          x.fixedAssetID == reqFixAssetID && x.openingRevaluationAmount != 0
      );

      if (tempList.length > 0) {
        this.ovFaDetailList = tempList;
      }
    }

    if (filterBy == "v") {
      this.vFaDetailList = [];
      var tempList = this.faDetailList.filter(
        (x) => x.fixedAssetID == reqFixAssetID && x.revaluationAmount != 0
      );

      if (tempList.length > 0) {
        this.vFaDetailList = tempList;
      }
    }

    if (filterBy == "t") {
      this.lblOpeningCost = 0;
      this.lblAddition = 0;
      this.lblOpeningDep = 0;
      this.lblDepriciation = 0;
      this.lblOpeningReval = 0;
      this.lblReval = 0;
      this.lblTransactions = 0;
      this.lblSurplus = 0;

      var tempList = this.faSummaryList.filter(
        (x) => x.fixedAssetID == reqFixAssetID
      );

      if (tempList.length > 0) {
        this.lblOpeningCost = tempList[0].openingCost;
        this.lblAddition =
          tempList[0].additioninCost + tempList[0].disposalinCost;
        this.lblOpeningDep = tempList[0].openingDepreciation;
        this.lblDepriciation = tempList[0].disposalinDepreciation;
        this.lblOpeningReval = tempList[0].openingRevaluationAmount;
        this.lblReval = tempList[0].revaluationAmount;
        this.lblTransactions = tempList[0].nooftransactions;
        this.lblSurplus = tempList[0].revalutionSurplus;
      }
    }

    if (filterBy == "td") {
      this.tempTransactionList = [];
      var tempList = this.transactionList.filter(
        (x) => x.fixedAssetID == reqFixAssetID
      );

      if (tempList.length > 0) {
        this.tempTransactionList = tempList;
      }
    }
  }

  filterProject(reqProjectID, filterBy) {
    if (filterBy == "") {
      this.ddlProject = "";
      var tempList = this.projectsList.filter(
        (x) => x.projectID == reqProjectID && x.accountCode > 0
      );
      if (tempList.length > 0) {
        this.ddlProject = this.ddlTrailBalance;
      }
      this.txtProPackage = "";
    } else {
      this.ddlTrailBalance = this.ddlProject;
      this.txtProPackage = "";
    }
    var proPackage = this.projectsList.filter(
      (x) => x.projectID == reqProjectID && x.accountCode > 0
    );

    this.txtProPackage = proPackage[0].projectName;
  }

  filterRoads(roadID) {
    var tempList = this.roadsList.filter((x) => x.roadID == roadID);

    this.txtRoadLength = tempList[0].roadLength;
  }

  //main entery CRUD Operation
  save() {
    var aKanal, aMarla, tKanal, tMarla;

    if (
      this.txtAKanal == undefined ||
      this.txtAKanal == "" ||
      this.txtAKanal == null
    ) {
      aKanal = 0;
    } else {
      aKanal = this.txtAKanal;
    }

    if (
      this.txtAMarla == undefined ||
      this.txtAMarla == "" ||
      this.txtAMarla == null
    ) {
      aMarla = 0;
    } else {
      aMarla = this.txtAMarla;
    }

    if (
      this.txtTKanal == undefined ||
      this.txtTKanal == "" ||
      this.txtTKanal == null
    ) {
      tKanal = 0;
    } else {
      tKanal = this.txtTKanal;
    }

    if (
      this.txtTMarla == undefined ||
      this.txtTMarla == "" ||
      this.txtTMarla == null
    ) {
      tMarla = 0;
    } else {
      tMarla = this.txtTMarla;
    }

    if (this.ddlAccSec == undefined || this.ddlAccSec == "") {
      this.toastr.errorToastr("Please Select Account Section", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    }
    // else if (this.ddlTrailBalance == undefined || this.ddlTrailBalance == "") {
    //     this.toastr.errorToastr("Please Select Trail Balance", "Error !", {toastTimeout: 2500,});
    //     return false;
    // }
    else if (this.ddlProject == undefined || this.ddlProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.ddlLandMeasurement == undefined ||
      this.ddlLandMeasurement == ""
    ) {
      this.toastr.errorToastr(
        "Please Select Area Accuired Measurement Unit",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (aKanal == 0 && aMarla == 0) {
      this.toastr.errorToastr("Please Enter Area Acquired", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (tKanal == 0 && tMarla == 0) {
      this.toastr.errorToastr(
        "Please Enter Land Transfered to NHA",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.ddlRoads == undefined || this.ddlRoads == "") {
      this.toastr.errorToastr("Please Select Road", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpNation == undefined || this.dtpNation == null) {
      this.toastr.errorToastr(
        "Please Select Date of Nationalization",
        "Error !",
        { toastTimeout: 2500 }
      );
      return false;
    } else if (this.dtpConstFrom == undefined || this.dtpConstFrom == null) {
      this.toastr.errorToastr("Please Select Construction From", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpConstTo == undefined || this.dtpConstTo == null) {
      this.toastr.errorToastr("Please Select Construction To", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var reqRemarks = "-";
      if (this.txtRemarks == undefined && this.txtRemarks.trim() == "") {
        reqRemarks = this.txtRemarks;
      }

      var dtNation = this.app.convertDate(this.dtpNation);
      var dtConstFrom = this.app.convertDate(this.dtpConstFrom);
      var dtConstTo = this.app.convertDate(this.dtpConstTo);

      var reqSpType = "Insert";
      if (this.lblFixAssetID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        AccountsCatID: this.lblAccCatID,
        FixedAssetID: this.lblFixAssetID,
        OfficeSecID: this.ddlAccSec,
        ProjectID: this.ddlProject,
        RoadId: this.ddlRoads,
        DateofNationalization: dtNation,
        ConstructionFrom: dtConstFrom,
        ConstructionTo: dtConstTo,
        ConstructionCost: this.txtConstCost,
        LandMeasureTypeID: this.ddlLandMeasurement,
        AreaAcquiredKanal: aKanal,
        AreaAcquiredMarla: aMarla,
        AreaTransferedKanal: tKanal,
        AreaTransferedMarla: tMarla,
        CostOfLand: this.txtLandCost,
        Remarks: reqRemarks,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        // .post(this.serverUrl + "sudRoad", SaveData, { headers: reqHeader })
        .post("http://localhost:5090/api/sudRoad", SaveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.lblFixAssetID == 0) {
              this.toastr.successToastr(
                "Record Saved Successfully!",
                "Success!",
                { toastTimeout: 2500 }
              );
            } else {
              this.toastr.successToastr(
                "Record Updated Successfully!",
                "Success!",
                { toastTimeout: 2500 }
              );
            }

            this.clear();
            this.getRoadDetail();
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
    this.toggleView = "form";

    this.lblFixAssetID = obj.fixedAssetID;
    this.ddlAccSec = obj.officeSecID.toString();
    this.ddlTrailBalance = obj.projectID.toString();
    this.ddlProject = obj.projectID.toString();
    this.ddlLandMeasurement = obj.landMeasureTypeID.toString();
    this.ddlRoads = obj.roadID.toString();
    if (obj.constructionFom != null) {
      this.dtpConstFrom = new Date(obj.constructionFom);
    }
    if (obj.constructionTo != null) {
      this.dtpConstTo = new Date(obj.constructionTo);
    }
    if (obj.dateofNationalization != null) {
      this.dtpNation = new Date(obj.dateofNationalization);
    }
    this.txtAKanal = obj.areaAcquiredKanal;
    this.txtAMarla = obj.areaAcquiredMarla;
    this.txtTKanal = obj.areaTransferedKanal;
    this.txtTMarla = obj.areaTransferedMarla;
    this.txtRemarks = obj.remarks;
    this.txtRoadLength = obj.roadLength;
    this.txtProPackage = obj.projectName;
    this.txtConstCost = obj.constructionCost;
    this.txtLandCost = obj.costofLand;

    this.filterFaDetail(obj.fixedAssetID, "oc");
    this.filterFaDetail(obj.fixedAssetID, "a");
    this.filterFaDetail(obj.fixedAssetID, "ov");
    this.filterFaDetail(obj.fixedAssetID, "v");
    this.filterFaDetail(obj.fixedAssetID, "t");
    this.filterFaDetail(obj.fixedAssetID, "td");
  }

  delete(obj) {
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
            FixedAssetID: obj.fixedAssetID,
            Userid: this.cookie.get("userID"),
            SpType: "Delete",
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            // .post(this.serverUrl + "sudRoad", SaveData, { headers: reqHeader })
            .post("http://localhost:5090/api/sudRoad", SaveData, {
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
                this.getRoadDetail();
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

  //
  saveOC() {
    alert(this.dtpFaDate);
    if (
      this.txtFaAmount == undefined ||
      this.txtFaAmount == "" ||
      parseFloat(this.txtFaAmount) <= 0
    ) {
      this.toastr.errorToastr("Please Enter Opening Cost", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpFaDate == undefined || this.dtpFaDate == null) {
      this.toastr.errorToastr("Please Enter Date", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.lblFixAssetID == 0) {
      this.toastr.errorToastr("Please Enter Complete Information", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      //var reqDate = this.app.convertDate(this.acquisitionDate);

      var reqSpType = "Insert";
      if (this.FaDetailID > 0) {
        reqSpType = "Update";
      }

      var SaveData = {
        FixedAssetID: this.lblFixAssetID,
        TypeofEntry: "Cost",
        OpeningCost: this.txtFaAmount,
        Year: this.dtpFaDate,
        FAdetailID: this.FaDetailID,
        Userid: this.cookie.get("userID"),
        SpType: reqSpType,
      };

      $("#additionOpeningModal").modal("toggle");

      this.loadingBar = true;
      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sudoc", SaveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.FaDetailID == 0) {
              this.toastr.successToastr(
                "Record Saved Successfully!",
                "Success!",
                { toastTimeout: 2500 }
              );
            } else {
              this.toastr.successToastr(
                "Record Updated Successfully!",
                "Success!",
                { toastTimeout: 2500 }
              );
            }

            this.clearFaDetail();
            this.reqStatus = true;
            this.getFaDetail();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.loadingBar = false;
            $("#additionOpeningModal").modal("toggle");
            return false;
          }
        });
    }
  }

  clear() {
    this.lblFixAssetID = 0;
    this.ddlAccSec = "";
    this.ddlTrailBalance = "";
    this.ddlProject = "";
    this.ddlLandMeasurement = "";
    this.ddlRoads = "";
    this.dtpConstFrom = new Date();
    this.dtpConstTo = new Date();
    this.dtpNation = new Date();
    this.txtAKanal = "";
    this.txtAMarla = "";
    this.txtTKanal = "";
    this.txtTMarla = "";
    this.txtRemarks = "";
    this.txtRoadLength = "";
    this.txtProPackage = "";
    this.txtConstCost = "";
    this.txtLandCost = "";

    this.lblOpeningCost = 0;
    this.lblAddition = 0;
    this.lblOpeningReval = 0;
    this.lblReval = 0;
    this.lblTransactions = 0;
    this.lblSurplus = 0;
  }

  clearFaDetail() {
    this.FaDetailID = 0;
    this.txtFaAmount = "";
    this.txtFaCost = "";
    this.dtpFaDate = new Date();
  }
}
