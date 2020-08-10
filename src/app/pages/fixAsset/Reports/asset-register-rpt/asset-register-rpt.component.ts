import { Component, OnInit } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";

import tableDragger from "table-dragger";

@Component({
  selector: "app-asset-register-rpt",
  templateUrl: "./asset-register-rpt.component.html",
  styleUrls: ["./asset-register-rpt.component.scss"],
})
export class AssetRegisterRptComponent implements OnInit {
  // serverUrl = "http://95.217.206.195:2007/api/";
  //serverUrl = "http://localhost:12345/api/";

  serverUrl = "http://localhost:6090/api/";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    var el = document.getElementById("table");

    var dragger = tableDragger(el, {
      mode: "row",
      dragHandler: ".drag",
      onlyBody: true,
      animation: 300,
    });
    // tableDragger(document.querySelector("#table"));
  }
}
