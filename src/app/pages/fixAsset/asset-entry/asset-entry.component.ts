import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

@Component({
  selector: "app-asset-entry",
  templateUrl: "./asset-entry.component.html",
  styleUrls: ["./asset-entry.component.scss"],
})
export class AssetEntryComponent implements OnInit {
  serverUrl = "http://95.217.147.105:2007/api/";

  editMode = true;
  hidden = false;
  assetNo = "";
  rdbAsset = "";
  cmbCustody = "";
  cmbVehicle = "";
  cmbWngSection = "";
  cmbOfcType = "";
  cmbLocation = "";
  cmbAssetCat = "";
  txtAssetDesc = "";
  txtAssetLoc = "";
  txtIdentification = "";
  txtSerialNo = "";
  cmbProject = "";
  txtRef = "";
  txtAmount = "";
  txtPreTag = "";
  txtNetBVal = "";
  cmbAssetCond = "";
  txtRemarks = "";
  dtpPurchaseDt = "";

  txtRegNo = "";
  cmbMake = "";
  cmbModel = "";
  cmbType = "";
  txtEngine = "";
  txtChasis = "";

  sldUsable = false;
  sldServiceable = false;
  sldSurplus = false;
  sldCondemned = false;
  sldMissing = false;

  searchLocation = "";
  searchCategory = "";
  searchCustody = "";
  searchProject = "";
  searchVehicle = "";

  locList = [];
  ofcTypeList = [];
  wngSectionList = [];
  vehicleList = [];
  custodyList = [];
  AssetCatList = [];
  projectList = [];
  preTagList = [];
  assetCondList = [];

  vehMakeList = [];
  vehModelList = [];
  vehTypeList = [];

  toggleView = "table";

  constructor(private toastr: ToastrManager, private http: HttpClient) {}

  ngOnInit(): void {
    this.getLocation();
    this.getOfficeType();
    this.getWingSection();
    this.getVehicle();
    this.getCustody();
    this.getAssetCategory();
    this.getProject();
    this.getAssetCondition();
    this.getVehicleMake();
    this.getVehicleModel();
    this.getVehicleType();
  }

  editLocation() {
    this.editMode = !this.editMode;
    alert(this.rdbAsset);
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

  getLocation() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getsubloc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.locList = data;
      });
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
      });
  }

  getWingSection() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getwingsec", { headers: reqHeader })
      .subscribe((data: any) => {
        this.wngSectionList = data;
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
        this.custodyList = data;
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
    } else if (this.cmbCustody == "") {
      this.toastr.errorToastr("Please Select Custody", "Error", {
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
    } else if (this.txtIdentification == "") {
      this.toastr.errorToastr("Please Enter OtherIdenification", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtSerialNo == "") {
      this.toastr.errorToastr("Please Enter Serial Number", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtRef == "") {
      this.toastr.errorToastr("Please Enter IPC Reference", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.dtpPurchaseDt == "") {
      this.toastr.errorToastr("Please Select Purchase Date", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtAmount == "") {
      this.toastr.errorToastr("Please Enter Amount", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPreTag == "") {
      this.toastr.errorToastr("Please Enter Previous Tag", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtNetBVal == "") {
      this.toastr.errorToastr("Please Enter Net Book Value", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cmbAssetCond == "") {
      this.toastr.errorToastr("Please Select Asset Condition", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtRemarks == "") {
      this.toastr.errorToastr("Please Enter Remarks", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      var vehicleID;
      if (this.rdbAsset == "1") {
        vehicleID = 0;
      } else {
        if (this.cmbVehicle == "") {
          this.toastr.errorToastr("Please Select Vehicle", "Error", {
            toastTimeout: 2500,
          });
          return false;
        } else {
          vehicleID = this.cmbVehicle;
        }
      }
      var purchaseDate = this.convertDate(this.dtpPurchaseDt);

      var saveData = {
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
        VehicleID: parseInt(vehicleID), //int
        ProjectID: parseInt(this.cmbProject), //int
        PreviousTag: this.txtPreTag, //string
        costAmount: this.txtAmount, //float
        NetBookAmount: this.txtNetBVal, //int
        PurchaseDate: purchaseDate, //string
        IPCRef: this.txtRef, //string
        AssetCondition: this.cmbAssetCond, //int
        IsUseable: this.sldUsable, //bool
        IsSurplus: this.sldSurplus, //bool
        IsServiceAble: this.sldServiceable, //bool
        IsCondemned: this.sldCondemned, //bool
        IsMissing: this.sldMissing, //bool
        Remarks: this.txtRemarks, //string
        Userid: 1, //int
        IsDeleted: 0, //bool
        DeletionDate: purchaseDate, //date
        DeleteBy: 0, //int
        IsUpdated: 0, //int
        UpdatedDate: null, //date
        Updatedby: 0, //int
        SpType: "Insert", //string
        AssetID: 0, //int
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "saveasset", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          alert(data.msg);
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Record Saved Successfully!",
              "Success!",
              {
                toastTimeout: 2500,
              }
            );
            this.clear();
            this.getVehicle();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
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
    } else {
      var saveData = {
        VehID: this.txtRegNo,
        Make: this.cmbMake,
        Model: this.cmbModel,
        Type: this.cmbType,
        ChasisNum: this.txtChasis,
        EngineNum: this.txtEngine,
        ID: 0,
        Userid: 1,
        SPType: "Insert",
      };

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "savevehicle", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            this.toastr.successToastr(
              "Record Saved Successfully!",
              "Success!",
              {
                toastTimeout: 2500,
              }
            );
            this.clear();
            this.getVehicle();
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            return false;
          }
        });
    }
  }

  clear() {}
}
