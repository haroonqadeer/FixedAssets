import { Component, OnInit } from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";

@Component({
  selector: "app-land-report",
  templateUrl: "./land-report.component.html",
  styleUrls: ["./land-report.component.scss"],
})
export class LandReportComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  // Transfer Items Between Lists
  MoviesList = [
    {
      id: 1,
      title: "The Far Side of the World",
    },
    {
      id: 2,
      title: "Morituri",
    },
    {
      id: 3,
      title: "Napoleon Dynamite",
    },
    {
      id: 4,
      title: "Pulp Fiction",
    },
    {
      id: 5,
      title: "Blade Runner",
    },
    {
      id: 6,
      title: "Cool Hand Luke",
    },
    {
      id: 7,
      title: "Heat",
    },
    {
      id: 8,
      title: "Juice",
    },
  ];

  MoviesWatched = [];

  showItem() {
    console.log(this.MoviesWatched[0].title);
  }

  onDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
