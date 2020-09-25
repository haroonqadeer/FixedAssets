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
  projectShortName: string = "";
  projectName: string = "";
  roadShortName: string = "";
  roadName: string = "";
  roadLength: string = "";
  officeDescription: string = "";
  landMeasureType: string = "";
  areaAcquiredKanal: string = "";
  areaAcquiredMarla: string = "";
  areaTransferedKanal: string = "";
  openingCost: string = "";
  totalCost: string = "";
  openingRevaluationSurplus: string = "";
  totalRevaluationAmount: string = "";
  revaluationSurplus: string = "";
  dateOfNationalization: string = "";
  constructionFrom: string = "";
  constructionTo: string = "";
  costOfLand: string = "";
}

@Component({
  selector: "app-nharoad-report",
  templateUrl: "./nharoad-report.component.html",
  styleUrls: ["./nharoad-report.component.scss"],
})
export class NharoadReportComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;

  tempRptTitle = "";
  rptTitle = "Roads on Land Report";
  rptHeader = "";
  rptTitle2nd = "";

  assetRegisterList = [];
  filterAssetRegisterList = [];

  //group by table setting
  title = "Grid Grouping";

  public dataSource = new MatTableDataSource<any | Group>([]);

  _alldata: any[];
  columns: any[];
  displayedColumns: string[];
  groupByColumns: string[] = [];

  // expandedAsset: any[] = [];
  // expandedSubAsset: any[] = [];
  // _allGroup: any[];

  constructor(
    private http: HttpClient,
    private app: AppComponent,
    private cookie: CookieService,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrManager
  ) {
    this.columns = [
      {
        field: "projectShortName",
        title: "Project Short Name",
        display: false,
      },
      {
        field: "projectName",
        title: "Project Name",
        display: true,
      },
      {
        field: "roadShortName",
        title: "Road Short Name",
        display: false,
      },
      {
        field: "roadName",
        title: "Road Name",
        display: true,
      },
      {
        field: "officeDescription",
        title: "Office",
        display: true,
      },
      {
        field: "landMeasureType",
        title: "Measurement Unit",
        display: true,
      },
      {
        field: "areaAcquiredKanal",
        title: "Kanal",
        display: true,
      },
      { field: "areaAcquiredMarla", title: "Marla", display: true },
      { field: "areaTransferedKanal", title: "Area Transfered", display: true },
      { field: "openingCost", title: "Opening Cost", display: true },
      { field: "totalCost", title: "Total Cost", display: true },
      {
        field: "openingRevaluationSurplus",
        title: "Opening Revaluation Surplus",
        display: true,
      },
      {
        field: "totalRevaluationAmount",
        title: "Total Revaluation",
        display: true,
      },
      {
        field: "revaluationSurplus",
        title: "Revaluation Surplus",
        display: true,
      },
      {
        field: "dateOfNationalization",
        title: "Nationalization Date",
        display: true,
      },
      { field: "constructionFrom", title: "Construction From", display: true },
      { field: "constructionTo", title: "Construction To", display: true },
      { field: "costOfLand", title: "Cost", display: true },
    ];
    // this.availColumns = this.columns.slice();
    this.displayedColumns = this.columns.map((column) => column.field);
    this.groupByColumns = ["projectName"];
  }

  ngOnInit(): void {
    this._alldata = [
      {
        projectShortName: "APBridge",
        projectName: "Bridge on River Jhelum at Azad Pattan (AJK) Project",
        roadShortName: "N-5",
        roadName: "Karachi-Lahore-Peshawar-Torkham",
        roadLength: "1819",
        officeDescription: "Accounts Section",
        landMeasureType: "Kanal-Marla",
        areaAcquiredKanal: "4343",
        areaAcquiredMarla: "3",
        areaTransferedKanal: "0",
        openingCost: "53880000",
        totalCost: "10",
        openingRevaluationSurplus: "11282151621",
        totalRevaluationAmount: "11336031621",
        revaluationSurplus: "11282151611",
        dateOfNationalization: "8/2/20",
        constructionFrom: "NULL",
        constructionTo: "NULL",
        costOfLand: "0",
      },
      {
        projectShortName: "APBridge",
        projectName: "Bridge on River Jhelum at Azad Pattan (AJK) Project",
        roadShortName: "N-10",
        roadName: "Makran-Coastal; Liari-Ormara-Gwadar-Jiwani",
        roadLength: "653",
        officeDescription: "Accounts Section AP",
        landMeasureType: "Kanal-Marla",
        areaAcquiredKanal: "500",
        areaAcquiredMarla: "0",
        areaTransferedKanal: "0",
        openingCost: "10000",
        totalCost: "0",
        openingRevaluationSurplus: "-9950",
        totalRevaluationAmount: "50",
        revaluationSurplus: "0",
        dateOfNationalization: "8/3/20",
        constructionFrom: "NULL",
        constructionTo: "NULL",
        costOfLand: "50000",
      },
      {
        projectShortName: "Habibabad Flyover",
        projectName: "Habibabad flyover",
        roadShortName: "N-15",
        roadName: "Mansehra-Naran-Jalkhad",
        roadLength: "240",
        officeDescription: "Accounts Section",
        landMeasureType: "Kanal-Marla",
        areaAcquiredKanal: "1500",
        areaAcquiredMarla: "0",
        areaTransferedKanal: "0",
        openingCost: "500",
        totalCost: "0",
        openingRevaluationSurplus: "0",
        totalRevaluationAmount: "0",
        revaluationSurplus: "0",
        dateOfNationalization: "7/1/20",
        constructionFrom: "NULL",
        constructionTo: "NULL",
        costOfLand: "500000",
      },
      {
        projectShortName: "Dhak-Bridge",
        projectName: "Dhak Pattan Bridge",
        roadShortName: "N-5",
        roadName: "Karachi-Lahore-Peshawar-Torkham",
        roadLength: "1819",
        officeDescription: "Accounts Section GOP",
        landMeasureType: "Kanal-Marla",
        areaAcquiredKanal: "100",
        areaAcquiredMarla: "10",
        areaTransferedKanal: "100",
        openingCost: "0",
        totalCost: "159816893",
        openingRevaluationSurplus: "0",
        totalRevaluationAmount: "0",
        revaluationSurplus: "33464343475",
        dateOfNationalization: "1/1/11",
        constructionFrom: "NULL",
        constructionTo: "NULL",
        costOfLand: "0",
      },
      {
        projectShortName: "KHR-TKM",
        projectName: "Karachi - Torkham Project",
        roadShortName: "N-5",
        roadName: "Karachi-Lahore-Peshawar-Torkham",
        roadLength: "1819",
        officeDescription: "Accounts Section GOP",
        landMeasureType: "Kanal-Marla",
        areaAcquiredKanal: "2000",
        areaAcquiredMarla: "0",
        areaTransferedKanal: "1700",
        openingCost: "3.73779E+11",
        totalCost: "0",
        openingRevaluationSurplus: "-4397",
        totalRevaluationAmount: "3.73779E+11",
        revaluationSurplus: "0",
        dateOfNationalization: "8/4/98",
        constructionFrom: "NULL",
        constructionTo: "NULL",
        costOfLand: "0",
      },
    ];

    this.dataSource.data = this.addGroups(this._alldata, this.groupByColumns);
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
    this.dataSource.filter = performance.now().toString();
    this.cdr.detectChanges();
  }

  getDisplayedColumns(): string[] {
    return this.columns
      .filter((cd) => cd.display == true)
      .map((cd) => cd.field);
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
  }

  printDiv() {
    this.app.printReport("#myTable");
  }

  exportExcel() {
    this.app.exportExcel("myTable", "Asset Register");
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
    debugger;
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

  // onSortData(sort: MatSort) {
  //   let data = this.filterAssetRegisterList;
  //   const index = data.findIndex((x) => x["level"] == 1);
  //   if (sort.active && sort.direction !== "") {
  //     if (index > -1) {
  //       data.splice(index, 1);
  //     }

  //     data = data.sort((a: AssetItems, b: AssetItems) => {
  //       const isAsc = sort.direction === "asc";
  //       switch (sort.active) {
  //         case "subLocationDescription":
  //           return this.compare(
  //             a.subLocationDescription,
  //             b.subLocationDescription,
  //             isAsc
  //           );
  //         case "officeTypeDescription":
  //           return this.compare(
  //             a.officeTypeDescription,
  //             b.officeTypeDescription,
  //             isAsc
  //           );
  //         case "officeDescription":
  //           return this.compare(
  //             a.officeDescription,
  //             b.officeDescription,
  //             isAsc
  //           );
  //         case "accountsCatagory":
  //           return this.compare(a.accountsCatagory, b.accountsCatagory, isAsc);
  //         case "assetCatDescription":
  //           return this.compare(
  //             a.assetCatDescription,
  //             b.assetCatDescription,
  //             isAsc
  //           );
  //         default:
  //           return 0;
  //       }
  //     });
  //   }
  //   this.dataSource.data = [];
  //   debugger;
  //   this.dataSource.data = this.addGroups(data, this.groupByColumns);
  //   this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  //   this.dataSource.filter = performance.now().toString();
  //   this.cdr.detectChanges();
  // }

  private compare(a, b, isAsc) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
