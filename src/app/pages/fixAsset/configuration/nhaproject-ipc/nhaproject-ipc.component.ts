import { Component, OnInit } from "@angular/core";
import { ToastrManager } from "ng6-toastr-notifications";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import Swal from "sweetalert2/dist/sweetalert2.js";

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
  showPdf = "";
  lblFileName = "";
  image;
  imgFile;
  selectedFile: File = null;

  heading = "Add";

  loadingBar = true;
  modalLoadingBar = false;

  ipcID = "";
  ipcDetailID = "";
  cmbProject = "";
  cmbAssetCat = "";
  txtPkgNo = "";
  txtIPCNo = "";
  txtIpcDesc = "";
  txtQty = "";
  txtDesc = "";
  lblAccCategory = "";
  searchProject = "";
  searchCategory = "";
  tblSearch = "";
  tblSearchDetail = "";

  projectList = [];
  ipcList = [];
  ipcDetailList = [];
  AssetCatList = [];

  constructor(
    private toastr: ToastrManager,
    private http: HttpClient,
    private cookie: CookieService
  ) {}

  ngOnInit(): void {
    this.getIPC();
    this.getProjects();
    this.getAssetCategory();
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

  getAssetCategory() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getassetcat", { headers: reqHeader })
      .subscribe((data: any) => {
        this.AssetCatList = data;
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

  getAssetCatDescription(assetCatID) {
    if (this.cmbAssetCat != "" || this.cmbAssetCat != undefined) {
      var assetCat = this.AssetCatList.filter(
        (x) => x.assetCatID == assetCatID
      );
      // this.txtAssetDesc = assetCat[0].assetCatDescription;
      this.lblAccCategory = assetCat[0].accountsCatagory;
      // this.lblDepRule = assetCat[0].depreciationRule;
      // this.lblBaseRate = assetCat[0].baseRate;
    }
  }

  validateFields(event) {
    escape(event);
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
        this.showPdf = e.target.result;
        this.lblFileName = this.selectedFile.name;
      };

      reader.readAsDataURL(this.selectedFile);
    } else {
      this.toastr.errorToastr("Please Select PDF File", "Error", {
        toastTimeout: 2500,
      });

      this.image = undefined;
      this.imgFile = undefined;
      this.selectedFile = null;
      this.imageUrl = "";
    }
  }

  zoomImage() {
    // Get the modal
    var modal = document.getElementById("myModal");

    if (this.imageUrl == "") {
      this.toastr.errorToastr("Please Select PDF", "Error", {
        toastTimeout: 2500,
      });
    } else {
      modal.style.display = "block";
      (<HTMLImageElement>document.querySelector("#img01")).src = this.showPdf;
    }
  }

  closeModal() {
    var modal = document.getElementById("myModal");

    modal.style.display = "none";
  }

  getIPCDetail(obj) {
    this.ipcID = obj;

    this.loadingBar = true;

    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.serverUrl + "getipcdetail?IPCRefID=" + this.ipcID, {
        headers: reqHeader,
      })
      .subscribe((data: any) => {
        this.ipcDetailList = data;
        this.loadingBar = false;
        $("#ipcDetailModal").modal("show");
      });
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
    } else if (this.txtIPCNo == "0" || this.txtIPCNo == "") {
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
        .post(this.serverUrl + "sudipcref", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
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

  openPDFFile() {
    window.open(this.imageUrl);
  }

  edit(obj) {
    this.heading = "Edit";

    this.ipcID = obj.ipcRefID;
    this.cmbProject = obj.projectID;
    this.txtPkgNo = obj.projectPackage;
    this.txtIPCNo = obj.ipcNo;
    this.txtIpcDesc = obj.ipcRefDescription;

    if (obj.edoc != null) {
      //this.imageUrl = "../../../../../assets/IPCRefImg/PDF_file_icon.svg";
      this.imageUrl =
        "http://95.217.206.195:2008/assets/IPCRefImg/" + obj.ipcRefID + ".pdf";
    }
  }

  delete(obj) {
    setTimeout(() => {
      Swal.fire({
        title: "Do you want to delete?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          this.loadingBar = true;
          var saveData = {
            Userid: this.cookie.get("userID"), //int
            SpType: "DELETE", //string
            IPCRefID: obj.ipcRefID,
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "sudipcref", saveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              if (data.msg == "SUCCESS") {
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
      });
    }, 1000);
  }

  clear() {
    this.ipcID = "";
    this.cmbProject = "";
    this.txtPkgNo = "";
    this.txtIPCNo = "";
    this.txtIpcDesc = "";
    this.searchProject = "";
    this.tblSearch = "";

    this.image = undefined;
    this.imgFile = undefined;
    this.selectedFile = null;
    this.imageUrl = "";
  }

  saveDetail() {
    if (this.cmbAssetCat == "") {
      this.toastr.errorToastr("Please Select Asset Cateogry", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtQty == "") {
      this.toastr.errorToastr("Please Enter Quantity", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else if (this.txtDesc == "") {
      this.toastr.errorToastr("Please Enter Description", "Error", {
        toastTimeout: 2500,
      });
      return false;
    } else {
      this.modalLoadingBar = true;
      var saveData;
      if (this.ipcDetailID == "") {
        saveData = {
          IPCRefID: this.ipcID,
          AssetCatID: parseInt(this.cmbAssetCat),
          Qty: this.txtQty,
          Description: this.txtDesc,
          IPCRefDescription: this.txtIpcDesc,
          IPCRefDetailID: 0,
          userId: this.cookie.get("userID"),
          spType: "INSERT",
        };
      } else {
        saveData = {
          IPCRefID: this.ipcID,
          AssetCatID: parseInt(this.cmbAssetCat),
          Qty: this.txtQty,
          Description: this.txtDesc,
          IPCRefDescription: this.txtIpcDesc,
          IPCRefDetailID: this.ipcDetailID,
          userId: this.cookie.get("userID"),
          spType: "UPDATE",
        };
      }

      var reqHeader = new HttpHeaders({ "Content-Type": "application/json" });

      this.http
        .post(this.serverUrl + "sudipcrefdetail", saveData, {
          headers: reqHeader,
        })
        .subscribe((data: any) => {
          if (data.msg == "SUCCESS") {
            if (this.ipcDetailID == "") {
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
            this.getIPCDetail(this.ipcID);
            this.modalLoadingBar = false;
            return false;
          } else {
            this.toastr.errorToastr(data.msg, "Error !", {
              toastTimeout: 5000,
            });
            this.modalLoadingBar = false;
            return false;
          }
        });
    }
  }

  editDetail(obj) {
    this.cmbAssetCat = obj.assetCatID;
    this.ipcID = obj.ipcRefID;
    this.txtQty = obj.qty;
    this.txtDesc = obj.description;
    this.ipcDetailID = obj.ipcRefDetailID;

    var accCat = this.AssetCatList.filter(
      (x) => x.assetCatID == obj.assetCatID
    );
    this.lblAccCategory = accCat[0].accountsCatagory;
  }

  deleteDetail(obj) {
    setTimeout(() => {
      Swal.fire({
        title: "Do you want to delete?",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
      }).then((result) => {
        if (result.value) {
          this.modalLoadingBar = true;
          var saveData = {
            Userid: this.cookie.get("userID"), //int
            SpType: "DELETE", //string
            IPCRefDetailID: obj.ipcRefDetailID,
          };

          var reqHeader = new HttpHeaders({
            "Content-Type": "application/json",
          });

          this.http
            .post(this.serverUrl + "sudipcrefdetail", saveData, {
              headers: reqHeader,
            })
            .subscribe((data: any) => {
              if (data.msg == "SUCCESS") {
                this.toastr.successToastr(
                  "Record Deleted Successfully!",
                  "Success!",
                  {
                    toastTimeout: 2500,
                  }
                );
                this.clear();
                this.getIPCDetail(obj.ipcRefID);
                this.modalLoadingBar = false;
                return false;
              } else {
                this.toastr.errorToastr(data.msg, "Error !", {
                  toastTimeout: 5000,
                });
                this.modalLoadingBar = false;
                return false;
              }
            });
        }
      });
    }, 1000);
  }

  clearDetail() {
    this.cmbAssetCat = "";
    this.lblAccCategory = "";
    this.txtQty = "";
    this.txtDesc = "";
    this.tblSearchDetail = "";
  }
}
