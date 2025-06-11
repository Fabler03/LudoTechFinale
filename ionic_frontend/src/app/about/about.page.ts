import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonCard, IonCardHeader, IonCardTitle, IonGrid, IonCol, IonRow, IonImg, IonCardSubtitle, IonHeader, IonTitle, IonToolbar, IonCardContent } from '@ionic/angular/standalone';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  standalone: true,
  imports: [ IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardTitle, IonGrid, IonCol, IonRow, IonImg, IonCardSubtitle, IonCardContent]
})
export class AboutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
