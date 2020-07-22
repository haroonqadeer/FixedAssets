import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

@Component({
  selector: "app-user-registeration",
  templateUrl: "./user-registeration.component.html",
  styleUrls: ["./user-registeration.component.scss"],
})
export class UserRegisterationComponent implements OnInit {
  toppings = new FormControl();

  toppingList: string[] = [
    "Abbottabad - GM Office",
    "Abbottabad - Toll Plaza",
    "Karachi - Keti Bandar Toll Plaza",
    "Quetta - DD Maintenance Office",
  ];

  constructor() {}

  ngOnInit(): void {}
}
