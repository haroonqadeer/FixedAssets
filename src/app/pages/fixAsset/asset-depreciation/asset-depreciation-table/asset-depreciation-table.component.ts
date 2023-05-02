import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-asset-depreciation-table",
  templateUrl: "./asset-depreciation-table.component.html",
  styleUrls: ["./asset-depreciation-table.component.scss"],
})
export class AssetDepreciationTableComponent implements OnInit {
  @Output() eventEmitter = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  detail(item: any) {
    this.eventEmitter.emit(item);
  }
}
