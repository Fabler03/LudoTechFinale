import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService, Game } from '../services/game.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { IonHeader, IonTitle, IonToolbar, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonMenuButton, IonButtons, IonContent, IonCardContent, IonButton, IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
  standalone: true,
  imports: [ IonContent,  IonCardTitle, IonCardHeader, IonGrid, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonRow, IonCol, IonCard ]
})
export class DashboardPage implements OnInit {
  approvedGames: Game[] = [];
  unapprovedGames: Game[] = [];
  isAdmin: boolean = false;

  constructor(private gameService: GameService, private router: Router, private authService: AuthService) {}

  ngOnInit() {
  }

  ionViewDidEnter() {
    // Controlla se l'utente è admin
    this.isAdmin = this.authService.hasRole('admin');

    this.gameService.getApprovedGames().subscribe({
      next: (res) => {
        this.approvedGames = res.games
      },
      error: (err) => console.error('Errore nel recupero dei giochi', err)
    });

    if (this.isAdmin) {
      this.gameService.getUnapprovedGames().subscribe({
        next: (res) => {
          this.unapprovedGames = res.games
        },
        error: (err) => console.error('Errore nel recupero dei giochi', err)
      });
    }
  }

  openGame(gameId: number) {
    this.router.navigate(['/home/game/', gameId]);
  }
}
