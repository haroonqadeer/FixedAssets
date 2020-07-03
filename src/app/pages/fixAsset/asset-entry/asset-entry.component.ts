import { Component, OnInit, ViewEncapsulation } from "@angular/core";

@Component({
  selector: "app-asset-entry",
  templateUrl: "./asset-entry.component.html",
  styleUrls: ["./asset-entry.component.scss"],
})
export class AssetEntryComponent implements OnInit {
  editMode = true;
  hidden = false;
  rdbAsset: String;
  toggleView = "table";

  constructor() {}

  ngOnInit(): void {}

  editLocation() {
    this.editMode = !this.editMode;
    alert(this.rdbAsset);
  }

  toggleBadgeVisibility() {
    this.hidden = !this.hidden;
  }

  toggleViewClick() {
    if (this.toggleView == "table") {
      this.toggleView = "form";
    } else {
      this.toggleView = "table";
    }
  }
}
