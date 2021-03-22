import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-asset-disposal',
  templateUrl: './asset-disposal.component.html',
  styleUrls: ['./asset-disposal.component.scss']
})
export class AssetDisposalComponent implements OnInit {

  toggleView = "form";
  txtSearchLandData = "";

  constructor() { }

  ngOnInit(): void {
  }

  
  toggleViewClick() {
    if (this.toggleView == "table") {
      this.toggleView = "form";
    } else {
      this.toggleView = "table";
    }
  }

}
