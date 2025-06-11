import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonCard, IonCardHeader, IonButton, IonCardContent, IonCardTitle, IonItem, IonLabel, IonInput } from '@ionic/angular/standalone';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonCardTitle, IonCardContent, IonButton, IonCardHeader, IonCard, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonInput, RouterLink]
})

export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async presentToast(message: string, color: string = 'danger') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  login() {
    // Qui chiamiamo AuthService passando username e password
    this.authService.login(this.username, this.password).subscribe({
      next: (response: any) => {
        console.log('Login riuscito', response);
        this.presentToast('Login riuscito', 'success');
        this.router.navigate(['/home']);           // Solo dopo login riuscito navighi
      },
      error: (error) => {
        const errorMsg = error.error?.message || 'Errore sconosciuto';
        console.error('Errore di login:', error);
        this.presentToast(`Login fallito: ${errorMsg}`, 'danger');
      }
    });
  }

  ngOnInit() {
  }

}