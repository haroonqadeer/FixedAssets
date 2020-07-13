import { Component, OnInit } from "@angular/core";
import { Chart } from "angular-highcharts";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

declare var $: any;

@Component({
  selector: "app-dashboardy",
  templateUrl: "./dashboardy.component.html",
  styleUrls: ["./dashboardy.component.scss"],
})
export class DashboardyComponent implements OnInit {
  serverUrl = "http://95.217.147.105:2007/api/";

  itemPerPage = "10";
  p = 1;

  locationName = "";
  allLocation = "";
  comLocation = "";
  remLocation = "";
  allTags = "";
  cmbChartLocation = "";
  cmbTblLocation = "";
  cmbLocation = "";
  cmbOfcType = "";

  searchChartLocation = "";
  searchTblLocation = "";
  searchTag = "";
  searchLocation = "";
  searchTagOfc = "";
  searchTagLoc = "";

  ofcTypeList = [];
  assetDetailList = [];
  tempLocList = [];
  tempTagList = [];
  allLocDetList = [];
  compLocDetList = [];
  remLocDetList = [];
  tagDetList = [];
  tagDetDtWiseList = [];
  totalTagList = [];
  locList = [];
  chartAssetDetailList = [];
  computerList = [];
  drawingList = [];
  electricList = [];
  furnitureList = [];
  officeList = [];
  plantList = [];
  vehicleList = [];

  constructor(private http: HttpClient) {}

  test_chart: Chart;
  locationModalTitle: string;
  dailyTags_chart: Chart;

