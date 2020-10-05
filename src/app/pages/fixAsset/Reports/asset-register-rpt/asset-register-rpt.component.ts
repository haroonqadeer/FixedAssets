import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
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
import { ToastrManager } from "ng6-toastr-notifications";
import { MatSort } from "@angular/material/sort";

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

export class AssetItems {
  subLocationDescription: string = "";
  officeTypeDescription: string = "";
  officeDescription: string = "";
  accountsCatagory: string = "";
  assetCatDescription: string = "";
  tag: string = "";
  postName: string = "";
  assetLocation: string = "";
  assetDescription: string = "";
  make: string = "";
  model: string = "";
  size: string = "";
  processor: string = "";
  generation: string = "";
  ram: string = "";
  driveType1: string = "";
  hd1: string = "";
  driveType2: string = "";
  hd2: string = "";
  vehMake: string = "";
  vehType: string = "";
  vehEngineNum: string = "";
  vehModel: string = "";
  vehChasisNum: string = "";
  author: string = "";
  publisher: string = "";
  volume: string = "";
  edition: string = "";
  ipcRef: string = "";
  projectShortName: string = "";
  purchaseDate: string = "";
  costAmount: string = "";
  assetCondition: string = "";
  previousTag: string = "";
  createdBy: string = "";
  pics: string = "";
}

