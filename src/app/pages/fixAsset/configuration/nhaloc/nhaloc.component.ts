import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-nhaloc",
  templateUrl: "./nhaloc.component.html",
  styleUrls: ["./nhaloc.component.scss"],
})
export class NHALocComponent implements OnInit {
  serverUrl = "http://95.217.147.105:2007/api/";
  heading = "Add";

  subLocID = "";
  txtLocShrtName = "";
  txtLocFullName = "";
  cmbRegion = "";

  searchLocation = "";
  tblSearch = "";

  locList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getLocation();
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

  save() {}

  clear() {}

  edit(obj) {}

  delete(obj) {}
}
