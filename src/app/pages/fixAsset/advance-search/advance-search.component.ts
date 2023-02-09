import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-advance-search',
  templateUrl: './advance-search.component.html',
  styleUrls: ['./advance-search.component.scss']
})
export class AdvanceSearchComponent implements OnInit {

  @Output() eventEmitter = new EventEmitter();
  //search variables
  searchCustody: any = '';
  searchMake: any = '';

  //textboxes variables
  txtIdentification: any = '';
  txtModel: any = '';
  txtSize: any = '';
  txtProcessor: any = '';
  txtEngineNo: any = '';
  txtChasis: any = '';
  txtDescription: any = '';

  //dropDown variables
  cmbCustody: any = '';
  cmbMake: any = '';

  //lists
  custodyList: any = [];
  vehMakeList: any = [];

  constructor(
    private http: HttpClient,
    private app: AppComponent,
  ) {}
  
  ngOnInit(): void {
    this.getCustody();
    this.getVehicleMake();
  }

  getCustody() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getposts", { headers: reqHeader })
      .subscribe((data: any) => {
        this.custodyList = data;
      });
  }

  getVehicleMake() {
    var reqHeader = new HttpHeaders({
      "Content-Type": "application/json",
      // Authorization: "Bearer " + Token,
    });

    this.http
      .get(this.app.serverUrl + "getvehiclemake", { headers: reqHeader })
      .subscribe((data: any) => {
        this.vehMakeList = data;
      });
  }

  searchData(){
    // this.eventEmitter.emit({
    //   identification: this.txtIdentification,
    //   model: this.txtModel,
    //   size: this.txtSize,
    //   processor: this.txtProcessor,
    //   engine: this.txtEngineNo,
    //   chasis: this.txtChasis,
    //   description: this.txtDescription,
    //   custody: this.cmbCustody,
    //   make: this.cmbMake});
    this.eventEmitter.emit({
      identification: this.txtIdentification,
      model: this.txtModel,
      size: this.txtSize,
      processor: this.txtProcessor,
      engine: this.txtEngineNo,
      chasis: this.txtChasis,
      description: this.txtDescription,
      custody: this.cmbCustody,
      make: this.cmbMake
    }
      );
  }

  reset(){
    this.searchCustody = '';
    this.searchMake = '';

  this.txtIdentification = '';
  this.txtModel = '';
  this.txtSize = '';
  this.txtProcessor = '';
  this.txtEngineNo = '';
  this.txtChasis = '';
  this.txtDescription = '';

  this.cmbCustody = '';
  this.cmbMake = '';

  }

}