  ngOnInit(): void {
    // Create the chart
    // this.testChart();
    this.getTagsSummary();
    this.getLocationDetail();
    this.getCompLocationDetail();
    this.getRemLocationDetail();
    this.getTagDetail();
    this.getTagDateWise();
    this.getLocation();
    this.getAssetDetail();
    this.getOfficeType();
    this.getChartAssetDetail();
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

  getChartAssetDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getallassetdetaillocwisedashboard", {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.chartAssetDetailList = data;
        for (var i = 0; i < this.chartAssetDetailList.length; i++) {
          if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay == "PLANTS"
          ) {
            this.plantList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay == "COMPUTERS"
          ) {
            this.computerList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay ==
            "DRAWINGEQUIPMENT"
          ) {
            this.drawingList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay ==
            "ELECTRICITEMS"
          ) {
            this.electricList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay == "FURNITURES"
          ) {
            this.furnitureList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay == "VEHICLES"
          ) {
            this.vehicleList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
            ]);
          } else if (
            this.chartAssetDetailList[i].accountsCatagoryDisplay ==
            "OFFICEEQUIPMENTS"
          ) {
            this.officeList.push([
              this.chartAssetDetailList[i].assetCatDescription,
              this.chartAssetDetailList[i].tagsCreated,
            ]);
          }
        }
        this.testChart();
      });
  }

  getAssetDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getassetdetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.assetDetailList = data;
        this.assetDetailList.reverse();
      });
  }

  getAssetDetailLocOfcType() {
    if (this.cmbLocation != "" && this.cmbOfcType != "") {
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(
          this.serverUrl +
            "getassetdetail?UserId=0&SubLocID=" +
            this.cmbLocation +
            "&OfficeTypeID=" +
            this.cmbOfcType,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.assetDetailList = data;
        });
    } else if (this.cmbLocation != "" && this.cmbOfcType == "") {
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(this.serverUrl + "getassetdetail?SubLocID=" + this.cmbLocation, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          this.assetDetailList = data;
        });
    } else if (this.cmbLocation == "" && this.cmbOfcType != "") {
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(
          this.serverUrl + "getassetdetail?OfficeTypeID=" + this.cmbOfcType,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.assetDetailList = data;
        });
    }
  }

  editLocationModalTitle(text) {
    this.locationModalTitle = text;
    if (text == "Total Locations") {
      this.tempLocList = this.allLocDetList;
    } else if (text == "Completed Locations") {
      this.tempLocList = this.compLocDetList;
    } else if (text == "Remaining Locations") {
      this.tempLocList = this.remLocDetList;
    } else if (text == "Total Tags") {
      this.tempTagList = this.tagDetList;
    }
  }

  testChart() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getallassetdashboard", { headers: reqHeader })
      .subscribe((data: any) => {
        let chart = new Chart({
          chart: {
            type: "column",
          },
          title: {
            text: "Asset by Categories",
            // style: {
            //   color: "#ddd",
            // },
          },
          xAxis: {
            type: "category",
          },
          yAxis: {
            title: {
              text: "Total Number of Assets",
            },
          },
          legend: {
            enabled: false,
          },

          tooltip: {
            headerFormat:
              '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat:
              '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: "{y}",
              },
            },
          },
          series: [
            {
              name: data[0].totalTagsCreated,
              data: [
                {
                  name: "Computers",
                  y: data[0].computers,
                  drilldown: "Computers",
                },
                {
                  name: "Drawing Equipment",
                  y: data[0].drawingequipment,
                  drilldown: "Drawing Equipment",
                },
                {
                  name: "Electric Items",
                  y: data[0].electricitems,
                  drilldown: "Electric Items",
                },
                {
                  name: "Furnitures",
                  y: data[0].furnitures,
                  drilldown: "Furnitures",
                },
                {
                  name: "Office Equipements",
                  y: data[0].officeequipments,
                  drilldown: "Office Equipements",
                },
                {
                  name: "Plants",
                  y: data[0].plants,
                  drilldown: "Plants",
                },
                {
                  name: "Vehicles",
                  y: data[0].vehicles,
                  drilldown: "Vehicles",
                },
              ],
            },
          ],
          drilldown: {
            series: [
              {
                name: "Computers",
                id: "Computers",
                data: this.computerList,
              },
              {
                name: "Drawing Equipment",
                id: "Drawing Equipment",
                data: this.drawingList,
              },
              {
                name: "Electric Items",
                id: "Electric Items",
                data: this.electricList,
              },
              {
                name: "Furnitures",
                id: "Furnitures",
                data: this.furnitureList,
              },
              {
                name: "Office Equipements",
                id: "Office Equipements",
                data: this.officeList,
              },
              {
                name: "Plants",
                id: "Plants",
                data: this.plantList,
              },
              {
                name: "Vehicles",
                id: "Vehicles",
                data: this.vehicleList,
              },
            ],
          },
        });

        this.test_chart = chart;
      });
  }

  dailyTagsChart() {}
  getChartLocationWise() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl +
          "getallassetlocwisedashboard?LocationID=" +
          this.cmbChartLocation,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        let chart = new Chart({
          chart: {
            type: "column",
          },
          title: {
            text: "Asset by Categories",
          },
          xAxis: {
            type: "category",
          },
          yAxis: {
            title: {
              text: "Total Number of Assets",
            },
          },
          legend: {
            enabled: false,
          },
          plotOptions: {
            series: {
              dataLabels: {
                enabled: true,
                format: "{point.y:.1f}%",
              },
            },
          },

          // tooltip: {
          //   headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
          //   pointFormat:
          //     '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
          // },

          series: [
            {
              name: data[0].totalTagsCreated,
              data: [
                {
                  name: "Computers",
                  y: data[0].computers,
                  // drilldown: "Chrome",
                },
                {
                  name: "Drawing Equipment",
                  y: data[0].drawingequipment,
                  // drilldown: "Firefox",
                },
                {
                  name: "Electric Items",
                  y: data[0].electricitems,
                  // drilldown: "Internet Explorer",
                },
                {
                  name: "Furnitures",
                  y: data[0].furnitures,
                  // drilldown: "Safari",
                },
                {
                  name: "Office Equipements",
                  y: data[0].officeequipments,
                  // drilldown: "Edge",
                },
                {
                  name: "Plants",
                  y: data[0].plants,
                  // drilldown: "Opera",
                },
                {
                  name: "Vehicles",
                  y: data[0].vehicles,
                  // drilldown: null,
                },
              ],
            },
          ],
          // drilldown: {
          //   series: [
          //     {
          //       name: "Chrome",
          //       id: "Chrome",
          //       data: [
          //         ["v65.0", 0.1],
          //         ["v64.0", 1.3],
          //         ["v63.0", 53.02],
          //         ["v62.0", 1.4],
          //         ["v61.0", 0.88],
          //         ["v60.0", 0.56],
          //         ["v59.0", 0.45],
          //         ["v58.0", 0.49],
          //         ["v57.0", 0.32],
          //         ["v56.0", 0.29],
          //         ["v55.0", 0.79],
          //         ["v54.0", 0.18],
          //         ["v51.0", 0.13],
          //         ["v49.0", 2.16],
          //         ["v48.0", 0.13],
          //         ["v47.0", 0.11],
          //         ["v43.0", 0.17],
          //         ["v29.0", 0.26],
          //       ],
          //     },
          //     {
          //       name: "Firefox",
          //       id: "Firefox",
          //       data: [
          //         ["v58.0", 1.02],
          //         ["v57.0", 7.36],
          //         ["v56.0", 0.35],
          //         ["v55.0", 0.11],
          //         ["v54.0", 0.1],
          //         ["v52.0", 0.95],
          //         ["v51.0", 0.15],
          //         ["v50.0", 0.1],
          //         ["v48.0", 0.31],
          //         ["v47.0", 0.12],
          //       ],
          //     },
          //     {
          //       name: "Internet Explorer",
          //       id: "Internet Explorer",
          //       data: [
          //         ["v11.0", 6.2],
          //         ["v10.0", 0.29],
          //         ["v9.0", 0.27],
          //         ["v8.0", 0.47],
          //       ],
          //     },
          //     {
          //       name: "Safari",
          //       id: "Safari",
          //       data: [
          //         ["v11.0", 3.39],
          //         ["v10.1", 0.96],
          //         ["v10.0", 0.36],
          //         ["v9.1", 0.54],
          //         ["v9.0", 0.13],
          //         ["v5.1", 0.2],
          //       ],
          //     },
          //     {
          //       name: "Edge",
          //       id: "Edge",
          //       data: [
          //         ["v16", 2.6],
          //         ["v15", 0.92],
          //         ["v14", 0.4],
          //         ["v13", 0.1],
          //       ],
          //     },
          //     {
          //       name: "Opera",
          //       id: "Opera",
          //       data: [
          //         ["v50.0", 0.96],
          //         ["v49.0", 0.82],
          //         ["v12.1", 0.14],
          //       ],
          //     },
          //   ],
          // },
        });

        this.test_chart = chart;
      });
  }

  getTagDateWise() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getalltagsdetaildatewise", { headers: reqHeader })
      .subscribe((data: any) => {
        this.totalTagList = data;
        this.totalTagList.reverse();
      });
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

  public convertDate(myDate) {
    var oldDate = new Date(myDate);
    var d = oldDate.getDate();
    var m = oldDate.getMonth();
    m += 1; // JavaScript months are 0-11
    var y = oldDate.getFullYear();

    var convertedDate = y + "-" + m + "-" + d;

    return convertedDate;
  }
  getTblDataLocWise() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(
        this.serverUrl +
          "gettagsdetaillocwise?LocationID=" +
          this.cmbTblLocation,
        {
          headers: reqHeader,
        }
      )
      .subscribe((data: any) => {
        this.totalTagList = data;
      });
  }

  getTagDetailDateWise(item) {
    var dt = this.convertDate(item.createdDate);
    if (this.cmbTblLocation == "") {
      this.locationName = dt;
      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(this.serverUrl + "gettagsdetaildatewise?reqDate=" + dt, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          this.tagDetDtWiseList = data;
          $("#officeTypeTagsDtWiseModal").modal("show");
        });
    } else if (this.cmbTblLocation != "") {
      for (var i = 0; i < this.locList.length; i++) {
        if (this.locList[i].subLocID == this.cmbTblLocation) {
          this.locationName =
            this.locList[i].subLocationDescription +
            " - " +
            this.locList[i].mainLocationDescription +
            " - " +
            this.locList[i].provinceName;
          i = this.locList.length + 1;
        }
      }

      var reqHeader = new HttpHeaders({
        "Content-Type": "application/json",
        // Authorization: "Bearer " + Token,
      });

      this.http
        .get(
          this.serverUrl +
            "gettagsdetaildatewise?reqDate=" +
            dt +
            "&LocationID=" +
            this.cmbTblLocation,
          { headers: reqHeader }
        )
        .subscribe((data: any) => {
          this.tagDetDtWiseList = data;
          $("#officeTypeTagsModal").modal("show");
        });
    }
  }

  getTagsSummary() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "gettagssummary", { headers: reqHeader })
      .subscribe((data: any) => {
        this.allLocation = data[0].allLocations;
        this.comLocation = data[0].completedLocations;
        this.remLocation = data[0].incompletelocations;
        this.allTags = data[0].totaltags;
      });
  }

  getLocationDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getlocdetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.allLocDetList = data;
      });
  }

  getCompLocationDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getcomplocdetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.compLocDetList = data;
      });
  }

  getRemLocationDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getincomplocdetail", { headers: reqHeader })
      .subscribe((data: any) => {
        this.remLocDetList = data;
      });
  }

  getTagDetail() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "gettagsdetaildb", { headers: reqHeader })
      .subscribe((data: any) => {
        this.tagDetList = data;
      });
  }

  clear() {
    this.cmbOfcType = "";
    this.cmbChartLocation = "";
    this.cmbTblLocation = "";
    this.cmbLocation = "";

    this.testChart();
    this.getTagDateWise();
    this.getAssetDetail();
  }
}
