import { Component, OnInit } from "@angular/core";

declare var $: any;

@Component({
  selector: "app-nharoads",
  templateUrl: "./nharoads.component.html",
  styleUrls: ["./nharoads.component.scss"],
})
export class NHARoadsComponent implements OnInit {
  toggleView = "form";

  constructor() {}

  ngOnInit(): void {}
}
