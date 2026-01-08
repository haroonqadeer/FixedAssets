import { DatePipe } from "@angular/common";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserIdleService } from "angular-user-idle";
import { ToastrManager } from "ng6-toastr-notifications";
import { CookieService } from "ngx-cookie-service";
import { AppComponent } from "src/app/app.component";

@Component({
  selector: "app-vehicle-entry",
  templateUrl: "./vehicle-entry.component.html",
  styleUrls: ["./vehicle-entry.component.scss"],
})
export class VehicleEntryComponent implements OnInit {
  //declaration
  vehID = 0;
  vehNo = "";
  model = "";
  engineNum = "";
  chasisNum = "";
  cnic = "";
  designation = "";
  officialName = "";
  vehicleMakeID = 0;
  srchVehicleMake = "";
  vehicleTypeID = 0;
  srchVehicleType = "";
  projectID = 0;
  srchProject = "";
  regionID = 0;
  srchRegion = "";
  isActive = false;
  vehActive = false;
  spType = "";

  srchTable = "";

  //lists
  vehicleMakeList = [];
  vehicleTypeList = [];
  projectList = [];
  regionList = [];
  vehicleList = [];

  constructor(
    private router: Router,
    private cookie: CookieService,
    private userIdle: UserIdleService,
    private toastr: ToastrManager,
    private http: HttpClient,
    private app: AppComponent,
    private datePipe: DatePipe
  ) {}
  ngOnInit(): void {
    this.getVehicleMakes();
    this.getProjects();
    this.getRegions();
    this.getVehicles();
  }

