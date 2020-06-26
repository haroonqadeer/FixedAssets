import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-asset-entry",
  templateUrl: "./asset-entry.component.html",
  styleUrls: ["./asset-entry.component.scss"],
})
export class AssetEntryComponent implements OnInit {
  editMode = true;

  constructor() {}

  ngOnInit(): void {}

  editLocation() {
    if (this.editMode == true) {
      this.editMode = false;
    } else {
      this.editMode = true;
    }
  }
}
