import { Component, OnInit } from "@angular/core";

declare var $: any;

@Component({
  selector: "app-asset-depreciation",
  templateUrl: "./asset-depreciation.component.html",
  styleUrls: ["./asset-depreciation.component.scss"],
})
export class AssetDepreciationComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  assetWiseData(item: any) {
    $("#assetModal").modal("show");
  }

  assetDetail(item: any) {
    $("#assetDetailModal").modal("show");
  }
}
