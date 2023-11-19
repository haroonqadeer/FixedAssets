import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-asset-depreciation-table",
  templateUrl: "./asset-depreciation-table.component.html",
  styleUrls: ["./asset-depreciation-table.component.scss"],
})
export class AssetDepreciationTableComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();

  tableData: any = [];

  constructor() {}

  ngOnInit(): void {}

  detail(item: any) {
    this.eventEmitter.emit(item);
  }
}
