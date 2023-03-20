import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2/dist/sweetalert2.js";
import { AppComponent } from "../../../app.component";

declare var $: any;

@Component({
  selector: "app-vehicles",
  templateUrl: "./vehicles.component.html",
  styleUrls: ["./vehicles.component.scss"],
})
export class VehiclesComponent implements OnInit {
  heading = "Add";

  loadingBar = true;

  txtPin = "";
  tblSearch = "";

  vehID = "";

  cmbMake = "";
  cmbModel = "";
  cmbType = "";
  cmbVehicleAssetCat = "";

  txtRegNo = "";
  txtEngine = "";
  txtChasis = "";
  txtTagNo = "1";
  txtTransDesc = "";
  txtDeploy = "";

  searchVehicleAssetCat = "";
  searchType = "";
  searchModel = "";
  searchMake = "";

  imgVehiclePath = "C:/inetpub/wwwroot/FAR/FAR_Project/assets/vehicleImg";
  imageVehicleUrl: string =
    "../../../../../assets/assetEntryImg/dropHereImg.png";
  imageVehicle;
  imgFileVehicle;
  selectedVehicleFile: File = null;
  lblFileName = "";

  vehicleList = [];
  vehAssetCatList = [];
  vehTypeList = [];
  vehModelList = [];
  vehMakeList = [];
  tempAssetCatList = [];

  objList = [];
  paramType = "";
  index = 0;

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService,
    private app: AppComponent
  ) {}

  ngOnInit(): void {
    this.getVehicle();
    this.getVehicleMake();
    this.getVehicleModel();
    this.getVehicleType();
    this.getAssetCategory();
  }

  getVehicle() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getvehicles", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehicleList = data;
        this.loadingBar = false;
      });
  }

  getVehicleMake() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getvehiclemake", { headers: reqHeader })
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
      .get(this.app.serverUrl + "getvehiclemodel", { headers: reqHeader })
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
      .get(this.app.serverUrl + "getvehicletype", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehTypeList = data;
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
        // this.AssetCatList = data;
        this.vehAssetCatList = data.filter(
          (x) => x.accountsCatagoryDisplay == "VEHICLES"
        );
        this.tempAssetCatList = data;
      });
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

  openPDFFile() {
    if (this.imageVehicleUrl != "") {
      window.open(this.imageVehicleUrl);
    }
  }

  save() {
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
        "C:/inetpub/wwwroot/FAR/FAR_Project/assets/vehicleImg";
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
        .post(this.app.serverUrl + "savevehicle", saveData, {
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

            this.clearAll();
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

  clearAll() {
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

  edit(item) {
    this.imageVehicle = undefined;
    this.imgFileVehicle = undefined;
    this.selectedVehicleFile = null;
    this.imageVehicleUrl =
      "../../../../../assets/assetEntryImg/dropHereImg.png";
    this.lblFileName = "";

    this.vehID = item.id;
    this.txtRegNo = item.vehID;
    this.cmbMake = item.make;
    this.cmbModel = item.model;
    this.cmbType = item.type;
    this.cmbVehicleAssetCat = item.assetCatID;
    this.txtDeploy = item.deployedWith;
    this.txtEngine = item.engineNum;
    this.txtChasis = item.chasisNum;
    // this.cmbVehicle = "";
    if (item.eDoc != null) {
      this.imageVehicleUrl =
        // "http://192.168.100.162:7000/assets/vehicleImg/" + item.id + ".pdf";
        "http://125.209.107.136:7000/assets/vehicleImg/" + item.id + ".pdf";
      this.lblFileName = "Open Uploaded File";
    }
  }

  delete(obj) {}

  genPin(obj, param, i) {
    if (this.cookie.get("pinstatus") == "true") {
      this.txtPin = "";
      this.objList = [];
      this.paramType = "";
      this.objList = obj;
      this.paramType = param;
      this.index = i;
      if (param == "active") {
        // alert(obj.isActivated);
        // setTimeout(this.sld)
        // if (obj.isActivated == false) {
        //   setTimeout(() => (this.wngSectionList[i].isActivated = true), 10);
        // } else {
        //   setTimeout(() => (this.wngSectionList[i].isActivated = false), 10);
        // }
      }
      $("#genPinModal").modal("show");
    } else {
      if (param == "active") {
        // if (obj.isActivated == false) {
        //   setTimeout(() => (this.wngSectionList[i].isActivated = true), 10);
        // } else {
        //   setTimeout(() => (this.wngSectionList[i].isActivated = false), 10);
        // }
      }

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
        .post(this.app.serverUrl + "resetPw", saveData, { headers: reqHeader })
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
        .post(this.app.serverUrl + "pincode", saveData, { headers: reqHeader })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            $("#genPinModal").modal("hide");
            if (this.paramType == "edit") {
              this.edit(this.objList);
            } else if (this.paramType == "delete") {
              this.delete(this.objList);
            }
            // else if (this.paramType == "active") {
            //   this.active(this.objList);
            // }
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
}
