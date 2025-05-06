import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonSearchbar, IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.page.html',
  styleUrls: ['./filter.page.scss'],
  standalone: true,
  imports: [IonButton, IonSearchbar, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class FilterPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