@Component({
  selector: "app-asset-register-rpt",
  templateUrl: "./asset-register-rpt.component.html",
  styleUrls: ["./asset-register-rpt.component.scss"],
})
export class AssetRegisterRptComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://localhost:12345/api/";

  // serverUrl = "http://localhost:6090/api/";

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  // declarations
  cmbRegion = "";
  searchRegion = "";

  searchLocation = "";
  cmbLocation = "";
  cmbOfficeTypeID = "";
  cmbProject = "";
  searchProject = "";
  cmbAccountsCat = "";
  cmbAssetCat = "";
  searchAssetCat = "";
  tempRptTitle = "";
  rptTitle = "Asset Register Report - General";
  rptHeader = "";
  rptPreset = "";
  rdbFilter = "";
  rptTitle2nd = "";

  assetRegisterList = [];
  filterAssetRegisterList = [];
  regionList = [];
  locList = [];
  filteredLocList = [];
  projectList = [];
  accountsCatList = [];
  filteredAccountsCatList = [];
  assetCatList = [];
  filteredAssetCatList = [];

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
    private cdr: ChangeDetectorRef,
    private toastr: ToastrManager
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
      { field: "assetLocation", title: "Asset Location", display: false },
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
      {
        field: "createdBy",
        title: "Created By",
        display: false,
      },
      {
        field: "pics",
        title: "Uploaded Pics",
        display: false,
      },
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["subLocationDescription"];
  }

  ngOnInit(): void {
    $("#rptOptionsModal").modal("show");

    debugger;
    this.getRegions();
    this.getLocation();
    this.getProjects();
    // this.getAssetRegister();
    this.getAccountCategories();
    this.getAssetCategories();

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
      { field: "assetLocation", title: "Asset Location", display: false },
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
      {
        field: "createdBy",
        title: "Created By",
        display: false,
      },
      {
        field: "pics",
        title: "Uploaded Pics",
        display: false,
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
      { field: "assetLocation", title: "Asset Location", display: false },
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
      {
        field: "createdBy",
        title: "Created By",
        display: false,
      },
      {
        field: "pics",
        title: "Uploaded Pics",
        display: false,
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
      { field: "assetLocation", title: "Asset Location", display: false },
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
      {
        field: "createdBy",
        title: "Created By",
        display: false,
      },
      {
        field: "pics",
        title: "Uploaded Pics",
        display: false,
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
      { field: "assetLocation", title: "Asset Location", display: false },
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
      {
        field: "createdBy",
        title: "Created By",
        display: false,
      },
      {
        field: "pics",
        title: "Uploaded Pics",
        display: false,
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

  getRegions() {
    // debugger;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(
        this.app.serverUrl + "getRegions?userId=" + this.cookie.get("userID"),
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        // this.locList = data.filter((x) => x.isActivated == 1);
        this.regionList = data;
      });
  }

  getLocation() {
    // debugger;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(
        this.app.serverUrl + "getLocations?userId=" + this.cookie.get("userID"),
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        // this.locList = data.filter((x) => x.isActivated == 1);
        this.locList = data;
        this.filteredLocList = data;
      });
  }

  getProjects() {
    // debugger;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(this.app.serverUrl + "getProjects", { headers: reqHeader })
      .subscribe((data: any) => {
        // this.locList = data.filter((x) => x.isActivated == 1);
        this.projectList = data;
      });
  }

  getAccountCategories() {
    // debugger;
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      // .get(this.app.serverUrl + "getsubloc", { headers: reqHeader })
      .get(this.app.serverUrl + "getAccountCategories", { headers: reqHeader })
      .subscribe((data: any) => {
        // this.locList = data.filter((x) => x.isActivated == 1);
        this.accountsCatList = data;
        this.filteredAccountsCatList = data;
      });
  }

  showLocations() {
    this.filteredLocList = this.locList.filter(
      (x) => x.mainLocID == this.cmbRegion
    );
  }

  filterAccountAndAssetCat() {
    if (this.rptPreset == "general") {
      this.filteredAccountsCatList = this.accountsCatList.filter(
        (x) =>
          x.accountsCatID == 2 ||
          x.accountsCatID == 3 ||
          x.accountsCatID == 4 ||
          x.accountsCatID == 6 ||
          x.accountsCatID == 7 ||
          x.accountsCatID == 8
      );
      this.filteredAssetCatList = this.assetCatList.filter(
        (x) =>
          x.accountsCatID == 2 ||
          x.accountsCatID == 3 ||
          x.accountsCatID == 4 ||
          x.accountsCatID == 6 ||
          x.accountsCatID == 7 ||
          x.accountsCatID == 8
      );
    } else if (this.rptPreset == "computer") {
      this.filteredAccountsCatList = this.accountsCatList.filter(
        (x) => x.accountsCatID == 1
      );
      this.filteredAssetCatList = this.assetCatList.filter(
        (x) => x.accountsCatID == 1
      );
    } else if (this.rptPreset == "vehicle") {
      this.filteredAccountsCatList = this.accountsCatList.filter(
        (x) => x.accountsCatID == 9
      );
      this.filteredAssetCatList = this.assetCatList.filter(
        (x) => x.accountsCatID == 9
      );
    } else if (this.rptPreset == "book") {
      this.filteredAccountsCatList = this.accountsCatList.filter(
        (x) => x.accountsCatID == 2
      );
      this.filteredAssetCatList = this.assetCatList.filter(
        (x) => x.accountsCatID == 2
      );
    }
  }

  getAssetCategories() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getAssetCategories", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        // this.wngSectionList = data.filter((x) => x.isActivated == 1);
        this.assetCatList = data;
        this.filteredAssetCatList = data;
      });
  }

  filterAssetCat() {
    this.filteredAssetCatList = this.assetCatList.filter(
      (x) => x.accountsCatID == this.cmbAccountsCat
    );
  }

  searchLoc(i) {
    this.cmbLocation = this.filteredLocList[i].subLocID;
  }

  printDiv() {
    this.app.printReport("#myTable");
  }

  exportExcel() {
    this.app.exportExcel("myTable", "Asset Register");
  }

  clear() {
    this.rptPreset = "";
    this.cmbRegion = "";
    this.cmbLocation = "";
    this.cmbOfficeTypeID = "";
    this.cmbProject = "";
    this.cmbAccountsCat = "";
    this.cmbAssetCat = "";
    this.tempRptTitle = "";
    this.rptHeader = "";
  }

  getAssetRegister() {
    var region = 0;
    var officeType = 0;
    var project = 0;
    var accountCat = 0;
    var assetCat = 0;
    var userID = this.cookie.get("userID");

    //clear filters
    this.rdbFilter = "";
    this.rptTitle2nd = "";

    // header setting
    if (this.tempRptTitle != "") {
      this.rptHeader = this.tempRptTitle;
    }

    if (this.cmbRegion == "" || this.cmbRegion == undefined) {
      region = 0;
    } else {
      region = parseInt(this.cmbRegion);
    }

    if (this.cmbOfficeTypeID == "" || this.cmbOfficeTypeID == undefined) {
      officeType = 0;
    } else {
      officeType = parseInt(this.cmbOfficeTypeID);
    }

    if (this.cmbProject == "" || this.cmbProject == undefined) {
      project = 0;
    } else {
      project = parseInt(this.cmbProject);
    }

    if (this.cmbAccountsCat == "" || this.cmbAccountsCat == undefined) {
      accountCat = 0;
    } else {
      accountCat = parseInt(this.cmbAccountsCat);
    }

    if (this.cmbAssetCat == "" || this.cmbAssetCat == undefined) {
      assetCat = 0;
    } else {
      assetCat = parseInt(this.cmbAssetCat);
    }

    // if everything is empty
    if (this.rptPreset == "" || this.rptPreset == undefined) {
      this.toastr.errorToastr("Please Select Report Preset", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (
      region == 0 &&
      officeType == 0 &&
      project == 0 &&
      accountCat == 0 &&
      assetCat == 0
    ) {
      this.toastr.errorToastr(
        "Please Select one option from Region, Office Type, Project, Accounts Category and Asset Category",
        "Error",
        {
          toastTimeout: 2500,
        }
      );
      return false;
    }
    // http call
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });
    this.http
      .get(
        this.app.serverUrl +
          "getMoveableAssetdetailRpt?UserId=" +
          userID +
          "&mainLocID=" +
          region +
          "&subLocID=" +
          this.cmbLocation +
          "&officeTypeID=" +
          officeType +
          "&projectID=" +
          project +
          "&accountsCatID=" +
          accountCat +
          "&assetCatID=" +
          assetCat +
          "&type=" +
          this.rptPreset,
        { headers: reqHeader }
      )
      .subscribe((data: any) => {
        // this.assetRegisterList = data;
        // this.filterAssetRegisterList = data;

        data.forEach((item, index) => {
          item.id = index + 1;
        });
        // this._alldata = data;
        this._alldata = [];
        debugger;
        // if region
        if (region != 0) {
          if (this._alldata.length == 0) {
            this._alldata = data;
          }
        }
        if (officeType != 0) {
          if (this._alldata.length == 0) {
            this._alldata = data;
          } else {
            this._alldata = data.filter(
              (x) =>
                x.subLocID == this.cmbLocation && x.officeTypeID == officeType
            );
          }
        }
        if (project != 0) {
          if (this._alldata.length == 0) {
            this._alldata = data;
          } else {
            this._alldata = data.filter((x) => x.projectID == project);
          }
        }
        if (accountCat != 0) {
          if (this._alldata.length == 0) {
            this._alldata = data;
          } else {
            this._alldata = data.filter((x) => x.accountsCatID == accountCat);
          }
        }
        if (assetCat != 0) {
          if (this._alldata.length == 0) {
            this._alldata = data;
          } else {
            this._alldata = data.filter((x) => x.assetCatID == assetCat);
          }
        }
        this.filterAssetRegisterList = this._alldata;
        //this.dataSource.sort = this.sort;
        this.dataSource.data = this.addGroups(
          this.filterAssetRegisterList,
          this.groupByColumns
        );
        this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
        this.dataSource.filter = performance.now().toString();
        this.cdr.detectChanges();
        $("#rptOptionsModal").modal("hide");
        // this.dataSource = this.filterAssetRegisterList;
      });

    // general report preset generation
    if (this.rptPreset == "general") {
      this.columns = this.generalColumns;
      this.rptTitle = "Moveable Asset Register - General Items";
    }

    // computer report preset generation
    else if (this.rptPreset == "computer") {
      this.columns = this.computerColumns;
      this.rptTitle = "Moveable Asset Register - Computer Items";
    }

    // vehicle report preset generation
    else if (this.rptPreset == "vehicle") {
      this.columns = this.vehicleColumns;
      this.rptTitle = "Moveable Asset Register - Vehicles";
    }

    // Books report preset generation
    else if (this.rptPreset == "book") {
      this.columns = this.bookColumns;
      this.rptTitle = "Moveable Asset Register - Books";
    }
  }

  // apply report filters
  applyReportFilter() {
    var filteredData: any;

    if (this.rdbFilter == "useable") {
      filteredData = this._alldata.filter((x) => x.isUseable == true);
      this.rptTitle2nd = "Useable Assets";
    } else if (this.rdbFilter == "serviceable") {
      filteredData = this._alldata.filter((x) => x.isServiceAble == true);
      this.rptTitle2nd = "Serviceable Assets";
    } else if (this.rdbFilter == "surplus") {
      filteredData = this._alldata.filter((x) => x.isSurplus == true);
      this.rptTitle2nd = "Surplus Assets";
    } else if (this.rdbFilter == "condemned") {
      filteredData = this._alldata.filter((x) => x.isCondemned == true);
      this.rptTitle2nd = "Condemned Assets";
    } else if (this.rdbFilter == "missing") {
      filteredData = this._alldata.filter((x) => x.isMissing == true);
      this.rptTitle2nd = "Missing Assets";
    } else if (this.rdbFilter == "transferred") {
      filteredData = this._alldata.filter((x) => x.isTransfered == true);
      this.rptTitle2nd = "Transferred Assets";
    }

    filteredData.forEach((item, index) => {
      item.id = index + 1;
    });
    this.filterAssetRegisterList = filteredData;
    this.dataSource.data = this.addGroups(
      this.filterAssetRegisterList,
      this.groupByColumns
    );
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

  onSortData(sort: MatSort) {
    let data = this.filterAssetRegisterList;
    const index = data.findIndex((x) => x["level"] == 1);
    if (sort.active && sort.direction !== "") {
      if (index > -1) {
        data.splice(index, 1);
      }

      data = data.sort((a: AssetItems, b: AssetItems) => {
        const isAsc = sort.direction === "asc";
        switch (sort.active) {
          case "subLocationDescription":
            return this.compare(
              a.subLocationDescription,
              b.subLocationDescription,
              isAsc
            );
          case "officeTypeDescription":
            return this.compare(
              a.officeTypeDescription,
              b.officeTypeDescription,
              isAsc
            );
          case "officeDescription":
            return this.compare(
              a.officeDescription,
              b.officeDescription,
              isAsc
            );
          case "accountsCatagory":
            return this.compare(a.accountsCatagory, b.accountsCatagory, isAsc);
          case "assetCatDescription":
            return this.compare(
              a.assetCatDescription,
              b.assetCatDescription,
              isAsc
            );
          case "tag":
            return this.compare(a.tag, b.tag, isAsc);
          case "postName":
            return this.compare(a.postName, b.postName, isAsc);
          case "assetLocation":
            return this.compare(a.assetLocation, b.assetLocation, isAsc);
          case "assetDescription":
            return this.compare(a.assetDescription, b.assetDescription, isAsc);
          case "make":
            return this.compare(a.make, b.make, isAsc);
          case "model":
            return this.compare(a.model, b.model, isAsc);
          case "size":
            return this.compare(a.size, b.size, isAsc);
          case "processor":
            return this.compare(a.processor, b.processor, isAsc);
          case "generation":
            return this.compare(a.generation, b.generation, isAsc);
          case "ram":
            return this.compare(a.ram, b.ram, isAsc);
          case "driveType1":
            return this.compare(a.driveType1, b.driveType1, isAsc);
          case "hd1":
            return this.compare(a.hd1, b.hd1, isAsc);
          case "driveType2":
            return this.compare(a.driveType2, b.driveType2, isAsc);
          case "hd2":
            return this.compare(a.hd2, b.hd2, isAsc);
          case "vehMake":
            return this.compare(a.vehMake, b.vehMake, isAsc);
          case "vehType":
            return this.compare(a.vehType, b.vehType, isAsc);
          case "vehEngineNum":
            return this.compare(a.vehEngineNum, b.vehEngineNum, isAsc);
          case "vehModel":
            return this.compare(a.vehModel, b.vehModel, isAsc);
          case "vehChasisNum":
            return this.compare(a.vehChasisNum, b.vehChasisNum, isAsc);
          case "author":
            return this.compare(a.author, b.author, isAsc);
          case "publisher":
            return this.compare(a.publisher, b.publisher, isAsc);
          case "volume":
            return this.compare(a.volume, b.volume, isAsc);
          case "edition":
            return this.compare(a.edition, b.edition, isAsc);
          case "ipcRef":
            return this.compare(a.ipcRef, b.ipcRef, isAsc);
          case "projectShortName":
            return this.compare(a.projectShortName, b.projectShortName, isAsc);
          case "purchaseDate":
            return this.compare(a.purchaseDate, b.purchaseDate, isAsc);
          case "costAmount":
            return this.compare(a.costAmount, b.costAmount, isAsc);
          case "assetCondition":
            return this.compare(a.assetCondition, b.assetCondition, isAsc);
          case "previousTag":
            return this.compare(a.previousTag, b.previousTag, isAsc);
          case "createdBy":
            return this.compare(a.createdBy, b.createdBy, isAsc);
          case "pics":
            return this.compare(a.pics, b.pics, isAsc);
          default:
            return 0;
        }
      });
    }
    this.dataSource.data = [];
    debugger;
    this.dataSource.data = this.addGroups(data, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.dataSource.filter = performance.now().toString();
    this.cdr.detectChanges();
  }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
