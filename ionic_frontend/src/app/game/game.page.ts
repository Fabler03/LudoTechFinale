import { Game, Score, GameService } from '../services/game.service';
import { AuthService, UserInfo } from '../services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

//componenti vari
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonToolbar, IonCard, IonCardHeader, IonCardContent, IonText, IonButton, MenuController, IonCardTitle, IonLabel, IonGrid, IonRow, IonCol, IonSegmentButton, IonSegment } from '@ionic/angular/standalone';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
  standalone: true,
  imports: [IonSegment, IonSegmentButton, IonLabel, IonCol, IonRow, IonGrid, IonCardTitle, IonButton,  IonContent, IonHeader, IonToolbar, CommonModule, FormsModule, IonCard, IonCardHeader, IonCardContent, IonText]
})

export class GamePage implements OnInit, OnDestroy {
  selectedSegment: string = 'iframe';
  gameId!: string;
  game?: Game;
  scores?: Score[];
  iframeUrl: SafeResourceUrl | null = null;
  error: string | null = null;
  author: UserInfo | null = null;
  isAdmin: boolean = false;
  private menuController = inject(MenuController);
    
  constructor(
    private route: ActivatedRoute,
    private gameService: GameService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private alertController: AlertController,
    private router: Router
  ) {
  }

  ngOnInit(): void {
      
  }

  ionViewDidEnter() {
    // resta in ascolto per un messaggio da parte del gioco con il punteggio della partita
    window.addEventListener('message', this.handleScoreMessage);

    //controlla se l'utente è admin
    this.isAdmin = this.authService.hasRole('admin');

    //prendi l'id del gioco dall'url
    this.gameId = this.route.snapshot.paramMap.get('id')!;

    //prendi il gioco dall'id
    this.gameService.getGameById(this.gameId).subscribe({
      next: (res) => {
        this.game = res.game;
        
        // controllo aggiuntivo, tecnicamente non necessario ma da verificare
        if (!this.game.approvedby && !this.isAdmin) {
          this.error = 'Gioco non ancora approvato, torna più tardi';
          this.iframeUrl = null;
          return;
        }

        const url = "http://localhost:3000/uploads/" + this.game.name + "/" + this.game.html;
        this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);

        // ottieni i punteggi (se presenti)
        this.getScores();

        // Ottieni le info dell'autore
        this.authService.getUserById(this.game.author).subscribe({
          next: (response) => {
            if (response.success) {
              this.author = response.data;
            } else {
              console.error('Autore non trovato o errore nel recupero:', response.message);
            }
          },
          error: (err) => {
            console.error('Errore nel caricamento dell\'autore:', err);
            this.author = null;
          }
        });
      },
      error: (err) => {
        this.error = 'Errore nel caricamento del gioco';
        console.error(err);
      }
    });
  }

  ngOnDestroy() {
    document.body.style.overflow = '';
    window.removeEventListener('message', this.handleScoreMessage);
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.detail.value;
  }

  handleScoreMessage = (event: MessageEvent) => {
    if (!event.data || event.data.type !== 'submitScore') return;

    const { score } = event.data;
    const gameId = this.game?.id;
    if (gameId && typeof score === 'number') {
      this.gameService.uploadScore(gameId, score).subscribe(() => {
        console.log('punteggio caricato!');
      });
    }
  };

  async getScores() {
    if (!this.game) {
      console.error('Nessun gioco trovato');
      return;
    }

    this.gameService.listScores(this.game.id).subscribe({
      next: (res) => {
        this.scores = res.scores;
        console.log('Punteggi caricati:', this.scores);
      },
      error: (err) => {
        console.error('Errore nel caricamento dei punteggi', err);
      }
    });
  }

  async approveGame() {
    if (!this.game) {
      console.error('Nessun gioco trovato');
      return;
    }

    if (!this.isAdmin) {
      console.error('Utente non autorizzato ad approvare il gioco');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Approva Gioco',
      message: 'Sei sicuro di voler approvare questo gioco?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Approva',
          handler: () => {
            this.gameService.approveGame(this.game!.id).subscribe({
              next: (res) => {
                this.router.navigate(['/home/dashboard']);
              },
              error: (err) => {
                console.error('Errore durante l\'approvazione del gioco', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async downloadGameFiles() {
    if (!this.game) {
      console.error('Nessun gioco trovato');
      return;
    }

    if (!this.isAdmin) {
      console.error('Utente non autorizzato');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Scarica Gioco',
      message: 'Sei sicuro di voler scaricare i file di questo gioco?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Scarica',
          handler: () => {
            this.gameService.downloadGameFiles(this.gameId).subscribe((blob) => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `${this.game?.name}.zip`;
              a.click();
              window.URL.revokeObjectURL(url);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async deleteGame() {
    if (!this.game) {
      console.error('Nessun gioco trovato');
      return;
    }

    if (!this.isAdmin) {
      console.error('Utente non autorizzato');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Elimina Gioco',
      message: 'Sei sicuro di voler eliminare questo gioco?',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel'
        },
        {
          text: 'Elimina',
          handler: () => {
            this.gameService.deleteGame(this.game!.id).subscribe({
              next: (res) => {
                // torna alla dashboard dopo l'eliminazione
                this.router.navigate(['/home/dashboard']);
              },
              error: (err) => {
                console.error('Errore durante l\'eliminazione del gioco', err);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }
}