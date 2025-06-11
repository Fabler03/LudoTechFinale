import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators, ReactiveFormsModule } from '@angular/forms';
import { IonContent, IonCardContent, IonCardHeader, IonCardTitle, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput, IonCard, IonTextarea } from '@ionic/angular/standalone';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { GameService } from '../services/game.service';


@Component({
  selector: 'app-upload-game',
  templateUrl: './upload-game.page.html',
  styleUrls: ['./upload-game.page.scss'],
  standalone: true,
  imports: [IonCard, IonTextarea, IonCardContent, IonCardHeader, IonCardTitle, IonInput, IonItem, IonButton, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonLabel, ReactiveFormsModule]
})

export class UploadGamePage {
  gameForm: FormGroup;

  private apiUrl = 'http://localhost:3000/api/games/upload'; // URL del server Node.js

  constructor(private fb: FormBuilder, 
              private gameService: GameService, 
              private authService: AuthService, 
              private toast: ToastController) {
    this.gameForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      icon: [null, Validators.required],
      html: [null, Validators.required],
      js: [null, Validators.required],
      css: [null, Validators.required]
    });
  }

  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      this.gameForm.patchValue({ [fileType]: file });
      this.gameForm.get(fileType)?.updateValueAndValidity(); // Trigger validation
    }
  }

  submitGame() {
    if (this.gameForm.invalid) {
      console.error('form non valido');
      this.presentToast('Compila tutti i campi correttamente.', 'danger');
      return;
    }

    //controllo effettuato anche in backend tramite sessione, lo faccio qua solo per fare il logout 
    if (!this.authService.isLoggedIn) {
      this.authService.logout("utente non autenticato, impossibile caricare il gioco");
      return;
    }

    const formData = new FormData();
    
    formData.append('name', this.gameForm.get('name')?.value);
    formData.append('description', this.gameForm.get('description')?.value);
    formData.append('icon', this.gameForm.get('icon')?.value);
    formData.append('html', this.gameForm.get('html')?.value);
    formData.append('js', this.gameForm.get('js')?.value);
    formData.append('css', this.gameForm.get('css')?.value);

    this.gameService.createGame(formData).subscribe({
      next: (response) => {
        this.presentToast(response.message, 'success');
        console.log(response);
      },
      error: (error) => {
        const errorMessage = error.error?.message || 'Caricamento fallito, per favore riprova.';
        this.presentToast(errorMessage, 'danger');
        console.error(errorMessage, error);
      }
    });
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toast.create({
      message,
      duration: 5000,
      color,
      position: 'top'
    });
    toast.present();
  }
}
