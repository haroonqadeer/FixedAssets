import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-nhafreehold-land",
  templateUrl: "./nhafreehold-land.component.html",
  styleUrls: ["./nhafreehold-land.component.scss"],
})
export class NHAFreeholdLandComponent implements OnInit {
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