  getVehicleMakes() {
    // alert(this.cookie.get("userID"));
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getVehicleMakes", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehicleMakeList = data;
      });
  }

  getVehicleTypes() {
    // alert(this.cookie.get("userID"));
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      .get(
        this.app.serverUrl +
          "getVehicleTypes?vehicleMakeID=" +
          this.vehicleMakeID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.vehicleTypeList = data;
        console.log(data);
        this.vehicleTypeList = data;
      });
  }

  getVehicles() {
    // alert(this.cookie.get("userID"));
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getVehiclesNew", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehicleList = data;
        console.log(data);
      });
  }

  getProjects() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getprojects?IsActivated=1", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.projectList = data;
      });
  }

  getRegions() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getRegionsNew", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.regionList = data;
      });
  }

  save() {
    if (this.vehNo === undefined || this.vehNo.trim() === "") {
      this.toastr.errorToastr("enter vehicle no.", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.vehicleMakeID === undefined || this.vehicleMakeID === 0) {
      this.toastr.errorToastr("select vehicle make", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.vehicleTypeID === undefined || this.vehicleTypeID === 0) {
      this.toastr.errorToastr("select vehicle type", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.model === undefined || this.model.trim() === "") {
      this.toastr.errorToastr("enter vehicle model", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.engineNum === undefined || this.engineNum.trim() === "") {
      this.toastr.errorToastr("enter vehicle engine no.", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.chasisNum === undefined || this.chasisNum.trim() === "") {
      this.toastr.errorToastr("enter vehicle chasis no.", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    }
    // else if (this.projectID === undefined || this.projectID === 0) {
    //   this.toastr.errorToastr("select project", "Error !", {
    //     toastTimeout: 2500,
    //   });
    //   return false;
    // }
    else if (this.cnic === undefined || this.cnic.trim() === "") {
      this.toastr.errorToastr("enter official's cnic no.", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.cnic.length !== 13) {
      this.toastr.errorToastr("invalid cnic no.", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.officialName === undefined ||
      this.officialName.trim() === ""
    ) {
      this.toastr.errorToastr("enter offical name", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      this.designation === undefined ||
      this.designation.trim() === ""
    ) {
      this.toastr.errorToastr("enter official's designation", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.regionID === undefined || this.regionID === 0) {
      this.toastr.errorToastr("select region", "Error !", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.spType = "INSERT";
      var active = 0;
      if (this.isActive === true) {
        active = 1;
      }
      if (this.vehID != 0) {
        this.spType = "UPDATE";
      }
      var saveData = {
        vehID: this.vehID,
        vehNo: this.vehNo,
        vehMakeID: this.vehicleMakeID,
        vehTypeID: this.vehicleTypeID,
        model: this.model,
        engineNum: this.engineNum,
        chasisNum: this.chasisNum,
        projectID: this.projectID,
        cnic: this.cnic,
        officialName: this.officialName,
        designation: this.designation,
        regionID: this.regionID,
        isActive: active,
        userID: this.cookie.get("userID"),
        spType: this.spType,
      };
      console.log(saveData);
      this.vehicleCRUD(saveData);
      // var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
      // this.http
      //   .post(this.app.serverUrl + "saveVehicleNew", saveData, {
      //     headers: reqHeader,
      //   })
      //   .subscribe((data: any) => {
      //     console.log(data);
      //     if (data.msg == "success") {
      //       if (this.vehID == 0) {
      //         this.toastr.successToastr("saved successfully!", "Success!", {
      //           toastTimeout: 2500,
      //         });
      //       } else {
      //         this.toastr.successToastr("updated successfully!", "Success!", {
      //           toastTimeout: 2500,
      //         });
      //       }
      //       this.reset();
      //       this.getVehicles();
      //       return false;
      //     } else {
      //       this.toastr.errorToastr(data.msg, "Error !", {
      //         toastTimeout: 5000,
      //       });
      //     }
      //   });
    }
  }

  reset() {
    this.vehID = 0;
    this.vehNo = "";
    this.model = "";
    this.engineNum = "";
    this.chasisNum = "";
    this.cnic = "";
    this.designation = "";
    this.officialName = "";
    this.vehicleMakeID = 0;
    this.srchVehicleMake = "";
    this.vehicleTypeID = 0;
    this.srchVehicleType = "";
    this.projectID = 0;
    this.srchProject = "";
    this.regionID = 0;
    this.srchRegion = "";
    this.isActive = false;
  }

  edit(item) {
    if (item.isActive === 1) {
      this.vehID = item.vehID;
      this.vehNo = item.vehNo;
      this.vehicleMakeID = item.make;
      this.getVehicleTypes();
      this.vehicleTypeID = item.type;
      this.model = item.model;
      this.engineNum = item.engineNum;
      this.chasisNum = item.chasisNum;
      this.projectID = item.project;
      this.cnic = item.cnic;
      this.officialName = item.officialName;
      this.designation = item.designation;
      this.regionID = item.regionID;
    }
  }

  vehicleActivation(item) {
    var active = 0;
    debugger;
    if (item.isActive === true) {
      active = 1;
      this.spType = "ACTIVE";
    } else {
      this.spType = "DEACTIVE";
    }
    var saveData = {
      vehID: item.vehID,
      vehNo: item.vehNo,
      vehMakeID: item.make,
      vehTypeID: item.type,
      model: item.model,
      engineNum: item.engineNum,
      chasisNum: item.chasisNum,
      projectID: item.project,
      cnic: item.cnic,
      officialName: item.officialName,
      designation: item.designation,
      regionID: item.regionID,
      isActive: active,
      userID: this.cookie.get("userID"),
      spType: this.spType,
    };
    console.log(saveData);
    this.vehicleCRUD(saveData);
  }

  delete(item) {
    var active = 0;
    this.spType = "DELETE";
    var saveData = {
      vehID: item.vehID,
      vehNo: item.vehNo,
      vehMakeID: item.make,
      vehTypeID: item.type,
      model: item.model,
      engineNum: item.engineNum,
      chasisNum: item.chasisNum,
      projectID: item.project,
      cnic: item.cnic,
      officialName: item.officialName,
      designation: item.designation,
      regionID: item.regionID,
      isActive: active,
      userID: this.cookie.get("userID"),
      spType: this.spType,
    };
    console.log(saveData);
    this.vehicleCRUD(saveData);
  }

  vehicleCRUD(data: any) {
    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });
    this.http
      .post(this.app.serverUrl + "saveVehicleNew", data, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        console.log(data);
        if (data.msg == "success") {
          if (this.spType == "INSERT") {
            this.toastr.successToastr("saved successfully!", "Success!", {
              toastTimeout: 2500,
            });
          } else if (this.spType == "UPDATE") {
            this.toastr.successToastr("updated successfully!", "Success!", {
              toastTimeout: 2500,
            });
          } else if (this.spType == "ACTIVE") {
            this.toastr.successToastr("actived successfully!", "Success!", {
              toastTimeout: 2500,
            });
          } else if (this.spType == "DEACTIVE") {
            this.toastr.successToastr("de-active successfully!", "Success!", {
              toastTimeout: 2500,
            });
          }
          this.reset();
          this.getVehicles();
          return false;
        } else {
          this.toastr.errorToastr(data.msg, "Error !", {
            toastTimeout: 5000,
          });
        }
      });
  }
}
