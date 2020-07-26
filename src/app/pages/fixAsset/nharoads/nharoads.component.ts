import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-nharoads",
  templateUrl: "./nharoads.component.html",
  styleUrls: ["./nharoads.component.scss"],
})
export class NHARoadsComponent implements OnInit {
  toggleView = "form";

  //accordian variable
  step = 0;

  constructor() {}

  ngOnInit(): void {}

  // accordian setting
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
  //accordian settings end
}
