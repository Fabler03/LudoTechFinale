import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonMenuButton, IonButtons, IonHeader, IonTitle, IonToolbar, IonList, IonItem, IonSplitPane, IonMenu, IonRouterOutlet } from '@ionic/angular/standalone';
import { RouterLink, Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [ IonRouterOutlet, IonMenuButton, IonButtons, IonSplitPane, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonContent, 
    IonHeader, IonTitle, IonToolbar, IonList, IonItem,  IonMenu, RouterLink],
})

export class HomePage {
  get splitPaneWhen(): string {
    // mostra il menu solo se non siamo nella pagina di gioco
    return this.router.url.startsWith('/home/game') ? 'false' : 'md';
  }

  constructor(public router: Router) {}
}
