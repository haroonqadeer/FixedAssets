import { Component, OnInit } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { AppComponent } from "src/app/app.component";

// import tableDragger from "../../../../../../node_modules/table-dragger/src/index.js";

const ELEMENT_DATA = [
  { position: 1, name: "Hydrogen", weight: 1.0079, symbol: "H" },
  { position: 2, name: "Helium", weight: 4.0026, symbol: "He" },
  { position: 3, name: "Lithium", weight: 6.941, symbol: "Li" },
  { position: 4, name: "Beryllium", weight: 9.0122, symbol: "Be" },
  { position: 5, name: "Boron", weight: 10.811, symbol: "B" },
  { position: 6, name: "Carbon", weight: 12.0107, symbol: "C" },
  { position: 7, name: "Nitrogen", weight: 14.0067, symbol: "N" },
  { position: 8, name: "Oxygen", weight: 15.9994, symbol: "O" },
  { position: 9, name: "Fluorine", weight: 18.9984, symbol: "F" },
  { position: 10, name: "Neon", weight: 20.1797, symbol: "Ne" },
];

@Component({
  selector: "app-asset-register-rpt",
  templateUrl: "./asset-register-rpt.component.html",
  styleUrls: ["./asset-register-rpt.component.scss"],
})
export class AssetRegisterRptComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://localhost:12345/api/";

  // serverUrl = "http://localhost:6090/api/";

  constructor(private http: HttpClient, private app: AppComponent) {}

  displayedColumns: string[] = ["position", "name", "weight", "symbol"];
  dataSource = ELEMENT_DATA;

  ngOnInit(): void {
    setTimeout(() => this.getTableDrag(), 500);
  }
  getTableDrag() {
    //   var el = document.querySelector("#table");
    //   tableDragger(el, {
    //     mode: "row",
    //     dragHandler: ".handle",
    //     // onlyBody: true,
    //     animation: 300,
    //   });
  }

  printDiv() {
    this.app.printReport("#myTable");
  }
}
