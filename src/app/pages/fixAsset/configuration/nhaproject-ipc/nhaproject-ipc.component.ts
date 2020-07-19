import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

declare var $: any;

@Component({
  selector: "app-nhaproject-ipc",
  templateUrl: "./nhaproject-ipc.component.html",
  styleUrls: ["./nhaproject-ipc.component.scss"],
})
export class NHAProjectIPCComponent implements OnInit {
  serverUrl = "http://95.217.206.195:2007/api/";

  // imgPath = "D:/Flutter App/FixedAssets/src/assets/assetCatImg";
  imgPath = "C:/inetpub/wwwroot/2008_FAR_Proj/assets/IPCRefImg";
  imageUrl: string = "../../../../../assets/IPCRefImg/dropHereImg.png";
  image;
  imgFile;
  selectedFile: File = null;

  heading = "Add";

  loadingBar = true;

  ipcID = "";
  cmbProject = "";
  txtPkgNo = "";
  txtIPCNo = "";
  txtIpcDesc = "";
  searchProject = "";
  tblSearch = "";

  projectList = [];
  ipcList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getIPC();
    this.getProjects();
  }

  getIPC() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getipc", { headers: reqHeader })
      .subscribe((data: any) => {
        this.ipcList = data;
        this.loadingBar = false;
      });
  }

  getProjects() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getprojects", { headers: reqHeader })
      .subscribe((data: any) => {
        this.projectList = data;
        this.loadingBar = false;
      });
  }

  onFileSelected(event) {
    if (event.target.files[0].type == "application/pdf") {
      this.selectedFile = <File>event.target.files[0];

      let reader = new FileReader();

      reader.onloadend = (e: any) => {
        this.image = reader.result;

        var splitImg = this.image.split(",")[1];
        this.image = splitImg;
        this.imageUrl = "../../../../../assets/IPCRefImg/PDF_file_icon.svg";
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.image = undefined;
      this.imgFile = undefined;
      this.selectedFile = null;
      this.imageUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
    }
  }

  save() {
    if (this.cmbProject == "") {
      this.toastr.errorToastr("Please Select Project", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtPkgNo == "") {
      this.toastr.errorToastr("Please Enter Package No", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtIPCNo == "") {
      this.toastr.errorToastr("Please Enter IPC No", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtIpcDesc == "") {
      this.toastr.errorToastr("Please Enter IPC Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.loadingBar = true;
      var saveData;
      if (this.ipcID == "") {
        saveData = {
          ProjectID: parseInt(this.cmbProject),
          ProjectPackage: this.txtPkgNo,
          IPCNo: this.txtIPCNo,
          IPCRefDescription: this.txtIpcDesc,
          EDoc: this.imgPath,
          EDocExtension: "pdf",
          imgFile: this.image,
          IPCRefID: 0,
          userId: this.cookie.get("userID"),
          spType: "INSERT",
        };
      } else {
        saveData = {
          ProjectID: parseInt(this.cmbProject),
          ProjectPackage: this.txtPkgNo,
          IPCNo: this.txtIPCNo,
          IPCRefDescription: this.txtIpcDesc,
          EDoc: this.imgPath,
          EDocExtension: "pdf",
          imgFile: this.image,
          IPCRefID: this.ipcID,
          userId: this.cookie.get("userID"),
          spType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sudassetcatagory", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "Success") {
            if (this.ipcID == "") {
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
            this.clear();
            this.getIPC();
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

  edit(obj) {
    this.heading = "Edit";

    this.ipcID = obj.ipcRefID;
    this.cmbProject = obj.projectID;
    this.txtPkgNo = obj.projectPackage;
    this.txtIPCNo = obj.ipcNo;
    this.txtIpcDesc = obj.ipcRefDescription;
  }

  delete(obj) {
    this.loadingBar = true;
    var saveData = {
      Userid: this.cookie.get("userID"), //int
      SpType: "DELETE", //string
      IPCRefID: this.ipcID,
    };

    var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

    this.http
      .post(this.serverUrl + "sudassetcatagory", saveData, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        if (data.msg == "Success") {
          this.toastr.successToastr(
            "Record Deleted Successfully!",
            "Success!",
            {
              toastTimeout: 2500,
            }
          );
          this.clear();
          this.getIPC();
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

  clear() {
    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "../../../../../assets/assetCatImg/dropHereImg.png";
  }
}
