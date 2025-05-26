import { Component, Input, OnInit } from '@angular/core';
import { IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";

@Component({
  selector: 'Header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonToolbar, IonTitle, IonHeader, ],
})
export class HeaderComponent  implements OnInit {

  @Input() title!: string;

  constructor() { }

  ngOnInit() {}

}
