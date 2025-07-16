import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-vehicle-entry",
  templateUrl: "./vehicle-entry.component.html",
  styleUrls: ["./vehicle-entry.component.scss"],
})
export class VehicleEntryComponent implements OnInit {
  toggleView = "form";

  constructor() {}

  ngOnInit(): void {}
}
