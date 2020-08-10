import { Component, OnInit } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

// import tableDragger from "../../../../../../node_modules/table-dragger/src/index.js";

@Component({
  selector: "app-asset-register-rpt",
  templateUrl: "./asset-register-rpt.component.html",
  styleUrls: ["./asset-register-rpt.component.scss"],
})
export class AssetRegisterRptComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://localhost:12345/api/";

  // serverUrl = "http://localhost:6090/api/";

  constructor(private http: HttpClient) {}

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
}
