import { Component, OnInit, ChangeDetectorRef } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { CookieService } from "ngx-cookie-service";
import { MatTableDataSource } from "@angular/material/table";

declare var $: any;

export class Group {
  level = 0;
  parent: Group;
  expanded = true;
  totalCounts = 0;
  get visible(): boolean {
    return !this.parent || (this.parent.visible && this.parent.expanded);
  }
}

@Component({
  selector: "app-asset-register-rpt",
  templateUrl: "./asset-register-rpt.component.html",
  styleUrls: ["./asset-register-rpt.component.scss"],
})
export class AssetRegisterRptComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://localhost:12345/api/";

  // serverUrl = "http://localhost:6090/api/";

  // declarations
  searchLocation = "";
  cmbLocation = "";
  cmbOfcType = "";
  cmbWngSection = "";
  searchSection = "";
  tempRptTitle = "";
  rptTitle = "Asset Register Report - General";
  rptHeader = "";
  rptPreset = "";
  rdbFilter = "";
  rptTitle2nd = "";

  assetRegisterList = [];
  filterAssetRegisterList = [];
  locList = [];
  ofcTypeList = [];
  wngSectionList = [];

  //group by table setting
  title = "Grid Grouping";

  public dataSource = new MatTableDataSource<any | Group>([]);

  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];

  generalColumns: any[];
  computerColumns: any[];
  vehicleColumns: any[];
  bookColumns: any[];

  constructor(
    private http: HttpClient,
    private app: AppComponent,
    private cookie: CookieService,
    private cdr: ChangeDetectorRef
  ) {
    this.columns = [
      {
        field: "subLocationDescription",
        title: "Main Location",
        display: true,
      },
      {
        field: "officeTypeDescription",
        title: "Sub Location",
        display: true,
      },
      {
        field: "officeDescription",
        title: "Office",
        display: true,
      },
      {
        field: "accountsCatagory",
        title: "Accounts Category",
        display: true,
      },
      {
        field: "assetCatDescription",
        title: "Asset Name",
        display: true,
      },
      {
        field: "tag",
        title: "Tag. ID",
        display: true,
      },
      {
        field: "postName",
        title: "Custodian",
        display: true,
      },
      { field: "assetDescription", title: "Asset Description", display: true },

      // computers extra fields
      { field: "make", title: "Make", display: true },
      { field: "model", title: "Model", display: true },
      { field: "size", title: "Size", display: true },
      { field: "processor", title: "Processor", display: true },
      { field: "generation", title: "Genration", display: true },
      { field: "ram", title: "RAM", display: true },
      { field: "driveType1", title: "Drive-01", display: true },
      { field: "hd1", title: "size", display: true },
      { field: "driveType2", title: "Drive-02", display: true },
      { field: "hd2", title: "size", display: true },

      // vehcile extra fields
      { field: "vehMake", title: "Veh-Make", display: true },
      { field: "vehType", title: "Veh-Type", display: true },
      { field: "vehEngineNum", title: "Veh-Engine No.", display: true },
      { field: "vehModel", title: "Veh-Model", display: true },
      { field: "vehChasisNum", title: "Veh-Chasis No.", display: true },

      // books extra fields
      { field: "author", title: "Author", display: true },
      { field: "publisher", title: "Publisher", display: true },
      { field: "volume", title: "Volume", display: true },
      { field: "edition", title: "Edition", display: true },

      {
        field: "ipcRef",
        title: "IPC/Invoice Ref.",
        display: true,
      },
      {
        field: "projectShortName",
        title: "Project",
        display: true,
      },
      {
        field: "purchaseDate",
        title: "Purchase Date",
        display: true,
      },
      {
        field: "costAmount",
        title: "Cost Price",
        display: true,
      },
      {
        field: "assetCondition",
        title: "Condition",
        display: true,
      },
      {
        field: "previousTag",
        title: "old Tag",
        display: true,
      },
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["subLocationDescription"];
  }

  ngOnInit(): void {
    $("#rptOptionsModal").modal("show");
    this.getLocation();
    // this.getAssetRegister();
    this.getOfficeType();

    // general columns settings
    this.generalColumns = [
      {
        field: "subLocationDescription",
        title: "Main Location",
        display: true,
      },
      {
        field: "officeTypeDescription",
        title: "Sub Location",
        display: true,
      },
      {
        field: "officeDescription",
        title: "Office",
        display: true,
      },
      {
        field: "accountsCatagory",
        title: "Accounts Category",
        display: true,
      },
      {
        field: "assetCatDescription",
        title: "Asset Name",
        display: true,
      },
      {
        field: "tag",
        title: "Tag. ID",
        display: true,
      },
      {
        field: "postName",
        title: "Custodian",
        display: true,
      },
      { field: "assetDescription", title: "Asset Description", display: true },

      // computers extra fields
      { field: "make", title: "Make", display: false },
      { field: "model", title: "Model", display: false },
      { field: "size", title: "Size", display: false },
      { field: "processor", title: "Processor", display: false },
      { field: "generation", title: "Genration", display: false },
      { field: "ram", title: "RAM", display: false },
      { field: "driveType1", title: "Drive-01", display: false },
      { field: "hd1", title: "size", display: false },
      { field: "driveType2", title: "Drive-02", display: false },
      { field: "hd2", title: "size", display: false },

      // vehcile extra fields
      { field: "vehMake", title: "Veh-Make", display: false },
      { field: "vehType", title: "Veh-Type", display: false },
      { field: "vehEngineNum", title: "Veh-Engine No.", display: false },
      { field: "vehModel", title: "Veh-Model", display: false },
      { field: "vehChasisNum", title: "Veh-Chasis No.", display: false },

      // books extra fields
      { field: "author", title: "Author", display: false },
      { field: "publisher", title: "Publisher", display: false },
      { field: "volume", title: "Volume", display: false },
      { field: "edition", title: "Edition", display: false },

      {
        field: "ipcRef",
        title: "IPC/Invoice Ref.",
        display: true,
      },
      {
        field: "projectShortName",
        title: "Project",
        display: true,
      },
      {
        field: "purchaseDate",
        title: "Purchase Date",
        display: true,
      },
      {
        field: "costAmount",
        title: "Cost Price",
        display: true,
      },
      {
        field: "assetCondition",
        title: "Condition",
        display: true,
      },
      {
        field: "previousTag",
        title: "old Tag",
        display: true,
      },
    ];

    // computer columns settings
    this.computerColumns = [
      {
        field: "subLocationDescription",
        title: "Main Location",
        display: true,
      },
      {
        field: "officeTypeDescription",
        title: "Sub Location",
        display: true,
      },
      {
        field: "officeDescription",
        title: "Office",
        display: true,
      },
      {
        field: "accountsCatagory",
        title: "Accounts Category",
        display: true,
      },
      {
        field: "assetCatDescription",
        title: "Asset Name",
        display: true,
      },
      {
        field: "tag",
        title: "Tag. ID",
        display: true,
      },
      {
        field: "postName",
        title: "Custodian",
        display: true,
      },
      { field: "assetDescription", title: "Asset Description", display: true },

      // computers extra fields
      { field: "make", title: "Make", display: true },
      { field: "model", title: "Model", display: true },
      { field: "size", title: "Size", display: true },
      { field: "processor", title: "Processor", display: true },
      { field: "generation", title: "Genration", display: true },
      { field: "ram", title: "RAM", display: true },
      { field: "driveType1", title: "Drive-01", display: true },
      { field: "hd1", title: "size", display: true },
      { field: "driveType2", title: "Drive-02", display: true },
      { field: "hd2", title: "size", display: true },

      // vehcile extra fields
      { field: "vehMake", title: "Veh-Make", display: false },
      { field: "vehType", title: "Veh-Type", display: false },
      { field: "vehEngineNum", title: "Veh-Engine No.", display: false },
      { field: "vehModel", title: "Veh-Model", display: false },
      { field: "vehChasisNum", title: "Veh-Chasis No.", display: false },

      // books extra fields
      { field: "author", title: "Author", display: false },
      { field: "publisher", title: "Publisher", display: false },
      { field: "volume", title: "Volume", display: false },
      { field: "edition", title: "Edition", display: false },

      {
        field: "ipcRef",
        title: "IPC/Invoice Ref.",
        display: true,
      },
      {
        field: "projectShortName",
        title: "Project",
        display: true,
      },
      {
        field: "purchaseDate",
        title: "Purchase Date",
        display: true,
      },
      {
        field: "costAmount",
        title: "Cost Price",
        display: true,
      },
      {
        field: "assetCondition",
        title: "Condition",
        display: true,
      },
      {
        field: "previousTag",
        title: "old Tag",
        display: true,
      },
    ];

    // vehicle columns settings
    this.vehicleColumns = [
      {
        field: "subLocationDescription",
        title: "Main Location",
        display: true,
      },
      {
        field: "officeTypeDescription",
        title: "Sub Location",
        display: true,
      },
      {
        field: "officeDescription",
        title: "Office",
        display: true,
      },
      {
        field: "accountsCatagory",
        title: "Accounts Category",
        display: true,
      },
      {
        field: "assetCatDescription",
        title: "Asset Name",
        display: true,
      },
      {
        field: "tag",
        title: "Tag. ID",
        display: true,
      },
      {
        field: "postName",
        title: "Custodian",
        display: true,
      },
      { field: "assetDescription", title: "Asset Description", display: true },

      // computers extra fields
      { field: "make", title: "Make", display: false },
      { field: "model", title: "Model", display: false },
      { field: "size", title: "Size", display: false },
      { field: "processor", title: "Processor", display: false },
      { field: "generation", title: "Genration", display: false },
      { field: "ram", title: "RAM", display: false },
      { field: "driveType1", title: "Drive-01", display: false },
      { field: "hd1", title: "size", display: false },
      { field: "driveType2", title: "Drive-02", display: false },
      { field: "hd2", title: "size", display: false },

      // vehcile extra fields
      { field: "vehMake", title: "Veh-Make", display: true },
      { field: "vehType", title: "Veh-Type", display: true },
      { field: "vehEngineNum", title: "Veh-Engine No.", display: true },
      { field: "vehModel", title: "Veh-Model", display: true },
      { field: "vehChasisNum", title: "Veh-Chasis No.", display: true },

      // books extra fields
      { field: "author", title: "Author", display: false },
      { field: "publisher", title: "Publisher", display: false },
      { field: "volume", title: "Volume", display: false },
      { field: "edition", title: "Edition", display: false },

      {
        field: "ipcRef",
        title: "IPC/Invoice Ref.",
        display: true,
      },
      {
        field: "projectShortName",
        title: "Project",
        display: true,
      },
      {
        field: "purchaseDate",
        title: "Purchase Date",
        display: true,
      },
      {
        field: "costAmount",
        title: "Cost Price",
        display: true,
      },
      {
        field: "assetCondition",
        title: "Condition",
        display: true,
      },
      {
        field: "previousTag",
        title: "old Tag",
        display: true,
      },
    ];

    // Books columns settings
    this.bookColumns = [
      {
        field: "subLocationDescription",
        title: "Main Location",
        display: true,
      },
      {
        field: "officeTypeDescription",
        title: "Sub Location",
        display: true,
      },
      {
        field: "officeDescription",
        title: "Office",
        display: true,
      },
      {
        field: "accountsCatagory",
        title: "Accounts Category",
        display: true,
      },
      {
        field: "assetCatDescription",
        title: "Asset Name",
        display: true,
      },
      {
        field: "tag",
        title: "Tag. ID",
        display: true,
      },
      {
        field: "postName",
        title: "Custodian",
        display: true,
      },
      { field: "assetDescription", title: "Asset Description", display: true },

      // computers extra fields
      { field: "make", title: "Make", display: false },
      { field: "model", title: "Model", display: false },
      { field: "size", title: "Size", display: false },
      { field: "processor", title: "Processor", display: false },
      { field: "generation", title: "Genration", display: false },
      { field: "ram", title: "RAM", display: false },
      { field: "driveType1", title: "Drive-01", display: false },
      { field: "hd1", title: "size", display: false },
      { field: "driveType2", title: "Drive-02", display: false },
      { field: "hd2", title: "size", display: false },

      // vehcile extra fields
      { field: "vehMake", title: "Veh-Make", display: false },
      { field: "vehType", title: "Veh-Type", display: false },
      { field: "vehEngineNum", title: "Veh-Engine No.", display: false },
      { field: "vehModel", title: "Veh-Model", display: false },
      { field: "vehChasisNum", title: "Veh-Chasis No.", display: false },

      // books extra fields
      { field: "author", title: "Author", display: true },
      { field: "publisher", title: "Publisher", display: true },
      { field: "volume", title: "Volume", display: true },
      { field: "edition", title: "Edition", display: true },

      {
        field: "ipcRef",
        title: "IPC/Invoice Ref.",
        display: true,
      },
      {
        field: "projectShortName",
        title: "Project",
        display: true,
      },
      {
        field: "purchaseDate",
        title: "Purchase Date",
        display: true,
      },
      {
        field: "costAmount",
        title: "Cost Price",
        display: true,
      },
      {
        field: "assetCondition",
        title: "Condition",
        display: true,
      },
      {
        field: "previousTag",
        title: "old Tag",
        display: true,
      },
    ];
  }

  // displayedColumns: string[] = ["position", "name", "weight", "symbol"];

  // dataSource: any;

  getDisplayedColumns(): string[] {
    return this.columns
      .filter((cd) => cd.display == true)
      .map((cd) => cd.field);
  }

  showItem() {
    this.getAssetRegister();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  getLocation() {
    // debugger;
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

  showOfficeType() {
    var ofcType = this.locList.filter((x) => x.subLocID == this.cmbLocation);
    this.cmbOfcType = ofcType[0].officeTypeID;

    this.tempRptTitle =
      ofcType[0].subLocationDescription +
      " - " +
      ofcType[0].officeTypeDescription;

    this.getWingSection(this.cmbOfcType);
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

  printDiv() {
    this.app.printReport("#myTable");
  }

  exportExcel() {
    this.app.exportExcel("myTable", "Asset Register");
  }

  clear() {
    this.cmbLocation = "";
    this.cmbOfcType = "";
    this.cmbWngSection = "";
    this.tempRptTitle = "";
    this.rptHeader = "";
  }

  getAssetRegister() {
    var subLocID = 0;
    var officeTypeID = 0;
    var userID = this.cookie.get("userID");

    //clear filters
    this.rdbFilter = "";
    this.rptTitle2nd = "";

    // header setting
    if (this.tempRptTitle != "") {
      this.rptHeader = this.tempRptTitle;
    }

    if (this.cmbLocation == "" || this.cmbLocation == undefined) {
      subLocID = 0;
    } else {
      subLocID = parseInt(this.cmbLocation);
    }

    if (this.cmbOfcType == "" || this.cmbOfcType == undefined) {
      officeTypeID = 0;
    } else {
      officeTypeID = parseInt(this.cmbOfcType);
    }

    // general report preset generation
    if (this.rptPreset == "1") {
      this.columns = this.generalColumns;
      this.rptTitle = "Moveable Asset Register - General Items";
      this.getAssetRegisterGeneral(userID, subLocID, officeTypeID);
    }

    // computer report preset generation
    else if (this.rptPreset == "2") {
      this.columns = this.computerColumns;
      this.rptTitle = "Moveable Asset Register - Computer Items";
      this.getAssetRegisterComputer(userID, subLocID, officeTypeID);
    }

    // vehicle report preset generation
    else if (this.rptPreset == "3") {
      this.columns = this.vehicleColumns;
      this.rptTitle = "Moveable Asset Register - Vehicles";
      this.getAssetRegisterVehicle(userID, subLocID, officeTypeID);
    }

    // Books report preset generation
    else if (this.rptPreset == "4") {
      this.columns = this.bookColumns;
      this.rptTitle = "Moveable Asset Register - Books";
      this.getAssetRegisterBooks(userID, subLocID, officeTypeID);
    }
  }

  // asset Register general
  getAssetRegisterGeneral(userID, subLocID, officeTypeID) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      .get(
        this.serverUrl +
          "getAssetdetailGeneral?UserId=" +
          userID +
          "&SubLocID=" +
          subLocID +
          "&OfficeTypeID=" +
          officeTypeID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetRegisterList = data;
        this.filterAssetRegisterList = data;

        data.forEach((item, index) => {
          item.id = index + 1;
        });
        this._alldata = data;
        this.dataSource.data = this.addGroups(
          this._alldata,
          this.groupByColumns
        );
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
        this.cdr.detectChanges();

        // this.dataSource = this.filterAssetRegisterList;
      });
  }

  getAssetRegisterVehicle(userID, subLocID, officeTypeID) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl +
          "getAssetdetailVehicles?UserId=" +
          userID +
          "&SubLocID=" +
          subLocID +
          "&OfficeTypeID=" +
          officeTypeID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetRegisterList = data;
        this.filterAssetRegisterList = data;

        data.forEach((item, index) => {
          item.id = index + 1;
        });
        this._alldata = data;
        this.dataSource.data = this.addGroups(
          this._alldata,
          this.groupByColumns
        );
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
        this.cdr.detectChanges();

        // this.dataSource = this.filterAssetRegisterList;
      });
  }

  // asset register computer
  getAssetRegisterComputer(userID, subLocID, officeTypeID) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl +
          "getAssetdetailComputers?UserId=" +
          userID +
          "&SubLocID=" +
          subLocID +
          "&OfficeTypeID=" +
          officeTypeID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetRegisterList = data;
        this.filterAssetRegisterList = data;

        data.forEach((item, index) => {
          item.id = index + 1;
        });
        this._alldata = data;
        this.dataSource.data = this.addGroups(
          this._alldata,
          this.groupByColumns
        );
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
        this.cdr.detectChanges();

        // this.dataSource = this.filterAssetRegisterList;
      });
  }

  // asset register computer
  getAssetRegisterBooks(userID, subLocID, officeTypeID) {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl +
          "getAssetdetailBooks?UserId=" +
          userID +
          "&SubLocID=" +
          subLocID +
          "&OfficeTypeID=" +
          officeTypeID,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        this.assetRegisterList = data;
        this.filterAssetRegisterList = data;

        data.forEach((item, index) => {
          item.id = index + 1;
        });
        this._alldata = data;
        this.dataSource.data = this.addGroups(
          this._alldata,
          this.groupByColumns
        );
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
        this.cdr.detectChanges();

        // this.dataSource = this.filterAssetRegisterList;
      });
  }

  // apply report filters
  applyReportFilter() {
    var filteredData: any;

    if (this.rdbFilter == "useable") {
      filteredData = this.assetRegisterList.filter((x) => x.isUseable == true);
      this.rptTitle2nd = "Useable Assets";
    } else if (this.rdbFilter == "serviceable") {
      filteredData = this.assetRegisterList.filter(
        (x) => x.isServiceAble == true
      );
      this.rptTitle2nd = "Serviceable Assets";
    } else if (this.rdbFilter == "surplus") {
      filteredData = this.assetRegisterList.filter((x) => x.isSurplus == true);
      this.rptTitle2nd = "Surplus Assets";
    } else if (this.rdbFilter == "condemned") {
      filteredData = this.assetRegisterList.filter(
        (x) => x.isCondemned == true
      );
      this.rptTitle2nd = "Condemned Assets";
    } else if (this.rdbFilter == "missing") {
      filteredData = this.assetRegisterList.filter((x) => x.isMissing == true);
      this.rptTitle2nd = "Missing Assets";
    } else if (this.rdbFilter == "transferred") {
      filteredData = this.assetRegisterList.filter(
        (x) => x.isTransfered == true
      );
      this.rptTitle2nd = "Transferred Assets";
    }

    filteredData.forEach((item, index) => {
      item.id = index + 1;
    });
    this._alldata = filteredData;
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.dataSource.filter = performance.now().toString();
    this.cdr.detectChanges();
  }

  groupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, true);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  checkGroupByColumn(field, add) {
    let found = null;
    for (const column of this.groupByColumns) {
      if (column === field) {
        found = this.groupByColumns.indexOf(column, 0);
      }
    }
    if (found != null && found >= 0) {
      if (!add) {
        this.groupByColumns.splice(found, 1);
      }
    } else {
      if (add) {
        this.groupByColumns.push(field);
      }
    }
  }

  unGroupBy(event, column) {
    event.stopPropagation();
    this.checkGroupByColumn(column.field, false);
    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filter = performance.now().toString();
  }

  // below is for grid row grouping
  customFilterPredicate(data: any | Group, filter: string): boolean {
    return data instanceof Group ? data.visible : this.getDataRowVisible(data);
  }

  getDataRowVisible(data: any): boolean {
    // debugger;
    const groupRows = this.dataSource.data.filter((row) => {
      if (!(row instanceof Group)) {
        return false;
      }
      let match = true;
      this.groupByColumns.forEach((column) => {
        if (!row[column] || !data[column] || row[column] !== data[column]) {
          match = false;
        }
      });
      return match;
    });

    if (groupRows.length === 0) {
      return true;
    }
    const parent = groupRows[0] as Group;
    return parent.visible && parent.expanded;
  }

  groupHeaderClick(row) {
    row.expanded = !row.expanded;
    this.dataSource.filter = performance.now().toString(); // bug here need to fix
  }

  addGroups(data: any[], groupByColumns: string[]): any[] {
    const rootGroup = new Group();
    rootGroup.expanded = true;
    return this.getSublevel(data, 0, groupByColumns, rootGroup);
  }

  getSublevel(
    data: any[],
    level: number,
    groupByColumns: string[],
    parent: Group
  ): any[] {
    if (level >= groupByColumns.length) {
      return data;
    }
    const groups = this.uniqueBy(
      data.map((row) => {
        const result = new Group();
        result.level = level + 1;
        result.parent = parent;
        for (let i = 0; i <= level; i++) {
          result[groupByColumns[i]] = row[groupByColumns[i]];
        }
        return result;
      }),
      JSON.stringify
    );

    // debugger;
    const currentColumn = groupByColumns[level];
    let subGroups = [];
    groups.forEach((group) => {
      const rowsInGroup = data.filter(
        (row) => group[currentColumn] === row[currentColumn]
      );
      group.totalCounts = rowsInGroup.length;
      const subGroup = this.getSublevel(
        rowsInGroup,
        level + 1,
        groupByColumns,
        group
      );
      subGroup.unshift(group);
      subGroups = subGroups.concat(subGroup);
    });
    return subGroups;
  }

  uniqueBy(a, key) {
    const seen = {};
    return a.filter((item) => {
      const k = key(item);
      return seen.hasOwnProperty(k) ? false : (seen[k] = true);
    });
  }

  isGroup(index, item): boolean {
    return item.level;
  }
}
