import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-revaluation-enteries",
  templateUrl: "./revaluation-enteries.component.html",
  styleUrls: ["./revaluation-enteries.component.scss"],
})
export class RevaluationEnteriesComponent implements OnInit {
  loadingBar = false;
  toggleView = "movable";

  constructor() {}

  ngOnInit(): void {}
}
